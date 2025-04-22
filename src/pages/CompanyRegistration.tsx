import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import Layout from "@/components/layout/Layout";

const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyAddress: z.string().min(5, "Address must be at least 5 characters"),
  organizationNumber: z.string().min(5, "Organization number must be at least 5 characters")
});

const CompanyRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [existingCompanies, setExistingCompanies] = useState<any[]>([]);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const { data, error } = await supabase
        .from('companies')
        .select('*');
      
      if (data) setExistingCompanies(data);
      if (error) console.error('Error fetching companies:', error);
    };

    fetchCompanies();
  }, []);

  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
      organizationNumber: ""
    }
  });

  const handleSubmit = async (values: z.infer<typeof companyFormSchema>) => {
    if (!user) return;
    
    setIsLoading(true);
    try {
      // First create the company
      const { data: companyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: values.companyName,
            address: values.companyAddress,
            organization_number: values.organizationNumber
          }
        ])
        .select()
        .single();

      if (companyError) throw companyError;

      // Then update the user's profile with the company ID
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          company_id: companyData.id,
          is_company_admin: true 
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      toast({
        title: "Company Registered",
        description: "Your company has been successfully registered."
      });

      navigate("/order");
    } catch (error: any) {
      console.error("Error during company registration:", error);
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleExistingCompanySelect = async (companyId: string) => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          company_id: companyId,
          is_company_admin: false 
        })
        .eq('id', user.id);

      if (error) throw error;

      toast({
        title: "Company Associated",
        description: "You have been associated with the selected company."
      });

      navigate("/order");
    } catch (error: any) {
      console.error("Error during company association:", error);
      toast({
        title: "Association Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Company Registration</CardTitle>
            <CardDescription>
              Register your company or join an existing one
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Create New Company</h3>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
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
                    className="w-full mt-4 bg-orange-600 hover:bg-orange-500"
                  >
                    {isLoading ? "Registering..." : "Register Company"}
                  </Button>
                </form>
              </Form>
            </div>

            <div className="border-t my-6"></div>

            <div>
              <h3 className="text-lg font-medium mb-4">Or Join Existing Company</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {existingCompanies.map((company) => (
                  <Button 
                    key={company.id}
                    variant="outline" 
                    onClick={() => handleExistingCompanySelect(company.id)}
                    disabled={isLoading}
                    className="w-full"
                  >
                    {company.name}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyRegistration;
