import { Component } from 'react';
import styles from './card.module.css';

interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

interface PokemonResponse {
  results: {
    name: string;
    url: string;
  }[];
}

class CharacterCard extends Component {
  state = {
    pokemons: [],
    loading: true,
    error: null,
  };

  componentDidMount() {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=30')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Ошибка при загрузке данных покемонов');
        }
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
  }

  render() {
    const { pokemons, loading, error } = this.state;

    if (loading) {
      return <div className={styles.loading}>Загрузка...</div>;
    }

    if (error) {
      return <div className={styles.error}>Ошибка: {error}</div>;
    }

    return (
      <div className={styles['card-container']}>
        {pokemons.map((pokemon: Pokemon) => (
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
        ))}
      </div>
    );
  }
}

export default CharacterCard;
