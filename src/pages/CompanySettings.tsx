
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Building, Pencil } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const CompanySettings = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "bysizzle",
    address: "Kungssätravägen 15, 12737 Stockholm",
    organizationNumber: "",
    billingEmail: "",
  });

  useEffect(() => {
    const loadCompanyData = async () => {
      if (!user?.id) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user.id)
        .single();

      if (!profile?.company_id) return;

      const { data: company, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', profile.company_id)
        .single();

      if (error) { console.error('Error loading company:', error); return; }
      if (company) {
        setFormData({
          companyName: company.name,
          address: company.address,
          organizationNumber: company.organization_number || "",
          billingEmail: company.billing_email || "", // This field isn't in the database schema according to the error
        });
      }
    };
    loadCompanyData();
  }, [user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get company_id from profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('company_id')
        .eq('id', user?.id)
        .single();

      if (!profile?.company_id) {
        throw new Error('No company associated with this user');
      }

      const { error } = await supabase
        .from('companies')
        .update({
          name: formData.companyName,
          address: formData.address,
          organization_number: formData.organizationNumber,
          billing_email: formData.billingEmail, // This field isn't in the database schema according to the error
        })
        .eq('id', profile.company_id);

      if (error) throw error;

      toast({
        title: "Company updated",
        description: "Company details have been successfully updated.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update company details. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <Layout>
      <div className="container mx-auto py-8">
        <Card className="max-w-2xl mx-auto">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Building className="h-6 w-6" />
              Company Settings
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              {isEditing ? "Cancel" : "Edit"}
            </Button>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="organizationNumber">Organization Number</Label>
                <Input
                  id="organizationNumber"
                  value={formData.organizationNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, organizationNumber: e.target.value })
                  }
                  readOnly={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="billingEmail">Invoice Email Address</Label>
                <Input
                  id="billingEmail"
                  value={formData.billingEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, billingEmail: e.target.value })
                  }
                  readOnly={!isEditing}
                />
              </div>
              {isEditing && (
                <Button type="submit" className="w-full bg-orange-600 hover:bg-orange-500">
                  Save Changes
                </Button>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanySettings;
