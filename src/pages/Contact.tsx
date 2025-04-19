import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Layout from "@/components/layout/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Mail, Phone, MapPin, Clock, CheckCircle } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const {
    toast
  } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible."
      });

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        message: ""
      });
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Submission Failed",
        description: "There was an error sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const values = [
    {
      title: "Quality",
      description: "We use only the freshest ingredients and maintain the highest standards of food preparation and presentation."
    },
    {
      title: "Reliability",
      description: "We understand timing is critical for business events. Our delivery is always on time and as promised."
    },
    {
      title: "Diversity",
      description: "We celebrate diverse culinary traditions and empower chefs from immigrant backgrounds to share their unique food heritage."
    },
    {
      title: "Social Impact",
      description: "We create opportunities for immigrant chefs, particularly women of color, to showcase their talents and build sustainable careers."
    }
  ];

  return (
    <Layout>
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Contact Us
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Have questions about our catering services? Get in touch with our team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-24">
            <div className="md:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                  <CardDescription>Find us using the details below</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-catering-secondary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Address</h3>
                      <p className="text-gray-600">123 Business Park, Suite 100<br />Corporate City, BZ 12345</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="h-5 w-5 text-catering-secondary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Phone</h3>
                      <p className="text-gray-600">+46 707-202-201</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Mail className="h-5 w-5 text-catering-secondary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Email</h3>
                      <p className="text-gray-600">nabeel@bysizzle.com</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-catering-secondary mr-3 mt-1" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600">Monday - Friday: 8am - 6pm<br />Saturday: 9am - 2pm<br />Sunday: Closed</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Send Us a Message</CardTitle>
                  <CardDescription>Fill out the form below and we'll get back to you shortly</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name</Label>
                        <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea id="message" name="message" rows={5} value={formData.message} onChange={handleChange} required />
                    </div>
                    <Button type="submit" className="w-full bg-catering-secondary hover:bg-purple-700" disabled={isLoading}>
                      {isLoading ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="py-16 bg-orange-50 rounded-lg">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl mb-4">
                About Sizzle
              </h2>
              <p className="max-w-3xl mx-auto text-lg text-gray-500">
                We're an innovative platform connecting ethnic home-chefs with businesses to create remarkable workplace dining experiences.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20 max-w-6xl mx-auto px-4">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-orange-600">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Our mission focuses on delivering authentic "soul food" through homemade meals prepared by our vetted chefs, fostering cultural culinary experiences. We're particularly proud that 90% of our chefs are women of color from immigrant backgrounds, many of whom had limited employment opportunities in Sweden before joining Sizzle.
                </p>
              </div>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80" alt="Our chefs preparing diverse cuisine" className="w-full h-auto" />
              </div>
            </div>

            <div className="mb-20 max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Our Values</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => (
                  <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="flex items-center text-lg font-medium mb-3 text-orange-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      {value.title}
                    </h3>
                    <p className="text-gray-600">{value.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4">
              <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">Our Leadership Team</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                    <img src="/lovable-uploads/307c73c0-2130-4990-a54c-b28831a9dff7.png" alt="Henrik" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-medium">Henrik</h3>
                  <p className="text-orange-600">Sales</p>
                  <p className="text-gray-500 mt-2">Relationship builder connecting corporate clients with our diverse chef network and catering solutions.</p>
                </div>

                <div className="text-center">
                  <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                    <img src="/lovable-uploads/0c456a1b-73e7-4264-8847-7d13af75da8c.png" alt="Vincent" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-medium">Vincent</h3>
                  <p className="text-orange-600">Founder & Tech Lead</p>
                  <p className="text-gray-500 mt-2">Technical mastermind behind our platform, creating seamless experiences for chefs and customers.</p>
                </div>

                <div className="text-center">
                  <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                    <img src="/lovable-uploads/5282a1ec-f35c-468b-a7c5-74af02ff7a32.png" alt="Jessica" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-medium">Jessica</h3>
                  <p className="text-orange-600">Founder & Finance</p>
                  <p className="text-gray-500 mt-2">Financial strategist ensuring sustainable growth and fair compensation for our chef network.</p>
                </div>

                <div className="text-center">
                  <div className="rounded-full overflow-hidden w-40 h-40 mx-auto mb-4">
                    <img src="/lovable-uploads/b5b3ad36-46ae-4730-93d7-015bb34c7d8f.png" alt="Nabeel" className="w-full h-full object-cover" />
                  </div>
                  <h3 className="text-lg font-medium">Nabeel</h3>
                  <p className="text-orange-600">Founder & CEO</p>
                  <p className="text-gray-500 mt-2">Founder and visionary focused on company strategy and chef relations.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
