import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const Hero = () => {
  return <div className="relative bg-[#F97316] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-8 bg-[#F97316] sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-[#F97316] transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="pt-10 sm:pt-16 lg:pt-8 lg:pb-14 px-4 sm:px-6 lg:px-8">
            <div className="sm:text-center lg:text-left">
              <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
                <span className="block">
              </span>{" "}
                <span className="block text-white/80">Global Flavors for Your Workplace </span>
              </h1>
              <p className="mt-3 text-base text-white/90 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0"> Transform your workplace dining with culturally rich, sustainable catering.</p>
              <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-x-3">
                <div className="rounded-md shadow">
                  <Link to="/register">
                    <Button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 md:py-4 md:text-lg md:px-10">Register company account</Button>
                  </Link>
                </div>
                <div>
                  <Link to="/order">
                    <Button variant="outline" className="w-full flex items-center justify-center px-8 py-3 border border-white text-white bg-transparent hover:bg-white/10 md:py-4 md:text-lg md:px-10">
                      Order Now
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
        <img className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full" src="/lovable-uploads/a1f306bf-ef08-4ea4-aa2d-9073abc9f6e4.png" alt="Sizzle chefs preparing diverse meals" />
      </div>
    </div>;
};
export default Hero;
