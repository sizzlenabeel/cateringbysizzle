
import React, { createContext, useState, useEffect, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, userData: any) => Promise<{ error: any | null; userId?: string }>;
  signIn: (email: string, password: string) => Promise<{ error: any | null }>;
  signOut: () => Promise<void>;
  createCompany: (companyData: any, userId?: string) => Promise<{ data: any | null; error: any | null }>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
            phone: userData.phone,
          },
        },
      });
      
      if (error) {
        toast({
          title: "Registration failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Registration successful",
        description: "Please check your email to confirm your account.",
      });
      
      // Return the user ID so we can use it for company creation
      return { error: null, userId: data.user?.id };
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const createCompany = async (companyData: any, userId?: string) => {
    try {
      // Use either the provided userId or the current logged-in user's ID
      const targetUserId = userId || user?.id;
      
      if (!targetUserId) {
        return { 
          data: null, 
          error: new Error("User ID is required to create a company") 
        };
      }

      // First create the company with the correctly named properties
      const { data: newCompanyData, error: companyError } = await supabase
        .from('companies')
        .insert([
          {
            name: companyData.companyName,
            address: companyData.companyAddress,
          },
        ])
        .select()
        .single();

      if (companyError) {
        console.error("Error creating company:", companyError);
        return { data: null, error: companyError };
      }

      console.log("Company created successfully:", newCompanyData);

      // Then update the user profile with company_id in a separate transaction
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ 
          company_id: newCompanyData.id,
          is_company_admin: true
        })
        .eq('id', targetUserId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return { data: null, error: profileError };
      }

      console.log("Profile updated successfully for user:", targetUserId);

      return { data: newCompanyData, error: null };
    } catch (error: any) {
      console.error("Unexpected error during company creation:", error);
      return { data: null, error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
        return { error };
      }

      toast({
        title: "Welcome back!",
        description: "You have successfully logged in.",
      });
      
      return { error: null };
    } catch (error: any) {
      toast({
        title: "Unexpected error",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    createCompany,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
