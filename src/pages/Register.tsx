import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
const formSchema = z.object({
  companyName: z.string().min(2, "Company name must be at least 2 characters"),
  companyAddress: z.string().min(5, "Address must be at least 5 characters"),
  contactName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();
  const {
    signUp,
    createCompany
  } = useAuth();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: "",
      companyAddress: "",
      contactName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: ""
    }
  });
  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    try {
      // Split contactName into first and last name
      const nameParts = values.contactName.split(' ');
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(' ') || "";

      // Register user
      const {
        error: signUpError,
        userId
      } = await signUp(values.email, values.password, {
        firstName,
        lastName,
        phone: values.phone
      });
      if (signUpError) {
        setIsLoading(false);
        return;
      }
      if (!userId) {
        toast({
          title: "Error creating company",
          description: "Could not get user ID after registration",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      // Create company with the user ID from registration
      const {
        error: companyError
      } = await createCompany({
        companyName: values.companyName,
        companyAddress: values.companyAddress
      }, userId);
      if (companyError) {
        toast({
          title: "Error creating company",
          description: companyError.message,
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }
      toast({
        title: "Registration successful",
        description: "Your account and company have been created. Please check your email for verification."
      });

      // Navigate to login page after successful registration
      // Since the user still needs to verify their email before accessing protected routes
      navigate("/login");
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  return <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create a Company Account</CardTitle>
            <CardDescription>
              Register your business to start ordering corporate catering
            </CardDescription>
          </CardHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium">Company Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <FormField control={form.control} name="companyName" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Company Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="companyAddress" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Company Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Primary Contact</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <FormField control={form.control} name="contactName" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="email" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="phone" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} type="tel" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="text-lg font-medium">Account Security</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                    <FormField control={form.control} name="password" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                    <FormField control={form.control} name="confirmPassword" render={({
                    field
                  }) => <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input {...field} type="password" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>} />
                  </div>
                </div>

                <div className="flex items-center">
                  <input id="terms" name="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-catering-secondary focus:ring-catering-secondary" required />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{" "}
                    <Link to="/terms" className="text-catering-secondary hover:text-purple-700">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className="text-catering-secondary hover:text-purple-700">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" disabled={isLoading} className="w-full bg-orange-600 hover:bg-orange-500">
                  {isLoading ? "Creating Account..." : "Create Company Account"}
                </Button>
                <p className="text-center text-sm text-gray-600">
                  Already have an account?{" "}
                  <Link to="/login" className="text-catering-secondary hover:text-purple-700">
                    Sign in
                  </Link>
                </p>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </div>
    </Layout>;
};
export default Register;