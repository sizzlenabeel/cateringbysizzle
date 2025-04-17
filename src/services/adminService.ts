
import { supabase } from "@/integrations/supabase/client";
import { EventType, MenuItem, ServingStyle, SubProduct } from "@/types/supabase";

// Function to seed the database with sample menu items for demonstration
export async function seedSampleMenuItems() {
  try {
    // Get all event types and serving styles
    const { data: eventTypes } = await supabase.from("event_types").select("*");
    const { data: servingStyles } = await supabase.from("serving_styles").select("*");
    
    if (!eventTypes?.length || !servingStyles?.length) {
      console.error("No event types or serving styles found");
      return false;
    }
    
    // Sample menu items to add
    const sampleMenuItems = [
      {
        name: "Continental Breakfast",
        description: "A light breakfast spread with pastries and fruits",
        base_price: 15,
        is_vegan: false,
        image_url: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3",
        minimum_quantity: 5,
        eventTypes: ["breakfast"],
        servingStyles: ["buffet", "plated"],
        subProducts: [
          { 
            name: "Croissants", 
            description: "Freshly baked butter croissants", 
            price: 3, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Fresh Fruit Platter", 
            description: "Seasonal fruits", 
            price: 4, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Yogurt Parfait", 
            description: "Greek yogurt with granola", 
            price: 3, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Vegan Pastries", 
            description: "Plant-based pastry selection", 
            price: 4, 
            is_vegan: true, 
            is_default: false 
          }
        ]
      },
      {
        name: "Lunch Buffet",
        description: "Hearty lunch options for your business meeting",
        base_price: 22,
        is_vegan: false,
        image_url: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?ixlib=rb-4.0.3",
        minimum_quantity: 10,
        eventTypes: ["lunch"],
        servingStyles: ["buffet"],
        subProducts: [
          { 
            name: "Sandwich Platter", 
            description: "Assorted gourmet sandwiches", 
            price: 8, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Garden Salad", 
            description: "Fresh mixed greens with vinaigrette", 
            price: 5, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Soup of the Day", 
            description: "Chef's daily selection", 
            price: 4, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Vegan Wraps", 
            description: "Plant-based wrap selection", 
            price: 7, 
            is_vegan: true, 
            is_default: false 
          }
        ]
      },
      {
        name: "Conference Package",
        description: "All-day catering for your conference needs",
        base_price: 35,
        is_vegan: false,
        image_url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3",
        minimum_quantity: 20,
        eventTypes: ["conference"],
        servingStyles: ["buffet", "food_stations"],
        subProducts: [
          { 
            name: "Morning Pastries", 
            description: "Assortment of fresh baked goods", 
            price: 6, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Lunch Buffet", 
            description: "Hot and cold lunch options", 
            price: 15, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Afternoon Snacks", 
            description: "Energy boosting treats", 
            price: 8, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Vegan Option", 
            description: "Full day plant-based alternative", 
            price: 12, 
            is_vegan: true, 
            is_default: false 
          }
        ]
      },
      {
        name: "Elegant Dinner",
        description: "Sophisticated plated dinner for special events",
        base_price: 42,
        is_vegan: false,
        image_url: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3",
        minimum_quantity: 15,
        eventTypes: ["dinner"],
        servingStyles: ["plated", "family_style"],
        subProducts: [
          { 
            name: "Filet Mignon", 
            description: "Premium cut with red wine reduction", 
            price: 18, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Roasted Potatoes", 
            description: "Herb-infused baby potatoes", 
            price: 6, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Seasonal Vegetables", 
            description: "Chef's selection of fresh vegetables", 
            price: 7, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Vegan Wellington", 
            description: "Plant-based main course option", 
            price: 16, 
            is_vegan: true, 
            is_default: false 
          }
        ]
      },
      {
        name: "Reception Canapés",
        description: "Elegant finger foods for cocktail receptions",
        base_price: 28,
        is_vegan: false,
        image_url: "https://images.unsplash.com/photo-1578922258730-e43385df7dee?ixlib=rb-4.0.3",
        minimum_quantity: 25,
        eventTypes: ["reception"],
        servingStyles: ["food_stations", "buffet"],
        subProducts: [
          { 
            name: "Assorted Canapés", 
            description: "Chef's selection of bite-sized appetizers", 
            price: 10, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Cheese Board", 
            description: "Artisanal cheeses with accompaniments", 
            price: 12, 
            is_vegan: false, 
            is_default: true 
          },
          { 
            name: "Crudité Platter", 
            description: "Fresh vegetables with dips", 
            price: 8, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Vegan Nibbles", 
            description: "Plant-based hors d'oeuvres", 
            price: 9, 
            is_vegan: true, 
            is_default: false 
          }
        ]
      },
      {
        name: "Vegan Feast",
        description: "Fully plant-based catering experience",
        base_price: 32,
        is_vegan: true,
        image_url: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3",
        minimum_quantity: 10,
        eventTypes: ["lunch", "dinner"],
        servingStyles: ["buffet", "family_style"],
        subProducts: [
          { 
            name: "Grain Bowls", 
            description: "Nutritious whole grain bowls", 
            price: 9, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Plant Proteins", 
            description: "Selection of tofu, tempeh, and seitan dishes", 
            price: 12, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Seasonal Vegetables", 
            description: "Locally sourced produce", 
            price: 7, 
            is_vegan: true, 
            is_default: true 
          },
          { 
            name: "Vegan Desserts", 
            description: "Sweet treats without animal products", 
            price: 8, 
            is_vegan: true, 
            is_default: true 
          }
        ]
      }
    ];
    
    // For each menu item
    for (const menuItem of sampleMenuItems) {
      // Insert the menu item
      const { data: insertedMenuItem, error: menuError } = await supabase
        .from("menu_items")
        .insert({
          name: menuItem.name,
          description: menuItem.description,
          base_price: menuItem.base_price,
          is_vegan: menuItem.is_vegan,
          image_url: menuItem.image_url,
          minimum_quantity: menuItem.minimum_quantity
        })
        .select()
        .single();
        
      if (menuError || !insertedMenuItem) {
        console.error("Error inserting menu item:", menuError);
        continue;
      }
      
      const menuItemId = insertedMenuItem.id;
      
      // Insert sub products and link them to the menu item
      for (const subProduct of menuItem.subProducts) {
        const { data: insertedSubProduct, error: subProductError } = await supabase
          .from("sub_products")
          .insert({
            name: subProduct.name,
            description: subProduct.description,
            price: subProduct.price,
            is_vegan: subProduct.is_vegan
          })
          .select()
          .single();
          
        if (subProductError || !insertedSubProduct) {
          console.error("Error inserting sub product:", subProductError);
          continue;
        }
        
        // Link the sub product to the menu item
        const { error: linkError } = await supabase
          .from("menu_item_sub_products")
          .insert({
            menu_item_id: menuItemId,
            sub_product_id: insertedSubProduct.id,
            is_default: subProduct.is_default
          });
          
        if (linkError) {
          console.error("Error linking sub product to menu item:", linkError);
        }
      }
      
      // Link event types to the menu item
      for (const eventTypeName of menuItem.eventTypes) {
        const eventType = eventTypes.find(et => et.name.toLowerCase() === eventTypeName.toLowerCase());
        if (eventType) {
          const { error: eventTypeError } = await supabase
            .from("menu_item_event_types")
            .insert({
              menu_item_id: menuItemId,
              event_type_id: eventType.id
            });
            
          if (eventTypeError) {
            console.error("Error linking event type to menu item:", eventTypeError);
          }
        }
      }
      
      // Link serving styles to the menu item
      for (const servingStyleName of menuItem.servingStyles) {
        const servingStyle = servingStyles.find(ss => ss.name.toLowerCase().replace(/\s+/g, '_') === servingStyleName.toLowerCase());
        if (servingStyle) {
          const { error: servingStyleError } = await supabase
            .from("menu_item_serving_styles")
            .insert({
              menu_item_id: menuItemId,
              serving_style_id: servingStyle.id
            });
            
          if (servingStyleError) {
            console.error("Error linking serving style to menu item:", servingStyleError);
          }
        }
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error seeding menu items:", error);
    return false;
  }
}
