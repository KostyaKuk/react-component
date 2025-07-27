import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import InputElem from '../inputElement/inputElem';
import CharacterCard from '../card/card';
import styles from './resultArea.module.css';
import type { Pokemon } from '../../types/types';
import { fetchPokemonByName, fetchPokemons } from '../../api/apiPokemon';

interface ResultAreaState {
  pokemons: Pokemon[];
  loading: boolean;
  error: Error | null;
  searchQuery: string;
  forceError: boolean;
}

const SEARCH_KEY = 'pokemon_search_query';

function ResultArea() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [state, setState] = useState<ResultAreaState>({
    pokemons: [],
    loading: true,
    error: null,
    searchQuery: '',
    forceError: false,
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const pageFromUrl = searchParams.get('page');
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });

  const getSavedSearch = useCallback((): string => {
    try {
      return localStorage.getItem(SEARCH_KEY) || '';
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return '';
    }
  }, []);

  const saveSearch = useCallback((query: string) => {
    try {
      localStorage.setItem(SEARCH_KEY, query);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }, []);

  const loadInitialData = useCallback(
    async (page = 1) => {
      setState((prev) => ({ ...prev, loading: true }));
      setCurrentPage(page);
      setSearchParams({ page: page.toString() });

      try {
        const offset = (page - 1) * 10;
        const pokemons = await fetchPokemons(10, offset);
        setState((prev) => ({ ...prev, pokemons, loading: false }));
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: new Error(String(error)),
          loading: false,
        }));
      }
    },
    [setSearchParams]
  );

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setState((prev) => ({ ...prev, searchQuery: '' }));
        await loadInitialData(1);
        return;
      }

      setState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const pokemon = await fetchPokemonByName(query);
        setState((prev) => ({
          ...prev,
          pokemons: [pokemon],
          loading: false,
          searchQuery: query,
        }));
        setSearchParams({});
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: new Error(String(error)),
          loading: false,
          pokemons: [],
          searchQuery: query,
        }));
        setSearchParams({});
      }
    },
    [loadInitialData, setSearchParams]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setState((prev) => ({ ...prev, searchQuery: query }));
      saveSearch(query);
    },
    [saveSearch]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch(state.searchQuery);
    },
    [handleSearch, state.searchQuery]
  );

  const throwTestError = useCallback(() => {
    setState((prev) => ({ ...prev, forceError: true }));
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (state.searchQuery) return;
      loadInitialData(newPage);
    },
    [loadInitialData, state.searchQuery]
  );

  useEffect(() => {
    const savedQuery = getSavedSearch();
    if (savedQuery) {
      setState((prev) => ({ ...prev, searchQuery: savedQuery }));
      handleSearch(savedQuery);
    } else {
      loadInitialData(currentPage);
    }
  }, [getSavedSearch, handleSearch, loadInitialData, currentPage]);

  if (state.forceError) {
    throw new Error('You clicked test error button!');
  }

  return (
    <div>
      <InputElem
        searchQuery={state.searchQuery}
        onSearchChange={handleSearchChange}
        onSearchSubmit={handleSearchSubmit}
      />

      <button className={styles.errorButton} onClick={throwTestError}>
        Test Error
      </button>

      <div className={styles.wrapperCards}>
        <CharacterCard
          pokemons={state.pokemons}
          loading={state.loading}
          error={state.error?.message || null}
        />
      </div>
      {!state.searchQuery && state.pokemons.length > 0 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Previous
          </button>

          <span>Page {currentPage}</span>

          <button onClick={() => handlePageChange(currentPage + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ResultArea;
