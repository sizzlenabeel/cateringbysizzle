
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { CompanySearch } from "@/components/CompanySearch";

interface JoinCompanySectionProps {
  userId: string;
  onSuccess: () => void;
}

export const JoinCompanySection = ({ userId, onSuccess }: JoinCompanySectionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [existingCompanies, setExistingCompanies] = useState<any[]>([]);
  const [isLoadingCompanies, setIsLoadingCompanies] = useState(true);
  const { toast } = useToast();

  const joinExistingCompany = async (companyId: string) => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          company_id: companyId,
          is_company_admin: false 
        })
        .eq('id', userId);

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
      onSuccess();
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

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Search and select your company:</h3>
      <CompanySearch onCompanySelect={joinExistingCompany} />
      {isLoading && (
        <div className="flex justify-center py-4">
          <Loader className="h-6 w-6 animate-spin text-orange-600" />
        </div>
      )}
    </div>
  );
};
