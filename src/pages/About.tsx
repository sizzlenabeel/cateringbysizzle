
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
    title: "Professionalism",
    description: "From our customer service to our delivery staff, we maintain the highest level of professionalism.",
  },
  {
    title: "Customization",
    description: "We tailor our menus and services to meet your specific requirements and company culture.",
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
              About Boardroom Bites
            </h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-500">
              We're a premium catering service dedicated to elevating corporate dining experiences
              for businesses of all sizes.
            </p>
          </div>

          {/* Our Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-2xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Boardroom Bites was founded in 2018 by a team of culinary professionals who recognized a gap in the
                corporate catering market. We saw that businesses needed more than just food delivery—they needed a
                reliable partner who understood the unique demands of corporate environments.
              </p>
              <p className="text-gray-600 mb-4">
                Starting with just a handful of local clients, we've grown to serve hundreds of businesses across
                the region, from small startups to Fortune 500 companies. Our focus has always been on quality,
                reliability, and exceptional customer service.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate our menus and services to meet the evolving needs of modern
                businesses, while maintaining the core values that have made us successful.
              </p>
            </div>
            <div className="rounded-lg overflow-hidden shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
                alt="Our team preparing catering"
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
                  <h3 className="flex items-center text-lg font-medium mb-3 text-catering-secondary">
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Team Member 1 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt="CEO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Michael Thompson</h3>
                <p className="text-catering-secondary">CEO & Founder</p>
                <p className="text-gray-500 mt-2">
                  Former executive chef with 15+ years of experience in high-end restaurants and catering.
                </p>
              </div>

              {/* Team Member 2 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=776&q=80"
                    alt="COO"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">Sarah Johnson</h3>
                <p className="text-catering-secondary">COO</p>
                <p className="text-gray-500 mt-2">
                  Brings 12 years of operational excellence from the hospitality industry.
                </p>
              </div>

              {/* Team Member 3 */}
              <div className="text-center">
                <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                  <img
                    src="https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=774&q=80"
                    alt="Culinary Director"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-medium">David Chen</h3>
                <p className="text-catering-secondary">Culinary Director</p>
                <p className="text-gray-500 mt-2">
                  Award-winning chef specialized in creating innovative menus for diverse dietary needs.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to Experience Boardroom Bites?</h2>
            <p className="max-w-2xl mx-auto text-gray-600 mb-6">
              Join hundreds of satisfied businesses that trust us with their corporate catering needs.
              Create an account today to start ordering.
            </p>
            <div className="flex justify-center space-x-4">
              <Link to="/register">
                <Button className="bg-catering-secondary hover:bg-purple-700">
                  Register Your Company
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-catering-secondary text-catering-secondary hover:bg-catering-secondary hover:text-white">
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
