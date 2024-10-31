export interface Author {
  name: string;
  authorId?: string;
}

export interface OpenAccessPdf {
  url: string;
  status: string;
}

export interface Paper {
  paperId: string;
  title: string;
  url: string | null;
  venue: string | null;
  year: number | null;
  authors: Author[];
  abstract: string | null;
  citationCount: number;
  publicationTypes: string[] | null;
  externalIds: Record<string, any>;
  citationStyles: Record<string, string>;
  uniqueId: string;
  openAccessPdf?: OpenAccessPdf | null;
}

export interface SearchResponse {
  data: Paper[];
  next: number;
  offset: number;
  total: number;
}
