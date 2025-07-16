import { Component, type ChangeEvent, type FormEvent } from 'react';
import InputElem from '../inputElement/inputElem';
import CharacterCard from '../card/card';
import styles from './resultArea.module.css';
import type { Pokemon } from '../../types/types';
import { fetchPokemonByName, fetchPokemons } from '../../api/apiPokemon';

interface CharacterCardState {
  pokemons: Pokemon[];
  loading: boolean;
  error: Error | null;
  searchQuery: string;
  forceError: boolean;
}

class ResultArea extends Component<object, CharacterCardState> {
  private readonly SEARCH_KEY = 'pokemon_search_query';

  getSavedSearch = (): string => {
    try {
      return localStorage.getItem(this.SEARCH_KEY) || '';
    } catch (error) {
      console.error('Error reading localStorage:', error);
      return '';
    }
  };

  state: CharacterCardState = {
    pokemons: [],
    loading: true,
    error: null,
    searchQuery: this.getSavedSearch(),
    forceError: false,
  };

  saveSearch = (query: string) => {
    try {
      localStorage.setItem(this.SEARCH_KEY, query);
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  };

  componentDidMount() {
    const savedQuery = this.getSavedSearch();
    if (savedQuery) {
      this.setState({ searchQuery: savedQuery }, () => {
        this.handleSearch(savedQuery);
      });
    } else {
      this.loadInitialData();
    }
  }

  loadInitialData = async () => {
    this.setState({ loading: true });

    try {
      const pokemons = await fetchPokemons(10);
      this.setState({ pokemons, loading: false });
    } catch (error) {
      this.setState({ error: new Error(String(error)), loading: false });
    }
  };

  handleSearch = async (query: string) => {
    if (!query.trim()) {
      this.setState({ searchQuery: '' }, this.loadInitialData);
      return;
    }

    this.setState({ loading: true, error: null });

    try {
      const pokemon = await fetchPokemonByName(query);
      this.setState({
        pokemons: [pokemon],
        loading: false,
        searchQuery: query,
      });
    } catch (error) {
      this.setState({
        error: new Error(String(error)),
        loading: false,
        pokemons: [],
        searchQuery: query,
      });
    }
  };

  handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    this.setState({ searchQuery: query });
    this.saveSearch(query);
  };

  handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    this.handleSearch(this.state.searchQuery);
  };

  throwTestError = () => {
    this.setState({ forceError: true });
  };

  render() {
    const { pokemons, loading, error, searchQuery, forceError } = this.state;

    if (forceError) {
      throw new Error('You clicked test error button!');
    }

    return (
      <div>
        <InputElem
          searchQuery={searchQuery}
          onSearchChange={this.handleSearchChange}
          onSearchSubmit={this.handleSearchSubmit}
        />

        <button className={styles.errorButton} onClick={this.throwTestError}>
          Test Error
        </button>

        <div className={styles.wrapperCards}>
          <CharacterCard
            pokemons={pokemons}
            loading={loading}
            error={error?.message || null}
          />
        </div>
      </div>
    );
  }
}

export default ResultArea;
