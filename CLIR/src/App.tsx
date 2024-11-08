import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { searchDocuments } from './services/api';
import type { SearchResult } from './types/search';
import { APIError } from './services/api';

function App() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const searchResults = await searchDocuments(query);
      setResults(searchResults);
    } catch (err) {
      if (err instanceof APIError) {
        setError(err.error.message);
      } else {
        setError('An unexpected error occurred');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center space-y-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Cross-Language Search
          </h1>
          
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {error && (
            <div className="w-full max-w-2xl p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
          
          {isLoading ? (
            <div className="w-full max-w-2xl p-4 text-center text-gray-600">
              Searching...
            </div>
          ) : (
            <SearchResults results={results} />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;