import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, Outlet, useNavigate } from 'react-router-dom';
import InputElem from '../inputElement/inputElem';
import CharacterCard from '../card/card';
import styles from './resultArea.module.css';
import type { Pokemon } from '../../types/types';
import { fetchPokemonByName, fetchPokemons } from '../../api/apiPokemon';
import { useLocalStorageSearch } from '../../hooks/useLocalStorage';
import SelectedPanel from '../selectedPanel/selectedPanel';
import ToggleComponent from '../../themes/toggleComponent/toggleComponent';

interface ResultAreaState {
  pokemons: Pokemon[];
  loading: boolean;
  error: Error | null;
  forceError: boolean;
}

function ResultArea() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSaveSearch] = useLocalStorageSearch();
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
        setSaveSearch('');
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
        }));
        setSearchParams({});
      } catch (error) {
        setState((prev) => ({
          ...prev,
          error: new Error(String(error)),
          loading: false,
          pokemons: [],
        }));
        setSearchParams({});
      }
    },
    [loadInitialData, setSaveSearch, setSearchParams]
  );

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const query = e.target.value;
      setSaveSearch(query);
    },
    [setSaveSearch]
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleSearch(searchQuery);
    },
    [handleSearch, searchQuery]
  );

  const throwTestError = useCallback(() => {
    setState((prev) => ({ ...prev, forceError: true }));
  }, []);

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (searchQuery) return;
      loadInitialData(newPage);
    },
    [loadInitialData, searchQuery]
  );

  useEffect(() => {
    if (searchQuery) {
      handleSearch(searchQuery);
    } else {
      loadInitialData(currentPage);
    }
  }, [searchQuery, handleSearch, loadInitialData, currentPage]);

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
          searchQuery={searchQuery}
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
        </div>
      </div>
      <div className={styles.columnsWrapper}>
        <div className={styles.resultsColumn}>
          <div className={styles.wrapperCards}>
            <CharacterCard
              pokemons={state.pokemons}
              loading={state.loading}
              error={state.error?.message || null}
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
