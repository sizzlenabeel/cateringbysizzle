
// Types for our menu data
export type SubProduct = {
  id: string;
  name: string;
  description: string;
  price: number;
  isVegan: boolean;
  isDefault: boolean; // Whether this sub-product is included by default
};

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  basePrice: number; // Base price without optional sub-products
  image: string;
  eventTypes: string[]; // Which event types this menu is suitable for
  servingStyles: string[]; // Which serving styles this menu is suitable for
  isVegan: boolean;
  subProducts: SubProduct[];
};

// Event type options
export const eventTypes = [
  { id: "breakfast", label: "Breakfast", icon: "☕" },
  { id: "lunch", label: "Lunch", icon: "🍲" },
  { id: "dinner", label: "Dinner", icon: "🍽️" },
  { id: "mingle", label: "Mingle", icon: "🥂" },
  { id: "fika", label: "Fika", icon: "🧁" },
];

// Serving style options
export const servingStyles = [
  { id: "buffet", label: "Buffet Spread" },
  { id: "individual", label: "Individual Portions" },
];

// Sample menu data with sub-products
export const menuItems: MenuItem[] = [
  {
    id: "menu1",
    name: "Continental Breakfast",
    description: "A light breakfast spread with pastries and fruits",
    basePrice: 15,
    image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3",
    eventTypes: ["breakfast"],
    servingStyles: ["buffet", "individual"],
    isVegan: false,
    subProducts: [
      { id: "sub1", name: "Croissants", description: "Freshly baked butter croissants", price: 3, isVegan: false, isDefault: true },
      { id: "sub2", name: "Fresh Fruit Platter", description: "Seasonal fruits", price: 4, isVegan: true, isDefault: true },
      { id: "sub3", name: "Yogurt Parfait", description: "Greek yogurt with granola", price: 3, isVegan: false, isDefault: true },
      { id: "sub4", name: "Coffee & Tea", description: "Freshly brewed beverages", price: 2, isVegan: true, isDefault: true },
      { id: "sub5", name: "Vegan Pastries", description: "Plant-based pastry selection", price: 4, isVegan: true, isDefault: false },
      { id: "sub6", name: "Gluten-Free Muffins", description: "Various flavors available", price: 3.5, isVegan: false, isDefault: false },
    ]
  },
  {
    id: "menu2",
    name: "Power Breakfast",
    description: "Protein-rich breakfast options to fuel your day",
    basePrice: 18,
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?ixlib=rb-4.0.3",
    eventTypes: ["breakfast"],
    servingStyles: ["buffet", "individual"],
    isVegan: false,
    subProducts: [
      { id: "sub7", name: "Scrambled Eggs", description: "Free-range eggs", price: 4, isVegan: false, isDefault: true },
      { id: "sub8", name: "Smoked Salmon", description: "Norwegian salmon", price: 6, isVegan: false, isDefault: true },
      { id: "sub9", name: "Avocado Toast", description: "On sourdough bread", price: 5, isVegan: true, isDefault: true },
      { id: "sub10", name: "Protein Smoothies", description: "Choice of flavors", price: 4, isVegan: true, isDefault: true },
      { id: "sub11", name: "Tofu Scramble", description: "Plant-based protein option", price: 4, isVegan: true, isDefault: false },
      { id: "sub12", name: "Turkey Bacon", description: "Lean protein option", price: 3, isVegan: false, isDefault: false },
    ]
  },
  {
    id: "menu3",
    name: "Mediterranean Lunch",
    description: "Fresh and flavorful Mediterranean-inspired lunch",
    basePrice: 22,
    image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3",
    eventTypes: ["lunch"],
    servingStyles: ["buffet", "individual"],
    isVegan: false,
    subProducts: [
      { id: "sub13", name: "Greek Salad", description: "With feta and olives", price: 5, isVegan: false, isDefault: true },
      { id: "sub14", name: "Hummus & Pita", description: "Freshly made hummus", price: 4, isVegan: true, isDefault: true },
      { id: "sub15", name: "Falafel", description: "Crispy chickpea patties", price: 5, isVegan: true, isDefault: true },
      { id: "sub16", name: "Grilled Chicken", description: "Herb marinated", price: 6, isVegan: false, isDefault: true },
      { id: "sub17", name: "Stuffed Grape Leaves", description: "Traditional dolmas", price: 4, isVegan: true, isDefault: false },
      { id: "sub18", name: "Baklava", description: "Sweet pastry dessert", price: 3, isVegan: false, isDefault: false },
    ]
  },
  {
    id: "menu4",
    name: "Executive Lunch",
    description: "Premium lunch option for business meetings",
    basePrice: 28,
    image: "https://images.unsplash.com/photo-1600335895229-6e75511892c8?ixlib=rb-4.0.3",
    eventTypes: ["lunch"],
    servingStyles: ["buffet", "individual"],
    isVegan: false,
    subProducts: [
      { id: "sub19", name: "Gourmet Sandwiches", description: "Assorted premium sandwiches", price: 7, isVegan: false, isDefault: true },
      { id: "sub20", name: "Quinoa Salad", description: "With roasted vegetables", price: 5, isVegan: true, isDefault: true },
      { id: "sub21", name: "Soup of the Day", description: "Chef's selection", price: 4, isVegan: false, isDefault: true },
      { id: "sub22", name: "Chocolate Brownies", description: "Rich and decadent", price: 3, isVegan: false, isDefault: true },
      { id: "sub23", name: "Vegan Wraps", description: "Plant-based protein options", price: 7, isVegan: true, isDefault: false },
      { id: "sub24", name: "Fresh Fruit Juice", description: "Seasonal selection", price: 3, isVegan: true, isDefault: false },
    ]
  },
  {
    id: "menu5",
    name: "Elegant Dinner Buffet",
    description: "Sophisticated dinner options for evening events",
    basePrice: 35,
    image: "https://images.unsplash.com/photo-1555244162-803834f70033?ixlib=rb-4.0.3",
    eventTypes: ["dinner"],
    servingStyles: ["buffet"],
    isVegan: false,
    subProducts: [
      { id: "sub25", name: "Roast Beef Carving Station", description: "With au jus", price: 10, isVegan: false, isDefault: true },
      { id: "sub26", name: "Garlic Mashed Potatoes", description: "Creamy and rich", price: 4, isVegan: false, isDefault: true },
      { id: "sub27", name: "Seasonal Vegetables", description: "Locally sourced", price: 5, isVegan: true, isDefault: true },
      { id: "sub28", name: "Dinner Rolls", description: "Freshly baked", price: 2, isVegan: false, isDefault: true },
      { id: "sub29", name: "Vegan Wellington", description: "Plant-based main dish", price: 9, isVegan: true, isDefault: false },
      { id: "sub30", name: "Chocolate Fondue", description: "With assorted dippables", price: 6, isVegan: false, isDefault: false },
    ]
  },
  {
    id: "menu6",
    name: "Plated Gourmet Dinner",
    description: "Individually plated fine dining experience",
    basePrice: 42,
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3",
    eventTypes: ["dinner"],
    servingStyles: ["individual"],
    isVegan: false,
    subProducts: [
      { id: "sub31", name: "Filet Mignon", description: "With red wine reduction", price: 15, isVegan: false, isDefault: true },
      { id: "sub32", name: "Truffle Risotto", description: "Creamy Arborio rice", price: 8, isVegan: false, isDefault: true },
      { id: "sub33", name: "Asparagus Bundle", description: "With hollandaise", price: 6, isVegan: false, isDefault: true },
      { id: "sub34", name: "Crème Brûlée", description: "Classic French dessert", price: 7, isVegan: false, isDefault: true },
      { id: "sub35", name: "Portobello Steak", description: "Vegan entrée option", price: 12, isVegan: true, isDefault: false },
      { id: "sub36", name: "Dairy-Free Chocolate Mousse", description: "Silky vegan dessert", price: 6, isVegan: true, isDefault: false },
    ]
  },
  {
    id: "menu7",
    name: "Evening Cocktail Mingle",
    description: "Sophisticated finger foods for networking events",
    basePrice: 30,
    image: "https://images.unsplash.com/photo-1578922258730-e43385df7dee?ixlib=rb-4.0.3",
    eventTypes: ["mingle"],
    servingStyles: ["buffet", "individual"],
    isVegan: false,
    subProducts: [
      { id: "sub37", name: "Assorted Canapés", description: "Chef's selection", price: 8, isVegan: false, isDefault: true },
      { id: "sub38", name: "Shrimp Cocktail", description: "With spicy sauce", price: 9, isVegan: false, isDefault: true },
      { id: "sub39", name: "Cheese & Charcuterie", description: "Premium selection", price: 10, isVegan: false, isDefault: true },
      { id: "sub40", name: "Sparkling Water", description: "Still & sparkling options", price: 2, isVegan: true, isDefault: true },
      { id: "sub41", name: "Vegan Canapés", description: "Plant-based finger foods", price: 8, isVegan: true, isDefault: false },
      { id: "sub42", name: "Mocktail Bar", description: "Non-alcoholic options", price: 5, isVegan: true, isDefault: false },
    ]
  },
  {
    id: "menu8",
    name: "Swedish Fika Spread",
    description: "Traditional Swedish coffee break with pastries",
    basePrice: 16,
    image: "https://images.unsplash.com/photo-1583778176476-4a8b8dcb5cb3?ixlib=rb-4.0.3",
    eventTypes: ["fika"],
    servingStyles: ["buffet", "individual"],
    isVegan: false,
    subProducts: [
      { id: "sub43", name: "Kanelbullar", description: "Swedish cinnamon buns", price: 3, isVegan: false, isDefault: true },
      { id: "sub44", name: "Cardamom Buns", description: "Aromatic Swedish specialty", price: 3, isVegan: false, isDefault: true },
      { id: "sub45", name: "Premium Coffee", description: "Locally roasted", price: 3, isVegan: true, isDefault: true },
      { id: "sub46", name: "Tea Selection", description: "Various blends", price: 2, isVegan: true, isDefault: true },
      { id: "sub47", name: "Vegan Swedish Cookies", description: "Plant-based treats", price: 3, isVegan: true, isDefault: false },
      { id: "sub48", name: "Gluten-Free Pastries", description: "Special dietary options", price: 4, isVegan: false, isDefault: false },
    ]
  },
  {
    id: "menu9",
    name: "Vegan Lunch Delight",
    description: "Fully plant-based lunch options",
    basePrice: 24,
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-4.0.3",
    eventTypes: ["lunch"],
    servingStyles: ["buffet", "individual"],
    isVegan: true,
    subProducts: [
      { id: "sub49", name: "Buddha Bowl", description: "Grains, veggies, and proteins", price: 8, isVegan: true, isDefault: true },
      { id: "sub50", name: "Vegan Caesar Salad", description: "With plant-based dressing", price: 6, isVegan: true, isDefault: true },
      { id: "sub51", name: "Sweet Potato Fries", description: "Crispy and lightly spiced", price: 4, isVegan: true, isDefault: true },
      { id: "sub52", name: "Fresh Fruit Platter", description: "Seasonal selection", price: 5, isVegan: true, isDefault: true },
      { id: "sub53", name: "Chickpea Curry", description: "Hearty protein option", price: 7, isVegan: true, isDefault: false },
      { id: "sub54", name: "Vegan Chocolate Cake", description: "Decadent dessert", price: 5, isVegan: true, isDefault: false },
    ]
  },
  {
    id: "menu10",
    name: "Vegan Mingle Package",
    description: "Plant-based finger foods for social gatherings",
    basePrice: 26,
    image: "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?ixlib=rb-4.0.3",
    eventTypes: ["mingle"],
    servingStyles: ["buffet"],
    isVegan: true,
    subProducts: [
      { id: "sub55", name: "Vegetable Spring Rolls", description: "With dipping sauce", price: 6, isVegan: true, isDefault: true },
      { id: "sub56", name: "Stuffed Mushrooms", description: "With herbed cashew cheese", price: 7, isVegan: true, isDefault: true },
      { id: "sub57", name: "Hummus Trio", description: "Classic, beet, and herb varieties", price: 5, isVegan: true, isDefault: true },
      { id: "sub58", name: "Fresh Crudités", description: "With avocado dip", price: 4, isVegan: true, isDefault: true },
      { id: "sub59", name: "Mini Falafel Bites", description: "With tahini sauce", price: 6, isVegan: true, isDefault: false },
      { id: "sub60", name: "Fruit Skewers", description: "With coconut yogurt dip", price: 5, isVegan: true, isDefault: false },
    ]
  }
];
