
import React, { useState } from "react";
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
  const [activeTab, setActiveTab] = useState("products");
  const { user } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated - in a real app, you'd check for admin role
  if (!user) {
    toast({
      title: "Access denied",
      description: "You need to be logged in to access the admin area.",
      variant: "destructive",
    });
    return <Navigate to="/login" />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-5 mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
            <TabsTrigger value="event-types">Event Types</TabsTrigger>
            <TabsTrigger value="serving-styles">Serving Styles</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
          </TabsList>
          
          <TabsContent value="products" className="space-y-4">
            <ProductsManager />
          </TabsContent>
          
          <TabsContent value="menu-items" className="space-y-4">
            <MenuItemsManager />
          </TabsContent>
          
          <TabsContent value="event-types" className="space-y-4">
            <EventTypesManager />
          </TabsContent>
          
          <TabsContent value="serving-styles" className="space-y-4">
            <ServingStylesManager />
          </TabsContent>
          
          <TabsContent value="relationships" className="space-y-4">
            <RelationshipsManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
