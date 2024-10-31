export interface Author {
  authorId: string;
  name: string;
  url?: string;
  affiliations: string[];
  paperCount: number;
  citationCount: number;
  hIndex: number;
  papers?: {
    paperId: string;
    title?: string;
    url?: string | null;
    venue?: string | null;
    year?: number | null;
    authors?: Author[];
    abstract?: string | null;
    citationCount?: number;
    publicationTypes?: string[] | null;
    externalIds?: Record<string, string>;
    citationStyles?: Record<string, string>;
    uniqueId?: string;
  }[];
  externalIds?: Record<string, string[]>;
  uniqueId: string;
}

export interface AuthorSearchResponse {
  total: number;
  offset: number;
  data: Author[];
}

export interface FollowData {
  authorId: string;
  authorName: string;
  authorUrl?: string;
  userEmail: string;
  followedAt: string;
}
