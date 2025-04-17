
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const values = [
  {
    title: "Quality",
    description: "We use only the freshest ingredients and maintain the highest standards of food preparation and presentation.",
  },
  {
    title: "Reliability",
    description: "We understand timing is critical for business events. Our delivery is always on time and as promised.",
  },
  {
    title: "Diversity",
    description: "We celebrate diverse culinary traditions and empower chefs from immigrant backgrounds to share their unique food heritage.",
  },
  {
    title: "Social Impact",
    description: "We create opportunities for immigrant chefs, particularly women of color, to showcase their talents and build sustainable careers.",
  },
];

const About = () => {
  return (
    <Layout>
      <div className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
              About Sizzle
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-500">
              We're an innovative platform connecting ethnic home-chefs with businesses to create remarkable workplace dining experiences.
            </p>
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Sizzle (Kollectiv Kitchens AB) was founded in 2020 with a powerful vision: to create a platform that connects talented ethnic home-chefs with food enthusiasts while providing meaningful employment opportunities.
              </p>
              <p className="text-gray-600 mb-4">
                Our mission focuses on delivering authentic "soul food" through homemade meals prepared by our vetted chefs, fostering cultural culinary experiences. We're particularly proud that 90% of our chefs are women of color from immigrant backgrounds, many of whom had limited employment opportunities in Sweden before joining Sizzle.
              </p>
              <p className="text-gray-600">
                Today, we've grown to specialize in corporate catering and workplace dining experiences, providing diverse, culturally rich meals that enhance team morale and productivity. Through self-service fridges stocked with fresh meals, workplace food festivals, and themed catering, we're transforming how companies think about food at work.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Our chefs preparing diverse cuisine"
                className="w-full h-auto"
              />
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="flex items-center text-lg font-medium mb-3 text-orange-600">
                    <CheckCircle className="h-5 w-5 mr-2" />
                    {value.title}
                  </h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Our Team */}
          <div className="mb-20">
            <h2 className="text-2xl font-bold mb-6 text-center">Our Leadership Team</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Team Member 1 - Nabeel */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src="/lovable-uploads/307c73c0-2130-4990-a54c-b28831a9dff7.png"
                    alt="Nabeel"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Nabeel</h3>
                <p className="text-orange-600">Founder & CEO</p>
                <p className="text-gray-500 mt-2">
                  Visionary leader driving Sizzle's mission to connect immigrant chefs with corporate clients.
                </p>
              </div>

              {/* Team Member 2 - Vincent */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src="/lovable-uploads/0c456a1b-73e7-4264-8847-7d13af75da8c.png"
                    alt="Vincent"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Vincent</h3>
                <p className="text-orange-600">Founder & Tech Lead</p>
                <p className="text-gray-500 mt-2">
                  Technical mastermind behind our platform, creating seamless experiences for chefs and customers.
                </p>
              </div>

              {/* Team Member 3 - Jessica */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src="/lovable-uploads/5282a1ec-f35c-468b-a7c5-74af02ff7a32.png"
                    alt="Jessica"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Jessica</h3>
                <p className="text-orange-600">Founder & Finance</p>
                <p className="text-gray-500 mt-2">
                  Financial strategist ensuring sustainable growth and fair compensation for our chef network.
                </p>
              </div>

              {/* Team Member 4 - Henrick */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src="/lovable-uploads/b5b3ad36-46ae-4730-93d7-015bb34c7d8f.png"
                    alt="Henrick"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Henrick</h3>
                <p className="text-orange-600">Business Development & Sales</p>
                <p className="text-gray-500 mt-2">
                  Relationship builder connecting corporate clients with our diverse chef network and catering solutions.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Experience Sizzle?</h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-6">
              Join hundreds of satisfied businesses that trust us with their corporate catering needs.
              Create an account today to start ordering.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button className="bg-orange-600 hover:bg-orange-500">
                  Register Your Company
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                  Contact Our Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
