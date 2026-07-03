import { HowItWorksSectionProps } from '../../../types';
import { PlusCircle, Users, Settings2, PlayCircle } from 'lucide-react';

export const HowItWorksSection = ({ data }: HowItWorksSectionProps) => {
  const getIcon = (idx: string) => {
    switch(idx) {
      case '01': return <PlusCircle className="w-5 h-5" />;
      case '02': return <Users className="w-5 h-5" />;
      case '03': return <Settings2 className="w-5 h-5" />;
      default: return <PlayCircle className="w-5 h-5" />;
    }
  };

  return (
    <section id="how-it-works" className="w-full bg-transparent py-24 px-4 transition-colors">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="max-w-xl mx-auto text-center mb-16">
          <h3 className="text-xs md:text-sm font-bold tracking-widest text-green-700 dark:text-brand-green uppercase mb-4 transition-colors">
            {data.label}
          </h3>
          <h2 className="text-5xl md:text-6xl font-extrabold text-brand-dark dark:text-white tracking-tight leading-[1.1] mb-6 transition-colors">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">
              {data.description}
            </p>
          )}
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.cards.map((card) => (
            <div key={card.id} className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-3xl p-8 flex flex-col shadow-sm hover:shadow-2xl hover:shadow-brand-green/20 dark:hover:shadow-brand-green/10 hover:border-brand-green/30 dark:hover:border-brand-green/30 transition-all duration-300 group">
              {/* Icon and Count */}
              <div className="flex justify-between items-center mb-6">
                <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center text-brand-dark dark:text-slate-300 group-hover:scale-110 group-hover:text-brand-green transition-all">
                  {getIcon(card.id)}
                </div>
                <div className="text-[10px] font-bold text-brand-green">
                  {card.id}
                </div>
              </div>
              
              <div className="flex-1">
                <h4 className="text-xl font-bold text-brand-dark dark:text-white mb-3 transition-colors">{card.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed transition-colors">{card.description}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
