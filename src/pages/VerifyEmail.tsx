
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const VerifyEmail = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const email = (location.state as { email?: string } | null)?.email;

  const handleResend = async () => {
    if (!email) return;
    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email,
      options: { emailRedirectTo: `${window.location.origin}/order` }
    });
    setIsResending(false);

    toast({
      title: error ? "Could not resend" : "Confirmation email sent",
      description: error ? error.message : `We sent another link to ${email}.`,
      variant: error ? "destructive" : "default"
    });
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4">
        <Card className="w-full max-w-lg">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
              <MailCheck className="h-6 w-6 text-orange-600" />
            </div>
            <CardTitle className="text-2xl font-bold">Confirm your email</CardTitle>
            <CardDescription>
              {email
                ? `We've sent a confirmation link to ${email}.`
                : "We've sent you a confirmation link."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-gray-600">
            <p>
              Your account and company details are already saved. Click the link in the email to
              activate your account &mdash; you'll be signed in and taken straight to the menu.
            </p>
            <p>
              Orders can only be placed once your email address is confirmed. Check your spam folder
              if it hasn't arrived within a few minutes.
            </p>
          </CardContent>
          <CardFooter className="flex flex-col space-y-3">
            {email && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                disabled={isResending}
              >
                {isResending ? "Sending..." : "Resend confirmation email"}
              </Button>
            )}
            <p className="text-center text-sm text-gray-600">
              Already confirmed?{" "}
              <Link to="/login" className="text-catering-secondary hover:text-purple-700">
                Sign in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default VerifyEmail;
