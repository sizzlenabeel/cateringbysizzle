
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
    <div className="relative min-h-[85vh] bg-gradient-to-br from-orange-50 to-orange-100 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/lovable-uploads/a1f306bf-ef08-4ea4-aa2d-9073abc9f6e4.png')] bg-cover bg-center opacity-5" />
      
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[85vh]">
          {/* Content Section */}
          <div className={`space-y-8 text-center lg:text-left py-12 transition-all duration-1000 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
                <span className="block bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                  Elevate Your
                </span>
                <span className="block text-gray-900">
                  Corporate Dining
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                Transform your workplace dining experience with our culturally rich, sustainable catering solutions.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link to="/register">
                <Button 
                  size="lg"
                  className="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 group shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/order">
                <Button 
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-orange-600 text-orange-600 hover:bg-orange-50"
                >
                  View Menu
                </Button>
              </Link>
            </div>
          </div>

          {/* Image Carousel Section */}
          <div className={`relative transition-all duration-1000 delay-300 ${
            isVisible ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
          }`}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Carousel
                opts={{
                  align: "start",
                  loop: true,
                }}
                className="w-full"
              >
                <CarouselContent>
                  {heroImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="relative aspect-[16/9]">
                        <img
                          src={image.src}
                          alt={image.alt}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="hidden lg:flex" />
                <CarouselNext className="hidden lg:flex" />
              </Carousel>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -z-10 top-8 right-8 w-72 h-72 bg-orange-400/20 rounded-full blur-3xl" />
            <div className="absolute -z-10 bottom-8 left-8 w-72 h-72 bg-orange-600/20 rounded-full blur-3xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
