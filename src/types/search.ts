export interface SearchQuery {
  query: string;
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  translated_title: string | null;
  translated_content: string | null;
  relevance_score: number;
}

export interface SearchError {
  message: string;
  code?: string;
  details?: unknown;
}