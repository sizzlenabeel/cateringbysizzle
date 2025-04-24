
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateCompanyForm } from "@/components/company/CreateCompanyForm";
import { JoinCompanySection } from "@/components/company/JoinCompanySection";

const CompanyRegistration = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
  }, [user, navigate]);

  const handleSuccess = () => {
    navigate("/order");
  };

  if (!user) return null;

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-2xl my-8">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Company Setup</CardTitle>
            <CardDescription>
              To continue, you must either join your company or create a new one.<br />
              (You can only update your own profile, enforced securely by our policies.)
            </CardDescription>
          </CardHeader>
          
          <Tabs defaultValue="create">
            <div className="px-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create New Company</TabsTrigger>
                <TabsTrigger value="join">Join Existing Company</TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="create" className="p-6">
              <CreateCompanyForm userId={user.id} onSuccess={handleSuccess} />
            </TabsContent>
            
            <TabsContent value="join" className="p-6">
              <JoinCompanySection userId={user.id} onSuccess={handleSuccess} />
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </Layout>
  );
};

export default CompanyRegistration;
