
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";
import { supabase } from "./supabaseClient.ts";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  orderId: string;
  emailType: "customer" | "kitchen";
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

    const { orderId, emailType } = await req.json() as EmailRequest;
    
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

    console.log(`Authorized request for order ${orderId} from user ${user.id}`);
    
    // Fetch order details
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(`
        id, 
        status, 
        shipping_name,
        shipping_email,
        shipping_phone,
        shipping_address,
        subtotal_pre_tax,
        total_amount,
        order_items (
          menu_id,
          quantity,
          total_price,
          menu_items:menu_id (name)
        )
      `)
      .eq("id", orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Error fetching order: ${orderError?.message || "Order not found"}`);
    }

    // Fetch email template
    const templateName = emailType === "customer" ? "order_confirmation" : "kitchen_notification";
    const { data: template, error: templateError } = await supabase
      .from("email_templates")
      .select("subject, body")
      .eq("name", templateName)
      .single();

    if (templateError || !template) {
      throw new Error(`Error fetching template: ${templateError?.message || "Template not found"}`);
    }

    // Replace template placeholders
    let subject = template.subject.replace("{order_id}", order.id);
    let htmlContent = template.body
      .replace("{order_id}", order.id)
      .replace("{customer_name}", order.shipping_name)
      .replace("{total_amount}", `${order.total_amount} SEK`);

    // Add order items to the email
    const itemsList = order.order_items.map(
      (item: any) => `<li>${item.quantity}x ${item.menu_items.name} - ${item.total_price} SEK</li>`
    ).join("");
    
    htmlContent = htmlContent.replace("{items_list}", 
      `<ul>${itemsList}</ul>` || "<p>No items found</p>"
    );

    // Send the email
    const recipient = emailType === "customer" 
      ? order.shipping_email 
      : Deno.env.get("KITCHEN_EMAIL") || "kitchen@example.com";

    const emailResponse = await resend.emails.send({
      from: "Culinary Box <orders@culinarybox.com>",
      to: [recipient],
      subject: subject,
      html: htmlContent,
    });

    console.log(`${emailType} email sent for order ${orderId}:`, emailResponse);

    // Update order status to mark email as sent
    const updateColumn = emailType === "customer" ? "customer_email_sent" : "kitchen_email_sent";
    await supabase
      .from("orders")
      .update({ [updateColumn]: true })
      .eq("id", orderId);

    return new Response(JSON.stringify({ success: true, emailType, orderId }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error(`Error in send-order-emails function:`, error);
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
