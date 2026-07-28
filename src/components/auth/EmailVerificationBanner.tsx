
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { MailWarning } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

/**
 * Shown to signed-in users whose email address has not been confirmed yet.
 * Ordering is blocked at the database level for these accounts.
 */
export const EmailVerificationBanner = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(true);

  useEffect(() => {
    setIsVerified(!user || !!user.email_confirmed_at);
  }, [user]);

  if (isVerified || !user?.email) return null;

  const handleResend = async () => {
    setIsResending(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: user.email!,
      options: { emailRedirectTo: `${window.location.origin}/order` }
    });
    setIsResending(false);
    toast({
      title: error ? "Could not resend" : "Confirmation email sent",
      description: error ? error.message : `We sent a new link to ${user.email}.`,
      variant: error ? "destructive" : "default"
    });
  };

  return (
    <Alert className="mb-6 border-orange-300 bg-orange-50">
      <MailWarning className="h-4 w-4 text-orange-600" />
      <AlertTitle>Confirm your email to place orders</AlertTitle>
      <AlertDescription className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <span>
          We sent a confirmation link to {user.email}. You can browse and build a cart, but checkout
          stays locked until it's confirmed.
        </span>
        <Button variant="outline" size="sm" onClick={handleResend} disabled={isResending}>
          {isResending ? "Sending..." : "Resend email"}
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export const useIsEmailVerified = () => {
  const { user } = useAuth();
  return !user || !!user.email_confirmed_at;
};
