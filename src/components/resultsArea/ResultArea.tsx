import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Outlet, useNavigate } from 'react-router-dom';
import InputElem from '../inputElement/inputElem';
import CharacterCard from '../card/card';
import styles from './resultArea.module.css';
import type { Pokemon } from '../../types/types';
import {
  useGetPokemonsQuery,
  useGetPokemonByNameQuery,
} from '../../api/pokemonApi';
import { useLocalStorageSearch } from '../../hooks/useLocalStorage';
import SelectedPanel from '../selectedPanel/selectedPanel';
import ToggleComponent from '../../themes/toggleComponent/toggleComponent';

interface ResultAreaState {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  forceError: boolean;
}

function ResultArea() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSaveSearch] = useLocalStorageSearch();
  const [inputValue, setInputValue] = useState(searchQuery);
  const [state, setState] = useState<ResultAreaState>({
    pokemons: [],
    loading: true,
    error: null,
    forceError: false,
  });

  const [currentPage, setCurrentPage] = useState(() => {
    const pageFromUrl = searchParams.get('page');
    return pageFromUrl ? parseInt(pageFromUrl, 10) : 1;
  });

  const {
    data: pokemonsData,
    isLoading: pokemonsLoading,
    isFetching,
    error: pokemonsError,
    refetch,
  } = useGetPokemonsQuery(
    { limit: 10, offset: (currentPage - 1) * 10 },
    { skip: !!searchQuery }
  );

  const {
    data: pokemonByName,
    isLoading: pokemonLoading,
    error: pokemonError,
  } = useGetPokemonByNameQuery(searchQuery, { skip: !searchQuery });

  useEffect(() => {
    if (searchQuery && pokemonByName) {
      setState({
        pokemons: [pokemonByName],
        loading: pokemonLoading,
        error: pokemonError ? 'Pokemon not found' : null,
        forceError: false,
      });
    } else if (pokemonsData) {
      setState({
        pokemons: pokemonsData,
        loading: pokemonsLoading || isFetching,
        error: pokemonsError ? 'Failed to load pokemons' : null,
        forceError: false,
      });
    } else {
      setState((prev) => ({
        ...prev,
        loading: pokemonsLoading || isFetching,
        error: pokemonsError ? 'Failed to load pokemons' : null,
        forceError: false,
      }));
    }
  }, [
    pokemonsData,
    pokemonByName,
    pokemonsLoading,
    isFetching,
    pokemonLoading,
    pokemonsError,
    pokemonError,
    searchQuery,
  ]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValue(e.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedQuery = inputValue.trim();
      setSaveSearch(trimmedQuery);
      if (!trimmedQuery) {
        setCurrentPage(1);
        setSearchParams({ page: '1' });
      }
    },
    [inputValue, setSaveSearch, setSearchParams]
  );

  const throwTestError = useCallback(() => {
    setState((prev) => ({ ...prev, forceError: true }));
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (searchQuery) return;
      setCurrentPage(newPage);
      setSearchParams({ page: newPage.toString() });
    },
    [searchQuery, setSearchParams]
  );

  const handleRefresh = useCallback(() => {
    setState((prev) => ({ ...prev, loading: true }));
    refetch();
  }, [refetch]);

  if (state.forceError) {
    throw new Error('You clicked test error button!');
  }

  const handleAboutUs = () => {
    navigate('/about');
  };

  return (
    <div className={styles.container}>
      <div className={styles.searchWrapper}>
        <InputElem
          searchQuery={inputValue}
          onSearchChange={handleSearchChange}
          onSearchSubmit={handleSearchSubmit}
        />
        <div className={styles.buttonsWrap}>
          <ToggleComponent />
          <button className={styles.errorButton} onClick={throwTestError}>
            Test Error
          </button>
          <button className={styles.aboutButton} onClick={handleAboutUs}>
            About Us
          </button>
          <button className={styles.refreshButton} onClick={handleRefresh}>
            Refresh
          </button>
        </div>
      </div>
      <div className={styles.columnsWrapper}>
        <div className={styles.resultsColumn}>
          <div className={styles.wrapperCards}>
            <CharacterCard
              pokemons={state.pokemons}
              loading={state.loading}
              error={state.error}
            />
          </div>
          {!searchQuery && state.pokemons.length > 0 && (
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
        <div className={styles.detailsColumn}>
          <Outlet />
        </div>
      </div>
      <SelectedPanel />
    </div>
  );
}

export default ResultArea;
