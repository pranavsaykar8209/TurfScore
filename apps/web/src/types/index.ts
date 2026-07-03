export interface NavbarProps {
  data: {
    logo: string;
    links: { label: string; href: string }[];
  };
}

export interface FooterCTAProps {
  data: {
    badge: string;
    title: string;
    description: string;
    buttonText: string;
  };
}

export interface HeroSectionProps {
  data: {
    badge: string;
    title: string;
    highlightText: string;
    description: string;
    stats: { title: string; subtitle: string }[];
    matchConsole: {
      title: string;
      primaryButton: string;
      joinCodePlaceholder: string;
      joinButton: string;
    };
  };
}

export interface MatchConsoleCardProps {
  data: {
    title: string;
    primaryButton: string;
    joinCodePlaceholder: string;
    joinButton: string;
  };
}

export interface FeatureSectionProps {
  data: {
    label: string;
    title: string;
    description: string;
    cards: { id: string; title: string; description: string }[];
  };
}

export interface HowItWorksSectionProps {
  data: {
    label: string;
    title: string;
    description?: string;
    cards: { id: string; title: string; description: string }[];
  };
}
