import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Navbar, FooterCTA } from '../components/shared';
import { Button } from '@/components/ui';
import homeContent from '../data/home.json';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col font-sans relative overflow-hidden text-brand-dark dark:text-slate-300 transition-colors">
      
      {/* Background Graphic */}
      <div className="absolute top-0 left-0 w-full h-[600px] bg-gradient-to-b from-brand-green/10 dark:from-brand-green/5 to-transparent pointer-events-none -z-10"></div>
      
      <Navbar data={homeContent.navbar} />
      
      <main className="flex-1 flex flex-col items-center justify-center pt-36 pb-6 px-6 text-center z-10">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 rounded-3xl p-10 shadow-xl dark:shadow-slate-900/50 border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
          
          <div className="w-24 h-24 bg-brand-green/10 dark:bg-brand-green/20 text-brand-green rounded-full flex items-center justify-center mb-6">
            <span className="text-4xl font-bold font-heading">404</span>
          </div>
          
          <h1 className="text-3xl font-bold font-heading text-slate-900 dark:text-white mb-3">
            Page Not Found
          </h1>
          
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Oops! The page you are looking for doesn't exist or has been moved. Let's get you back on track.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button 
              variant="outline" 
              className="flex-1 rounded-xl h-12"
              onClick={() => navigate(-1)}
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Go Back
            </Button>
            
            <Button 
              variant="primary" 
              className="flex-1 rounded-xl h-12 bg-brand-green hover:bg-brand-green/90 text-slate-900 font-semibold"
              onClick={() => navigate('/')}
            >
              <Home className="w-5 h-5 mr-2" />
              Home
            </Button>
          </div>
        </div>
      </main>

      <FooterCTA data={homeContent.contact} />
    </div>
  );
}
