import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { searchDocuments } from './services/api';
import type { SearchResult } from './types/search';
import { APIError } from './services/api';
import { AlertCircle } from 'lucide-react';

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
        setError('An unexpected error occurred. Please try again.');
      }
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Cross-Language Search
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl">
              Search documents in English and get results in both English and Hindi
            </p>
          </div>
          
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          
          {error && (
            <div className="w-full max-w-2xl p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="mt-1 text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}
          
          {isLoading ? (
            <div className="w-full max-w-2xl p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-300 border-t-blue-600"></div>
              <p className="mt-4 text-gray-600">Searching across languages...</p>
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