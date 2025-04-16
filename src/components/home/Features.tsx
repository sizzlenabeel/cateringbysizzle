
import { Shield, Clock, Users, Utensils } from "lucide-react";

const features = [
  {
    name: "Quality Ingredients",
    description:
      "We use only the freshest, highest quality ingredients in all our catering options to ensure exceptional taste and presentation.",
    icon: Utensils,
  },
  {
    name: "Reliable Service",
    description:
      "Punctual delivery and setup, with a focus on professionalism. We understand the importance of timing in business environments.",
    icon: Clock,
  },
  {
    name: "Customized Menus",
    description:
      "Tailored menu options to meet your specific requirements, dietary restrictions, and event specifications.",
    icon: Users,
  },
  {
    name: "Corporate Account Benefits",
    description:
      "Simplified ordering, consolidated invoicing, and priority service for our registered business customers.",
    icon: Shield,
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-catering-secondary font-semibold tracking-wide uppercase">
            Why Choose Us
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Corporate Catering Excellence
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We understand the unique needs of business catering, providing reliable,
            high-quality service that makes your events successful.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-catering-secondary text-white">
                    <feature.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                    {feature.name}
                  </p>
                </dt>
                <dd className="mt-2 ml-16 text-base text-gray-500">
                  {feature.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
};

export default Features;
