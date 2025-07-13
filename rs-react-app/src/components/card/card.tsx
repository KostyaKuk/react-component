import { Component, type ChangeEvent, type FormEvent } from 'react';
import styles from './card.module.css';
import InputElem from '../inputElement/inputElem';
import type {
  CharacterCardState,
  Pokemon,
  PokemonResponse,
} from '../../types/types';

class CharacterCard extends Component<object, CharacterCardState> {
  state: CharacterCardState = {
    pokemons: [],
    loading: true,
    error: null,
    searchQuery: '',
  };

  componentDidMount() {
    this.fetchInitialPokemons();
  }

  fetchInitialPokemons = () => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=30')
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
      .then((pokemons: Pokemon[]) => {
        this.setState({ pokemons, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchQuery: e.target.value });
  };

  handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    const { searchQuery } = this.state;
    if (!searchQuery.trim()) return;

    this.setState({ loading: true, error: null });
    fetch(
      `https://pokeapi.co/api/v2/pokemon/${searchQuery.toLowerCase().trim()}`
    )
      .then((response) => {
        if (!response.ok) throw new Error('Pokemon not found');
        return response.json();
      })
      .then((pokemon: Pokemon) => {
        this.setState({
          pokemons: [pokemon],
          loading: false,
          searchQuery: searchQuery.trim(),
        });
      })
      .catch((error) => {
        this.setState({
          error: error.message,
          loading: false,
          pokemons: [],
        });
      });
  };

  render() {
    const { pokemons, loading, error, searchQuery } = this.state;

    if (loading) {
      return <div className={styles.loading}>Loading...</div>;
    }

    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }

    return (
      <div>
        <InputElem
          searchQuery={searchQuery}
          onSearchChange={this.handleSearchChange}
          onSearchSubmit={this.handleSearchSubmit}
        />

        <div className={styles['card-container']}>
          {pokemons.length === 0 ? (
            <div className={styles['no-results']}>No pokemons</div>
          ) : (
            pokemons.map((pokemon) => (
              <div key={pokemon.id} className={styles['character-card']}>
                <img
                  src={pokemon.sprites.front_default}
                  alt={pokemon.name}
                  className={styles['character-image']}
                />
                <div className={styles['character-info']}>
                  <h3 className={styles['character-name']}>{pokemon.name}</h3>
                  <p className={styles['character-detail']}>ID: {pokemon.id}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
}

export default CharacterCard;
