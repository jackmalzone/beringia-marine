'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { ArticleData } from '@/types/insights';
import { searchArticles } from '@/lib/data/insights';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  onSearchResults: (_results: ArticleData[], _query: string) => void;
  onSearchClear: () => void;
}

export default function SearchBar({ onSearchResults, onSearchClear }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [resultsCount, setResultsCount] = useState<number | null>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Debounced search function
  const performSearch = useCallback(
    (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResultsCount(null);
        setIsSearching(false);
        onSearchClear();
        return;
      }

      setIsSearching(true);

      // Perform async search
      searchArticles(searchQuery)
        .then(results => {
          setResultsCount(results.length);
          setIsSearching(false);
          onSearchResults(results, searchQuery);
        })
        .catch(error => {
          console.error('Search error:', error);
          setIsSearching(false);
          onSearchResults([], searchQuery);
        });
    },
    [onSearchResults, onSearchClear]
  );

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Clear existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set loading state immediately if there's a query
    if (newQuery.trim()) {
      setIsSearching(true);
    }

    // Set new debounce timer (300ms)
    debounceTimerRef.current = setTimeout(() => {
      performSearch(newQuery);
    }, 300);
  };

  // Clear search
  const handleClear = () => {
    setQuery('');
    setResultsCount(null);
    setIsSearching(false);
    onSearchClear();

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.searchBar}>
      <div className={styles.searchBar__container}>
        {/* Search Icon */}
        <svg
          className={styles.searchBar__icon}
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M9 17A8 8 0 1 0 9 1a8 8 0 0 0 0 16zM19 19l-4.35-4.35"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Search Input */}
        <input
          type="search"
          className={styles.searchBar__input}
          placeholder="Search articles by title, topic, or tag..."
          value={query}
          onChange={handleInputChange}
          aria-label="Search articles"
          aria-describedby="search-results-status"
        />

        {/* Loading Spinner */}
        {isSearching && (
          <div className={styles.searchBar__spinner} role="status" aria-label="Searching articles">
            <svg
              className={styles.searchBar__spinnerIcon}
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="10"
                cy="10"
                r="8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="50"
                strokeDashoffset="25"
              />
            </svg>
          </div>
        )}

        {/* Clear Button */}
        {query && !isSearching && (
          <button
            className={styles.searchBar__clear}
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 5L5 15M5 5l10 10"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        )}
      </div>

      {/* Search Results Status */}
      {query && !isSearching && resultsCount !== null && (
        <div
          id="search-results-status"
          className={styles.searchBar__status}
          role="status"
          aria-live="polite"
        >
          {resultsCount === 0 ? (
            <span className={styles.searchBar__noResults}>
              No articles found for &quot;{query}&quot;
            </span>
          ) : (
            <span className={styles.searchBar__resultsCount}>
              Found {resultsCount} {resultsCount === 1 ? 'article' : 'articles'} for &quot;
              {query}&quot;
            </span>
          )}
        </div>
      )}
    </div>
  );
}
