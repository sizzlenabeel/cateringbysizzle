
import { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";

interface Company {
  id: string;
  name: string;
  address: string;
}

interface CompanySearchProps {
  onCompanySelect: (companyId: string) => void;
}

export const CompanySearch = ({ onCompanySelect }: CompanySearchProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const searchCompanies = async () => {
      if (searchTerm.length < 2) {
        setCompanies([]);
        return;
      }

      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('companies')
          .select('id, name, address')
          .ilike('name', `%${searchTerm}%`)
          .limit(5);

        if (error) throw error;
        setCompanies(data || []);
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
          placeholder="Search for your company..."
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
              className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              onClick={() => onCompanySelect(company.id)}
            >
              <h3 className="font-medium">{company.name}</h3>
              <p className="text-sm text-gray-500">{company.address}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
