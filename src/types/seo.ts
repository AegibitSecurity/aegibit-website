export interface SeoPage {
  slug: string;
  title: string;
  description: string;
  keywords?: string[];
}

export interface BlogPost extends SeoPage {
  date: string;
  author: string;
  readingTime: number;
  tags: string[];
}

export interface AlternativePage extends SeoPage {
  competitor: string;
  targetKeywords: string[];
}

export interface IndustryPage extends SeoPage {
  name: string;
  challenges: string[];
  solutions: string[];
  compliance: string[];
}
