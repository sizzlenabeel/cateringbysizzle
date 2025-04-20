
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="relative bg-[#F97316] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-4 bg-[#F97316] sm:pb-8 md:pb-12 lg:max-w-2xl lg:w-full">
          <svg className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-[#F97316] transform translate-x-1/2" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <polygon points="50,0 100,0 50,100 0,100" />
          </svg>

          <div className="flex flex-col justify-center min-h-[60vh] sm:min-h-[50vh] gap-6 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center lg:items-start gap-4">
              <h1 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl md:text-5xl">
                <span className="block">Global Flavors for Your Workplace</span>
              </h1>
              <p className="text-base text-white/90 sm:text-lg sm:max-w-xl">
                Transform your workplace dining with culturally rich, sustainable catering.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/register">
                  <Button className="w-full flex items-center justify-center px-6 py-2 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 md:py-3 md:text-lg md:px-8">
                    Register company account
                  </Button>
                </Link>
                <Link to="/order">
                  <Button variant="outline" className="w-full flex items-center justify-center px-6 py-2 border border-white text-white bg-transparent hover:bg-white/10 md:py-3 md:text-lg md:px-8">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 lg:relative">
        <img 
          className="h-full w-full object-cover opacity-20 lg:opacity-100" 
          src="/lovable-uploads/a1f306bf-ef08-4ea4-aa2d-9073abc9f6e4.png" 
          alt="Sizzle chefs preparing diverse meals" 
        />
      </div>
    </div>
  );
};

export default Hero;
