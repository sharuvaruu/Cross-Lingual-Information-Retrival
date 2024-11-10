import type { SearchQuery, SearchResult, SearchError } from '../types/search';

const API_URL = 'http://localhost:5000/api';

export class APIError extends Error {
  constructor(public error: SearchError) {
    super(error.message);
    this.name = 'APIError';
  }
}

export async function searchDocuments(query: string): Promise<SearchResult[]> {
  if (!query.trim()) {
    throw new APIError({
      message: 'Search query cannot be empty',
      code: 'INVALID_INPUT'
    });
  }

  try {
    const response = await fetch(`${API_URL}/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: `HTTP error! status: ${response.status}`
      }));
      throw new APIError({
        message: errorData.detail || 'Search request failed',
        code: response.status.toString(),
        details: errorData
      });
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    throw new APIError({
      message: 'Unable to connect to the search service',
      code: 'CONNECTION_ERROR',
      details: error instanceof Error ? error.message : String(error)
    });
  }
}