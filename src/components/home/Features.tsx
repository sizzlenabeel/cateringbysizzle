
import { GlobeIcon, HeartIcon, ChefHatIcon, DocumentCheckIcon } from "lucide-react";

const features = [
  {
    name: "Diverse Culinary Experiences",
    description:
      "Authentic meals from chefs representing multiple cultural backgrounds, bringing global flavors to your workplace.",
    icon: GlobeIcon,
  },
  {
    name: "Social Impact",
    description:
      "90% of our chefs are women of color, empowered through economic opportunities and professional development.",
    icon: HeartIcon,
  },
  {
    name: "Expert Chef Network",
    description:
      "Carefully vetted professional chefs with passion for creating memorable dining experiences.",
    icon: ChefHatIcon,
  },
  {
    name: "Sustainable Sourcing",
    description:
      "Commitment to local, sustainable ingredients that support community food ecosystems.",
    icon: DocumentCheckIcon,
  },
];

const Features = () => {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-[#F97316] font-semibold tracking-wide uppercase">
            Our Unique Approach
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            More Than Just Catering
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            We're creating meaningful connections through food, supporting immigrant women 
            chefs, and transforming workplace dining experiences.
          </p>
        </div>

        <div className="mt-10">
          <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <dt>
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-[#F97316] text-white">
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
