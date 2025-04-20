
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const heroImages = [
  {
    src: "/lovable-uploads/a1f306bf-ef08-4ea4-aa2d-9073abc9f6e4.png",
    alt: "Sizzle chefs preparing diverse meals",
  },
  {
    src: "/lovable-uploads/5282a1ec-f35c-468b-a7c5-74af02ff7a32.png",
    alt: "Elegant catering setup",
  },
  {
    src: "/lovable-uploads/4b227686-9b1d-496e-a565-6f123e6dc32c.png",
    alt: "Professional catering service",
  },
];

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="relative bg-[#F97316] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="relative z-10 pb-4 bg-[#F97316] sm:pb-8 md:pb-12 lg:max-w-2xl lg:w-full lg:pr-8">
          <div className="flex flex-col justify-center min-h-[40vh] sm:min-h-[45vh] gap-6 px-4 sm:px-6 lg:px-8">
            <div 
              className={`flex flex-col items-center lg:items-start gap-4 transition-all duration-1000 transform ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}
            >
              <h1 className="text-3xl tracking-tight font-extrabold text-white sm:text-4xl md:text-5xl animate-fade-in">
                <span className="block">Global Flavors for</span>
                <span className="block text-black">Your Workplace</span>
              </h1>
              <p className="text-base text-white/90 sm:text-lg sm:max-w-xl animate-fade-in delay-200">
                Transform your workplace dining with culturally rich, sustainable catering.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto animate-fade-in delay-300">
                <Link to="/register" className="w-full sm:w-auto">
                  <Button className="w-full group bg-black hover:bg-gray-800 text-white">
                    Register company account
                    <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link to="/order" className="w-full sm:w-auto">
                  <Button variant="outline" className="w-full border-white text-white bg-transparent hover:bg-white/10">
                    Order Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute inset-y-0 right-0 w-full lg:w-1/2 lg:relative overflow-hidden">
        <Carousel
          className="w-full h-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent className="h-full">
            {heroImages.map((image, index) => (
              <CarouselItem key={index} className="h-full">
                <div className="relative h-full w-full">
                  <img
                    className="h-full w-full object-cover transition-opacity duration-500 opacity-20 lg:opacity-100"
                    src={image.src}
                    alt={image.alt}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#F97316]/80 to-transparent lg:hidden" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="hidden lg:block">
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </div>
        </Carousel>
      </div>
    </div>
  );
};

export default Hero;
