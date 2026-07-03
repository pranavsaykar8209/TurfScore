import { MatchConsoleCard } from './MatchConsoleCard';
import { HeroSectionProps } from '../../../types';
import { Zap, Activity, Calculator } from 'lucide-react';

export const HeroSection = ({ data }: HeroSectionProps) => {
  const getIcon = (idx: number) => {
    switch(idx) {
      case 0: return <Zap className="w-6 h-6 text-slate-900 dark:text-white" />;
      case 1: return <Activity className="w-6 h-6 text-slate-900 dark:text-white" />;
      default: return <Calculator className="w-6 h-6 text-slate-900 dark:text-white" />;
    }
  };

  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 md:px-8 pt-48 pb-16 flex flex-col lg:flex-row lg:items-stretch items-center gap-12 lg:gap-8 overflow-visible">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHBhdGggZD0iTSA0MCAwIEwgMCAwIDAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iI2UyZThmMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+')] bg-[length:40px_40px] opacity-40 -z-20 [mask-image:radial-gradient(ellipse_at_center,black,transparent_80%)] dark:opacity-10 pointer-events-none"></div>
      
      {/* Left Content */}
      <div className="flex-1 flex flex-col text-center lg:text-left z-10">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm mb-6 transition-colors self-center lg:self-start">
          <div className="w-2 h-2 rounded-full bg-brand-green animate-pulse"></div>
          <span className="text-[10px] font-bold tracking-widest text-slate-600 dark:text-slate-300 uppercase transition-colors">
            {data.badge}
          </span>
        </div>
        
        <h1 className="text-6xl md:text-[5rem] lg:text-[5.5rem] font-black text-slate-900 dark:text-white tracking-tight leading-[1.05] mb-6 transition-colors">
          {data.title} <br className="hidden md:block" />
          <span className="block md:whitespace-nowrap mt-2 lg:mt-3 text-xl md:text-2xl lg:text-3xl font-extrabold tracking-tight">
            <span className="text-slate-500 dark:text-slate-400">Less arguing and more </span>
            <span className="text-slate-900 dark:text-white relative inline-block z-10">
              actually playing
              <span className="absolute bottom-0 left-0 w-full h-2 bg-brand-green/70 dark:bg-brand-green/50 -z-10 rounded-sm"></span>
            </span>
          </span>
        </h1>
        
        <p className="text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 lg:pr-24 xl:pr-32 mb-1 leading-relaxed transition-colors">
          {data.description}
        </p>

        <div className="mt-auto pt-4 flex flex-wrap lg:flex-nowrap justify-center lg:justify-start gap-3 md:gap-4">
          {data.stats.map((stat, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 w-[140px] md:w-[160px] lg:w-auto lg:flex-1 text-left shadow-sm flex items-center justify-between transition-colors">
              <div>
                <div className="font-bold text-slate-900 dark:text-white text-xl leading-none transition-colors mb-1">{stat.title}</div>
                <div className="text-[10px] font-bold text-slate-400 tracking-wider uppercase">{stat.subtitle}</div>
              </div>
              <div className="flex-shrink-0 text-slate-900 dark:text-white opacity-80">{getIcon(idx)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right Content - Match Console */}
      <div className="flex-1 flex justify-center lg:justify-end w-full lg:w-auto relative z-10 items-start">
        {/* Background gradient blob for visual flair */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-brand-green/10 blur-[80px] rounded-full -z-10"></div>
        
        {/* Match console with constrained height/alignment */}
        <div className="mt-8 lg:mt-0 w-full flex justify-center lg:justify-end">
          <MatchConsoleCard data={data.matchConsole} />
        </div>
      </div>
      
    </section>
  );
};
