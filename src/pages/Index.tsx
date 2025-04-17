
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import Features from "@/components/home/Features";
import MenuShowcase from "@/components/home/MenuShowcase";
import FoodPartners from "@/components/home/FoodPartners";
import Testimonials from "@/components/home/Testimonials";
import CTASection from "@/components/home/CTASection";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <Features />
      <MenuShowcase />
      <FoodPartners />
      <Testimonials />
      <CTASection />
    </Layout>
  );
};

export default Index;
