
import React, { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ProductsManager from "@/components/admin/ProductsManager";
import MenuItemsManager from "@/components/admin/MenuItemsManager";
import EventTypesManager from "@/components/admin/EventTypesManager";
import ServingStylesManager from "@/components/admin/ServingStylesManager";
import RelationshipsManager from "@/components/admin/RelationshipsManager";
import OrdersManager from "@/components/admin/OrdersManager";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data, error } = await supabase.rpc('is_admin');
        if (error) throw error;
        setIsAdmin(data);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      }
    };

    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  // Loading state while checking admin status
  if (isAdmin === null) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <p>Checking permissions...</p>
        </div>
      </Layout>
    );
  }

  // Redirect if not authenticated or not admin
  if (!user || !isAdmin) {
    toast({
      title: "Access denied",
      description: !user 
        ? "You need to be logged in to access the admin area."
        : "You don't have admin privileges to access this area.",
      variant: "destructive",
    });
    return <Navigate to="/" />;
  }

  return (
    <Layout>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-8">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="menu-items">Menu Items</TabsTrigger>
            <TabsTrigger value="event-types">Event Types</TabsTrigger>
            <TabsTrigger value="serving-styles">Serving Styles</TabsTrigger>
            <TabsTrigger value="relationships">Relationships</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
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
          
          <TabsContent value="orders" className="space-y-4">
            <OrdersManager />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Admin;
