import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
const partners = [{
  id: 1,
  name: "Chef Maria Rodriguez",
  description: "Specializing in fusion cuisine that blends Mediterranean and Latin American flavors. Maria's dishes are known for their bold tastes and vibrant presentations.",
  image: "/lovable-uploads/6a2b64a6-4fca-46b1-ab1c-9b4dd0dcd05a.png"
}, {
  id: 2,
  name: "The Nordic Kitchen",
  description: "Run by our talented duo Jonas and Erik, bringing modern Scandinavian cuisine with locally-sourced ingredients and traditional preservation techniques.",
  image: "/lovable-uploads/9d2a03f8-d8e0-4271-b8b0-c38d3508e3fb.png"
}, {
  id: 3,
  name: "Soul Food by Tasha",
  description: "Authentic Southern comfort food prepared by Chef Tasha, whose family recipes have been passed down through generations with a modern, healthier twist.",
  image: "/lovable-uploads/faaf9ab1-9f7f-48b1-be60-306207fc46a7.png"
}, {
  id: 4,
  name: "Global Flavors Collective",
  description: "A diverse team of chefs bringing international cuisine experiences from around the world, specializing in interactive cooking demonstrations for corporate events.",
  image: "/lovable-uploads/5631fa13-09c0-4a4f-898b-6442a968fd4d.png"
}, {
  id: 5,
  name: "Sofia's Wine & Dine",
  description: "Led by sommelier and chef Sofia, offering elegant wine pairing experiences with carefully crafted appetizers perfect for networking events and client receptions.",
  image: "/lovable-uploads/4b227686-9b1d-496e-a565-6f123e6dc32c.png"
}, {
  id: 6,
  name: "Spice Route Kitchen",
  description: "Chef Priya brings authentic South Asian flavors using traditional cooking methods and premium spices, offering vegetarian and plant-based options for diverse dietary needs.",
  image: "/lovable-uploads/8d16bbc1-4a4d-4150-b164-9893a10fd7a6.png"
}];
const FoodPartners = () => {
  return <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base font-semibold tracking-wide uppercase text-orange-600">
            Our Partners
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Meet Our Culinary Artisans
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We collaborate with the finest chefs and food specialists to bring exceptional dining experiences to your events.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {partners.map(partner => <Card key={partner.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-10 bg-gray-100">
                <img src={partner.image} alt={partner.name} className="object-cover w-full h-64" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={partner.image} alt={partner.name} />
                    <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-gray-900">{partner.name}</h3>
                </div>
                <p className="text-gray-600">{partner.description}</p>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default FoodPartners;