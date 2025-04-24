
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyAddress: z.string().min(5, "Address must be at least 5 characters"),
  organizationNumber: z.string().min(5, "Organization number must be at least 5 characters")
});

interface CreateCompanyFormProps {
  userId: string;
  onSuccess: () => void;
}

export const CreateCompanyForm = ({ userId, onSuccess }: CreateCompanyFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
      organizationNumber: ""
    }
  });

  const createNewCompany = async (values: z.infer<typeof companyFormSchema>) => {
    setIsLoading(true);
    try {
      const { data, error: insertError } = await supabase
        .from('companies')
        .insert([{
          name: values.companyName,
          address: values.companyAddress,
          organization_number: values.organizationNumber
        }])
        .select()
        .single();
        
      if (insertError) throw insertError;
      if (!data || !data.id) throw new Error("Failed to create company, no ID returned");

      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          company_id: data.id,
          is_company_admin: true 
        })
        .eq('id', userId);
        
      if (updateError) {
        if (updateError.code === '42501') {
          toast({
            title: "Permission denied",
            description: "You do not have permission to update this profile. (RLS policy blocked)",
            variant: "destructive"
          });
        } else {
          throw updateError;
        }
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success!",
        description: "Your company has been successfully registered.",
      });
      
      onSuccess();
    } catch (error: any) {
      console.error("Error during company creation:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(createNewCompany)}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="companyAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company Address</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="organizationNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Organization Number</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button 
          type="submit" 
          disabled={isLoading} 
          className="w-full mt-6 bg-orange-600 hover:bg-orange-500"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Creating Company...
            </>
          ) : (
            "Register Company"
          )}
        </Button>
      </form>
    </Form>
  );
};
