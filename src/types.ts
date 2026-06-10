export type Conference = {
  youtubeId: string;
  url: string;
  title: string;
  slug: string;
  date: string | null;
  participants: string[];
  biography: string;
  summary: string;
  editorialMarkdown: string;
  placeholder: boolean;
  thumbnail: string;
};

export type NewsItem = {
  title: string;
  excerpt: string;
  slug: string;
  category: string;
};

export type EditorialPost = {
  title: string;
  slug: string;
  date: string;
  category: string;
  tags: string[];
  excerpt: string;
  angle: string;
  thesis: string;
  whyNow: string;
  close: string;
  image?: string;
  relatedConferenceSlugs: string[];
};
