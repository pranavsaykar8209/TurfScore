import homeContent from '../data/home.json';
import { Navbar, FooterCTA } from '../components/shared';
import { HeroSection, FeatureSection, HowItWorksSection } from '../features/home/components';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans relative overflow-x-hidden text-brand-dark dark:text-slate-300 transition-colors">
      
      {/* Background Graphic - subtle radial gradient in top left */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-green/10 dark:from-brand-green/5 to-transparent pointer-events-none -z-10"></div>
      
      <Navbar data={homeContent.navbar} />
      
      <main className="flex-1 flex flex-col w-full">
        <HeroSection data={homeContent.hero} />
        <FeatureSection data={homeContent.whyTurfScore} />
        <HowItWorksSection data={homeContent.howItWorks} />
      </main>

      <FooterCTA data={homeContent.contact} />

    </div>
  );
}
