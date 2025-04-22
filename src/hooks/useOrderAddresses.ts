
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

export type Address = {
  id: string;
  name: string;
  address: string;
};

export type Company = {
  id: string;
  address: string;
  name: string;
  organization_number: string;
  billing_email?: string;
};

export const useOrderAddresses = (userId: string | undefined) => {
  const [company, setCompany] = useState<Company | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCompanyAndAddresses = async () => {
      setIsLoading(true);
      if (!userId) { setIsLoading(false); return; }
      const { data: profile } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", userId)
        .single();

      if (profile?.company_id) {
        const { data: comp } = await supabase
          .from("companies")
          .select("*")
          .eq("id", profile.company_id)
          .single();

        setCompany(comp);

        // Fetch addresses
        const { data: companyAddresses, error } = await supabase
          .from("company_addresses")
          .select("*")
          .eq("company_id", profile.company_id);

        if (companyAddresses && companyAddresses.length > 0) {
          const formattedAddresses = companyAddresses.map((addr: any) => ({
            id: addr.id,
            name: addr.name,
            address: addr.address
          }));
          setAddresses(formattedAddresses);

          // Pick default address or first one
          const defaultAddress = companyAddresses.find((a: any) => a.is_default) || companyAddresses[0];
          setSelectedAddress({
            id: defaultAddress.id,
            name: defaultAddress.name,
            address: defaultAddress.address
          });
        } else if (comp) {
          const defaultAddr = {
            id: "default",
            name: "Company Address",
            address: comp.address
          };
          setAddresses([defaultAddr]);
          setSelectedAddress(defaultAddr);
        }
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    };
    fetchCompanyAndAddresses();
  }, [userId]);

  const addAddress = async (newAddress: string) => {
    if (!newAddress.trim() || !company) return { error: "No address/company" };
    const { data, error } = await supabase
      .from("company_addresses")
      .insert({
        name: `Address ${addresses.length + 1}`,
        address: newAddress,
        company_id: company.id,
        is_default: addresses.length === 0
      })
      .select();
    if (error || !data[0]) return { error };
    const newAddrObj = {
      id: data[0].id,
      name: data[0].name,
      address: data[0].address
    };
    setAddresses([...addresses, newAddrObj]);
    setSelectedAddress(newAddrObj);
    return { data: newAddrObj };
  };

  return {
    company,
    addresses,
    selectedAddress,
    setSelectedAddress,
    isLoadingAddresses: isLoading,
    addAddress,
  };
};
