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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader } from "lucide-react";

const companyFormSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyAddress: z.string().min(5, "Address must be at least 5 characters"),
  organizationNumber: z.string().min(5, "Organization number must be at least 5 characters")
});

const CompanyRegistration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [existingCompanies, setExistingCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name');
        
        if (error) throw error;
        if (data) setExistingCompanies(data);
      } catch (error: any) {
        console.error('Error fetching companies:', error.message);
        toast({
          title: "Failed to load companies",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoadingCompanies(false);
      }
    };

    if (user) fetchCompanies();
  }, [user, toast]);

  const form = useForm<z.infer<typeof companyFormSchema>>({
    resolver: zodResolver(companyFormSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
      organizationNumber: ""
    }
  });

  const createNewCompany = async (values: z.infer<typeof companyFormSchema>) => {
    if (!user) return;
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
        .eq('id', user.id);
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
      navigate("/order");
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

  const joinExistingCompany = async (companyId: string) => {
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

      if (error) {
        if (error.code === '42501') {
          toast({
            title: "Permission denied",
            description: "You do not have permission to update this profile. (RLS policy blocked)",
            variant: "destructive"
          });
        } else {
          throw error;
        }
        setIsLoading(false);
        return;
      }

      toast({
        title: "Success!",
        description: "You've been successfully associated with the company.",
      });
      navigate("/order");
    } catch (error: any) {
      console.error("Error joining company:", error);
      toast({
        title: "Failed to Join",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Company Setup</CardTitle>
            <CardDescription>
              To continue, you must either join your company or create a new one.<br />
              (You can only update your own profile, enforced securely by our policies.)
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="create">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create New Company</TabsTrigger>
                <TabsTrigger value="join">Join Existing Company</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="create" className="p-6">
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
            </TabsContent>
            
            <TabsContent value="join" className="p-6">
              <div className="space-y-4">
                <h3 className="font-medium">Select an existing company to join:</h3>
                {isLoadingCompanies ? (
                  <div className="flex justify-center py-8">
                    <Loader className="h-8 w-8 animate-spin text-orange-600" />
                  </div>
                ) : existingCompanies.length > 0 ? (
                  <div className="grid grid-cols-1 gap-3">
                    {existingCompanies.map((company) => (
                      <Button 
                        key={company.id}
                        variant="outline" 
                        onClick={() => joinExistingCompany(company.id)}
                        disabled={isLoading}
                        className="w-full justify-start h-auto py-3 text-left"
                      >
                        <div>
                          <p className="font-medium">{company.name}</p>
                          <p className="text-xs text-gray-500">{company.address}</p>
                        </div>
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-6">No companies available to join</p>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyRegistration;
