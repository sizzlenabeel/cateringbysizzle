
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const menuCategories = [{
  title: "Jamaican power lunch",
  description: "Start the day right with our selection of breakfast options, from continental spreads to hot breakfast buffets.",
  image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  popular: true
}, {
  title: "The hong kong breakfast",
  description: "Impressive lunch solutions perfect for business meetings, from boxed lunches to buffet-style service.",
  image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80",
  popular: false
}, {
  title: "Filipino mingle",
  description: "Upscale catering options designed to impress at board meetings, client presentations, and VIP events.",
  image: "https://images.unsplash.com/photo-1476224203421-9ac39bcb3327?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  popular: true
}, {
  title: "Asian dinner buffet",
  description: "Keep your team energized with our selection of snacks, beverages, and refreshments for meeting breaks.",
  image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80",
  popular: false
}];

const MenuShowcase = () => {
  const { user } = useAuth();
  
  return <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base font-semibold tracking-wide uppercase text-orange-600">
            Our Offerings
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Catering Solutions for Every Business Need
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Explore our range of menu options designed specifically for corporate environments.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuCategories.map(category => <Card key={category.title} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="h-48 overflow-hidden">
                <img src={category.image} alt={category.title} className="w-full h-full object-cover transition-transform hover:scale-105" />
              </div>
              <CardHeader className="pt-4 pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">{category.title}</CardTitle>
                  {category.popular && <Badge className="bg-catering-accent text-white">Popular</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{category.description}</p>
              </CardContent>
              <CardFooter>
                <Link to={user ? "/order" : "/login"} className="w-full">
                  <Button className="w-full bg-orange-600 hover:bg-orange-500">
                    {user ? "View Menu" : "Login to Order"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>)}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Need a custom solution for your event?</p>
          <Link to="/contact">
            <Button variant="outline" className="border-catering-secondary text-orange-600 bg-red-50">
              Contact Us For Custom Quotes
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default MenuShowcase;
