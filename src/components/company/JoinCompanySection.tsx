
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
  
  // Fetch initial list of companies
  useEffect(() => {
    const fetchCompanies = async () => {
      setIsLoadingCompanies(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('*')
          .order('name')
          .limit(5);
        
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

    fetchCompanies();
  }, [toast]);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Search and select your company:</h3>
      <CompanySearch onCompanySelect={joinExistingCompany} />
      
      {isLoadingCompanies ? (
        <div className="flex justify-center py-8">
          <Loader className="h-8 w-8 animate-spin text-orange-600" />
        </div>
      ) : existingCompanies.length > 0 ? (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">Or select from recently added companies:</h4>
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
        </div>
      ) : null}
    </div>
  );
};
