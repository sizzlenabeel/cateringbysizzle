
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from "@/integrations/supabase/client";

type Chef = {
  id: string;
  name: string;
  description: string;
  image_url: string;
};

const FoodPartners = () => {
  const { data: chefs, isLoading } = useQuery({
    queryKey: ['chefs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chefs')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Chef[];
    }
  });

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
          {isLoading ? (
            // Loading skeleton UI
            Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="aspect-w-16 aspect-h-10 bg-gray-100">
                  <Skeleton className="w-full h-64" />
                </div>
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <Skeleton className="h-12 w-12 rounded-full mr-4" />
                    <Skeleton className="h-6 w-48" />
                  </div>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))
          ) : chefs?.map(chef => (
            <Card key={chef.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-w-16 aspect-h-10 bg-gray-100">
                <img src={chef.image_url} alt={chef.name} className="object-cover w-full h-64" />
              </div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 mr-4">
                    <AvatarImage src={chef.image_url} alt={chef.name} />
                    <AvatarFallback>{chef.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-xl font-semibold text-gray-900">{chef.name}</h3>
                </div>
                <p className="text-gray-600">{chef.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>;
};

export default FoodPartners;
