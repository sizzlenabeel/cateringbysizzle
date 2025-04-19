import { Card, CardContent } from "@/components/ui/card";
const testimonials = [{
  content: "Sizzle has been our go-to catering service for the past year. Their attention to detail, quality of food, and professional service make them stand out. Our clients are always impressed.",
  author: "Sarah Johnson",
  position: "Office Manager, TechCorp Inc."
}, {
  content: "We've used Sizzle for everything from small team meetings to major client presentations. The online ordering system makes it incredibly easy to manage our corporate account.",
  author: "Michael Chen",
  position: "Executive Assistant, Global Finance Group"
}, {
  content: "The customization options offered by Sizzle have been perfect for our diverse team's dietary needs. Their invoice system makes expense tracking straightforward for our accounting department.",
  author: "Priya Patel",
  position: "HR Director, Innovative Solutions"
}];

const Testimonials = () => {
  return <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center mb-12">
          <h2 className="text-base font-semibold tracking-wide uppercase text-orange-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl leading-8 font-bold tracking-tight text-gray-900 sm:text-4xl">
            Trusted by Leading Businesses
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
            Don't just take our word for it. Here's what our corporate clients have to say.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => <Card key={index} className="border-t-4 border-catering-secondary">
              <CardContent className="pt-6">
                <div className="relative">
                  <svg className="absolute top-0 left-0 transform -translate-x-6 -translate-y-8 h-16 w-16 text-gray-100" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                  <p className="relative text-gray-600 italic">{testimonial.content}</p>
                </div>
                <div className="mt-6">
                  <p className="text-base font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.position}</p>
                </div>
              </CardContent>
            </Card>)}
        </div>
      </div>
    </section>;
};
export default Testimonials;
