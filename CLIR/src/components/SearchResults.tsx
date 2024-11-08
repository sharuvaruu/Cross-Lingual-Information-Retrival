import React from 'react';
import type { SearchResult } from '../types/search';

interface SearchResultsProps {
  results: SearchResult[];
}

export function SearchResults({ results }: SearchResultsProps) {
  if (results.length === 0) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl space-y-4">
      {results.map((result) => (
        <div
          key={result.id}
          className="p-4 bg-white rounded-lg shadow-md space-y-2"
        >
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {result.title}
            </h3>
            {result.translated_title && (
              <h4 className="text-md text-gray-600">
                {result.translated_title}
              </h4>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-gray-700">{result.content}</p>
            {result.translated_content && (
              <p className="text-gray-600">{result.translated_content}</p>
            )}
          </div>
          <div className="text-sm text-gray-500">
            Relevance: {(result.relevance_score * 100).toFixed(1)}%
          </div>
        </div>
      ))}
    </div>
  );
}