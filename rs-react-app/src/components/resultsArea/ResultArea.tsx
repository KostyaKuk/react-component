import { Component, type ChangeEvent, type FormEvent } from 'react';
import InputElem from '../inputElement/inputElem';
import type { CharacterCardState, PokemonResponse } from '../../types/types';
import CharacterCard from '../card/card';
import styles from './resultArea.module.css';

class ResultArea extends Component<object, CharacterCardState> {
  state: CharacterCardState = {
    pokemons: [],
    loading: true,
    error: null,
    searchQuery: '',
    forceError: false,
  };

  componentDidMount() {
    this.fetchInitialPokemons();
  }

  fetchInitialPokemons = () => {
    this.setState({ loading: true });
    fetch('https://pokeapi.co/api/v2/pokemon?limit=10')
      .then((response) => {
        if (!response.ok) throw new Error('Failed to load pokemons');
        return response.json();
      })
      .then((data: PokemonResponse) => {
        const pokemonPromises = data.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );
        return Promise.all(pokemonPromises);
      })
      .then((pokemons) => {
        this.setState({ pokemons, loading: false });
      })
      .catch((error) => {
        this.setState({ error, loading: false });
      });
  };

  handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { searchQuery } = this.state;

    if (!searchQuery.trim()) {
      this.setState(
        {
          error: null,
          loading: true,
          searchQuery: '',
        },
        () => {
          this.fetchInitialPokemons();
        }
      );
      return;
    }

    this.setState({ loading: true, error: null });
    fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase().trim()}`
    )
      .then((response) => {
        if (!response.ok) throw new Error('Pokemon not found');
        return response.json();
      })
      .then((pokemon) => {
        this.setState({
          pokemons: [pokemon],
          loading: false,
          searchQuery: '',
        });
      })
      .catch((error) => {
        this.setState({
          error,
          loading: false,
          pokemons: [],
          searchQuery: '',
        });
      });
  };

  throwTestError = () => {
    this.setState({ forceError: true });
  };

  render() {
    const { pokemons, loading, error, searchQuery, forceError } = this.state;

    if (forceError) {
      throw new Error('You are click test error btn!');
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
