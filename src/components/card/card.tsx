import { Component } from 'react';
import styles from './card.module.css';
import type { ResultAreaProps } from '../../types/types';

class CharacterCard extends Component<ResultAreaProps> {
  render() {
    const { pokemons, loading, error } = this.props;

    if (loading) {
      return (
        <div className={styles.spinnerContainer}>
          <div className={styles.customSpinner}></div>
        </div>
      );
    }

    if (error) {
      return <div className={styles.error}>Error: {error}</div>;
    }

    return (
      <div className={styles['card-container']}>
        {pokemons.length === 0 ? (
          <div className={styles['no-results']}>No pokemons found</div>
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
    );
  }
}

export default CharacterCard;
