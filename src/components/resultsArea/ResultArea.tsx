import { useState, useEffect, useCallback } from 'react';
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
  const [state, setState] = useState<ResultAreaState>({
    pokemons: [],
    loading: true,
    error: null,
    searchQuery: '',
    forceError: false,
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

  const loadInitialData = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true }));

    try {
      const pokemons = await fetchPokemons(10);
      setState((prev) => ({ ...prev, pokemons, loading: false }));
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: new Error(String(error)),
        loading: false,
      }));
    }
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setState((prev) => ({ ...prev, searchQuery: '' }));
        await loadInitialData();
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
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: new Error(String(error)),
          loading: false,
          pokemons: [],
          searchQuery: query,
        }));
      }
    },
    [loadInitialData]
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

  useEffect(() => {
    const savedQuery = getSavedSearch();
    if (savedQuery) {
      setState((prev) => ({ ...prev, searchQuery: savedQuery }));
      handleSearch(savedQuery);
    } else {
      loadInitialData();
    }
  }, [getSavedSearch, handleSearch, loadInitialData]);

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
    </div>
  );
}

export default ResultArea;
