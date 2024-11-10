export interface TranslationResult {
  sourceText: string;
  translatedText: string;
  confidence: number;
  language: {
    source: string;
    target: string;
  };
}

export interface SearchResult {
  id: string;
  title: string;
  content: string;
  relevanceScore: number;
  translatedTitle?: string;
  translatedContent?: string;
}