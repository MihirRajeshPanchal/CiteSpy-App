export interface Author {
    name: string;
    authorId?: string;
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
    externalIds: Record<string, string>;
    citationStyles: Record<string, string>;
    uniqueId: string;
  }
  
  export interface SearchResponse {
    data: Paper[];
    next: number;
    offset: number;
    total: number;
  }
  