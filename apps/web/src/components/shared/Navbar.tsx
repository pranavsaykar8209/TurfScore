import { NavbarProps } from '../../types';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = ({ data }: NavbarProps) => {
  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const el = document.querySelector(href);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="w-full flex justify-center pt-10 pb-6 px-4 absolute top-0 z-50">
      <div className="w-full max-w-6xl bg-white/90 dark:bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-between px-6 py-4 transition-colors">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-brand-green/20 flex items-center justify-center font-bold text-brand-green text-sm">
            TS
          </div>
          <span className="font-extrabold text-xl tracking-tight text-brand-dark dark:text-white transition-colors">
            {data.logo}
          </span>
        </div>
        
        <div className="flex items-center gap-4 md:gap-8">
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            {data.links.map((link, idx) => (
              <a 
                key={idx} 
                href={link.href} 
                onClick={(e) => handleScroll(e, link.href)}
                className="hover:text-brand-dark dark:hover:text-white transition-colors cursor-pointer"
              >
                {link.label}
              </a>
            ))}
            <div className="w-px h-4 bg-slate-200 dark:bg-slate-700"></div>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};
