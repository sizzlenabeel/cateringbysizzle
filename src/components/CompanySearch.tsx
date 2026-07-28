
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

export interface CompanySearchResult {
  id: string;
  name: string;
  address: string;
  organization_number: string;
}

interface CompanySearchProps {
  onCompanySelect: (companyId: string, company?: CompanySearchResult) => void;
  selectedCompanyId?: string;
}

export const CompanySearch = ({ onCompanySelect, selectedCompanyId }: CompanySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<CompanySearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchCompanies = async () => {
      if (searchTerm.trim().length < 2) {
        setCompanies([]);
        return;
      }

      setIsLoading(true);
      try {
        // Security-definer RPC: works before sign-in and only exposes public company fields
        const { data, error } = await supabase.rpc('search_companies', { q: searchTerm.trim() });

        if (error) throw error;
        setCompanies((data as CompanySearchResult[]) || []);
      } catch (error: any) {
        toast({
          title: "Error searching companies",
          description: error.message,
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(searchCompanies, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchTerm, toast]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search by company name or organization number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader className="h-4 w-4 animate-spin" />
          </div>
        )}
      </div>

      {companies.length > 0 && (
        <ul className="space-y-2">
          {companies.map((company) => (
            <li
              key={company.id}
              className={`p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors ${
                selectedCompanyId === company.id ? 'border-orange-500 bg-orange-50' : ''
              }`}
              onClick={() => onCompanySelect(company.id, company)}
            >
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.address}</p>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && searchTerm.trim().length >= 2 && companies.length === 0 && (
        <p className="text-sm text-gray-500">No companies matched that search.</p>
      )}
    </div>
  );
};
