
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
  checkCompanyAssociation: () => Promise<boolean>;
  isAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state changed:", event);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check admin status when auth state changes
        if (session?.user) {
          const { data, error } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', session.user.id)
            .single();
            
          if (!error && data) {
            setIsAdmin(data.is_admin);
          }
        } else {
          setIsAdmin(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single();
          
        if (!error && data) {
          setIsAdmin(data.is_admin);
        }
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      // Call Supabase signOut method
      const { error } = await supabase.auth.signOut();

      if (error) {
        // If there's an error, throw it to be caught by the catch block
        throw error;
      }

      // Reset all state
      setUser(null);
      setSession(null);
      setIsAdmin(false);

      // Show a success toast
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      // Handle any errors during logout
      toast({
        title: "Logout Error",
        description: error.message || "An error occurred while logging out.",
        variant: "destructive",
      });
    }
  };

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

  const checkCompanyAssociation = async () => {
    if (!user) return false;
    
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error checking company association:', error);
        return false;
      }

      return data.company_id !== null;
    } catch (error) {
      console.error('Unexpected error checking company:', error);
      return false;
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

  const value = {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    checkCompanyAssociation,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
