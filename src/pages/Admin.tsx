import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import ProductsManager from "@/components/admin/ProductsManager";
import MenuItemsManager from "@/components/admin/MenuItemsManager";
import EventTypesManager from "@/components/admin/EventTypesManager";
import ServingStylesManager from "@/components/admin/ServingStylesManager";
import RelationshipsManager from "@/components/admin/RelationshipsManager";

const Admin = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    toast({
      title: "Access denied",
      description: "You need to be an admin to access this area.",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue="products" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
            <TabsTrigger value="event-types">Event Types</TabsTrigger>
            <TabsTrigger value="serving-styles">Serving Styles</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>
          <TabsContent value="products">
            <ProductsManager />
          </TabsContent>
          <TabsContent value="menu-items">
            <MenuItemsManager />
          </TabsContent>
          <TabsContent value="event-types">
            <EventTypesManager />
          </TabsContent>
          <TabsContent value="serving-styles">
            <ServingStylesManager />
          </TabsContent>
          <TabsContent value="relationships">
            <RelationshipsManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
