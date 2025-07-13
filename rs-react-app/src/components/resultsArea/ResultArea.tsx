import { Component, type ChangeEvent, type FormEvent } from 'react';
import InputElem from '../inputElement/inputElem';
import type { CharacterCardState, PokemonResponse } from '../../types/types';
import CharacterCard from '../card/card';

class ResultArea extends Component<object, CharacterCardState> {
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
    this.setState({ loading: true });
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
      .then((pokemons) => {
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

    if (!searchQuery.trim()) {
      this.setState(
        {
          error: null,
          loading: true,
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

    return (
      <div>
        <InputElem
          searchQuery={searchQuery}
          onSearchChange={this.handleSearchChange}
          onSearchSubmit={this.handleSearchSubmit}
        />

        <CharacterCard pokemons={pokemons} loading={loading} error={error} />
      </div>
    );
  }
}

export default ResultArea;
