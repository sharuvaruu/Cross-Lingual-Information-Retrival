import type { SearchQuery, SearchResult, SearchError } from '../types/search';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export class APIError extends Error {
  constructor(public error: SearchError) {
    super(error.message);
    this.name = 'APIError';
  }
}

export async function searchDocuments(query: string): Promise<SearchResult[]> {
  try {
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query } satisfies SearchQuery),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new APIError({
        message: errorData.detail || 'Search request failed',
        code: response.status.toString(),
        details: errorData
      });
    }

    const data = await response.json();
    return data.results.map((result: SearchResult) => ({
      ...result,
      relevance_score: Number(result.relevance_score)
    }));
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError({
      message: 'Failed to perform search',
      details: error instanceof Error ? error.message : error
    });
  }
}