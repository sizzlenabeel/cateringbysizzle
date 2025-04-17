
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
const CTASection = () => {
  return <section className="bg-catering-primary">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          <span className="block">Ready to elevate your corporate events?</span>
          <span className="block text-catering-accent">Create your company account today.</span>
        </h2>
        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0 space-x-4">
          <Link to="/register">
            <Button size="lg" className="bg-orange-600 hover:bg-orange-500">
              Register Now
            </Button>
          </Link>
          <Link to="/contact">
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-catering-primary">
              Contact Sales
            </Button>
          </Link>
        </div>
      </div>
    </section>;
};
export default CTASection;
