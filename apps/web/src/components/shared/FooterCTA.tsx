import { FooterCTAProps } from '../../types';
import { Mail } from 'lucide-react';

export const FooterCTA = ({ data }: FooterCTAProps) => {
  return (
    <div id="contact" className="w-full max-w-5xl mx-auto px-4 py-24 transition-colors">
      <div className="bg-brand-light dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-12 md:p-16 relative overflow-hidden flex flex-col md:flex-row items-center justify-between transition-colors">
        
        {/* Background gradient hint */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400/5 dark:bg-brand-green/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 transition-colors"></div>

        <div className="max-w-xl relative z-10 text-center md:text-left mb-8 md:mb-0">
          <div className="w-10 h-10 bg-brand-green rounded-lg flex items-center justify-center font-bold text-brand-dark dark:text-slate-900 mb-6 mx-auto md:mx-0 shadow-sm transition-colors">
            {data.badge}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-brand-dark dark:text-white tracking-tight mb-4 transition-colors">
            {data.title.split('smarter?')[0]}
            <span className="text-brand-green">smarter?</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-lg transition-colors">
            {data.description}
          </p>
        </div>

        <button className="relative z-10 px-8 py-4 bg-white dark:bg-brand-green border border-slate-200 dark:border-brand-green text-brand-dark dark:text-slate-900 font-bold rounded-xl shadow-sm hover:shadow-md hover:bg-slate-50 dark:hover:bg-[#86c000] dark:hover:border-[#86c000] transition-all flex items-center gap-2 active:scale-95">
          <Mail className="w-5 h-5 text-brand-green dark:text-slate-900 transition-colors" />
          {data.buttonText}
        </button>
      </div>
    </div>
  );
};
