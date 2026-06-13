import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import FeaturedJobs from "@/components/FeaturedJobs";
import StatsSection from "@/components/StatsSection";
import WhyJoinSection from "@/components/WhyJoinSection";
import CTASection from "@/components/CTASection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturedJobs />
        <StatsSection />
        <WhyJoinSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
