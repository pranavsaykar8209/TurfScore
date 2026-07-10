import { ArrowUpRight, Bug, Handshake, Lightbulb, MessageCircle, type LucideIcon } from 'lucide-react';
import { FooterCTAProps } from '../../types';
import { Card } from '../ui';

interface ContactCard {
  title: string;
  description: string;
  action: string;
  href: string;
  icon: LucideIcon;
}

const contactCards: ContactCard[] = [
  {
    title: 'General Support',
    description: "Need help using TurfScore or have a general question? We're happy to help.",
    action: 'pranavsaykar.dct@gmail.com',
    href: 'mailto:pranavsaykar.dct@gmail.com',
    icon: MessageCircle,
  },
  {
    title: 'Report a Bug',
    description: "Found an issue while scoring or managing matches? Let us know and we'll fix it.",
    action: 'Report Issue',
    href: 'mailto:pranavsaykar.dct@gmail.com?subject=TurfScore%20Bug%20Report',
    icon: Bug,
  },
  {
    title: 'Feature Request',
    description: "Have an idea that would make TurfScore even better? We'd love to hear it.",
    action: 'Share Idea',
    href: 'mailto:pranavsaykar.dct@gmail.com?subject=TurfScore%20Feature%20Request',
    icon: Lightbulb,
  },
  {
    title: 'Business Inquiry',
    description: "Interested in partnerships, sponsorships or collaborations? Let's connect.",
    action: 'Contact Us',
    href: 'mailto:pranavsaykar.dct@gmail.com?subject=TurfScore%20Business%20Inquiry',
    icon: Handshake,
  },
];

export const FooterCTA = ({ data: _data }: FooterCTAProps) => {
  return (
    <div id="contact" className="w-full max-w-5xl mx-auto px-4 py-24 transition-colors">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
        {contactCards.map(({ title, description, action, href, icon: Icon }) => (
          <a
            key={title}
            href={href}
            aria-label={`${title}: ${action}`}
            className="group block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-green focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900"
          >
            <Card className="flex h-full min-h-[272px] flex-col border-slate-200/80 bg-white/80 p-6 shadow-sm backdrop-blur-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:border-brand-green/40 group-hover:shadow-lg dark:border-white/10 dark:bg-brand-card-dark/80 dark:group-hover:border-brand-green/30">
              <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-brand-green/15 text-brand-dark transition-transform duration-300 group-hover:scale-105 dark:bg-brand-green/10 dark:text-brand-green">
                <Icon className="h-5 w-5" aria-hidden="true" />
              </div>

              <h2 className="text-xl font-bold tracking-tight text-brand-dark dark:text-white">{title}</h2>
              <p className="mt-3 text-sm leading-6 text-slate-500 dark:text-slate-400">{description}</p>

              <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-sm font-semibold text-brand-dark transition-colors group-hover:text-slate-600 dark:text-brand-green dark:group-hover:text-brand-green/80">
                {action}
                <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
              </span>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
};
