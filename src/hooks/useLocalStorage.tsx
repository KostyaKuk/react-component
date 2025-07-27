import { useState, useCallback } from 'react';

const SEARCH_KEY = 'pokemon_search_query';

export const useLocalStorageSearch = (initialValue: string = '') => {
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      const saved = localStorage.getItem(SEARCH_KEY);
      return saved !== null ? saved : initialValue;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  const saveSearch = useCallback((query: string) => {
    setSearchQuery(query);
    try {
      localStorage.setItem(SEARCH_KEY, query);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  return [searchQuery, saveSearch] as const;
};
