
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { supabase } from "./supabaseClient.ts";
import { generateInvoicePDF } from "./invoice-generator.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface InvoiceRequest {
  orderId: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // SECURITY: Verify JWT token and get authenticated user
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      console.error('Invalid token:', authError);
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { orderId } = await req.json() as InvoiceRequest;
    
    // SECURITY: Verify user owns the order or is admin
    const { data: isOwner } = await supabase.rpc('user_owns_order', {
      _user_id: user.id,
      _order_id: orderId
    });

    const { data: isAdmin } = await supabase.rpc('is_admin');

    if (!isOwner && !isAdmin) {
      console.error('Forbidden: User does not own order and is not admin', { userId: user.id, orderId });
      return new Response(JSON.stringify({ error: 'Forbidden' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log(`Authorized invoice request for order ${orderId} from user ${user.id}`);

    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          id,
          menu_id,
          quantity,
          total_price,
          menu_items:menu_id (name, base_price)
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Error fetching order: ${orderError?.message || "Order not found"}`);
    }

    // Fetch customer company information
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("company_id")
      .eq("id", order.user_id)
      .single();

    if (profileError) {
      console.warn(`Could not fetch company for user: ${profileError.message}`);
    }

    let company = null;
    if (profile?.company_id) {
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("id", profile.company_id)
        .single();
      
      company = companyData;
    }

    // Generate invoice reference number if not exists
    let reference = order.reference;
    if (!reference) {
      reference = `INV-${new Date().getFullYear()}-${orderId.substring(0, 8)}`;
      await supabase
        .from("orders")
        .update({ reference })
        .eq("id", orderId);
    }

    // Generate PDF invoice
    const invoicePdfBase64 = await generateInvoicePDF({
      order: {
        ...order,
        reference,
      },
      company,
    });

    // Update order to mark invoice as generated
    await supabase
      .from("orders")
      .update({ 
        invoice_generated: true,
      })
      .eq("id", orderId);

    return new Response(JSON.stringify({ 
      success: true, 
      orderId,
      invoicePdfBase64,
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error(`Error in generate-invoice function:`, error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
