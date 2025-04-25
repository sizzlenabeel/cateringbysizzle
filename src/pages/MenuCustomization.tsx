
import React, { useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useMenuCustomization } from "@/hooks/useMenuCustomization";
import { LoadingState } from "@/components/menu-customization/LoadingState";
import { MenuCustomizationContent } from "@/components/menu-customization/MenuCustomizationContent";

const MenuCustomization = () => {
  const {
    menuItem,
    isLoading,
    customizedMenu,
    minimumQuantity,
    toggleSubProduct,
    setCustomizedMenu,
  } = useMenuCustomization();

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (!menuItem) {
    return (
      <Layout>
        <div className="container mx-auto py-8 px-4">
          <p>Menu not found.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <MenuCustomizationContent
        menuItem={menuItem}
        customizedMenu={customizedMenu}
        minimumQuantity={minimumQuantity}
        onUpdateQuantity={(quantity) => setCustomizedMenu({ ...customizedMenu, quantity })}
        onToggleSubProduct={toggleSubProduct}
      />
    </Layout>
  );
};

export default MenuCustomization;
