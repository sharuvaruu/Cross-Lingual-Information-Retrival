import React from 'react';
import type { SearchResult } from '../types/search';
import { Globe2, Languages, Star, Info } from 'lucide-react';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return (
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md flex items-center space-x-3">
        <Info className="w-5 h-5 text-blue-500" />
        <p className="text-gray-600">No results found. Try a different search query.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl space-y-6">
      {results.map((result) => (
        <div
          key={result.id}
          className="p-6 bg-white rounded-lg shadow-md space-y-4 hover:shadow-lg transition-all duration-300"
        >
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center space-x-2">
                  <Globe2 className="w-5 h-5 text-blue-500" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    {result.title}
                  </h3>
                </div>
                {result.translated_title && (
                  <div className="flex items-center space-x-2">
                    <Languages className="w-4 h-4 text-indigo-500" />
                    <h4 className="text-lg text-gray-600">
                      {result.translated_title}
                    </h4>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-1 bg-blue-50 px-3 py-1 rounded-full">
                <Star className="w-4 h-4 text-blue-500" />
                <span className="text-sm font-medium text-blue-700">
                  {(result.relevance_score * 100).toFixed(0)}%
                </span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 border-t pt-3">
            <div className="prose prose-sm max-w-none">
              <p className="text-gray-700">{result.content}</p>
            </div>
            {result.translated_content && (
              <div className="prose prose-sm max-w-none border-l-4 border-indigo-100 pl-4">
                <p className="text-gray-600">{result.translated_content}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}