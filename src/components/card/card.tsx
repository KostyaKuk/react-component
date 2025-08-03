import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './card.module.css';
import type { ResultAreaProps } from '../../types/types';
import { addPokemon, removePokemon } from '../../redux/pokemonSlice';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const CharacterCard: React.FC<ResultAreaProps> = ({
  pokemons,
  loading,
  error,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const selectedPokemons = useSelector(
    (state: RootState) => state.pokemon.selectedPokemons
  );

  const handleCardClick = (name: string) => {
    navigate(`/pokemon/${name}`);
  };

  const handleCheckboxChange = (pokemon: { id: number; name: string }) => {
    const isSelected = selectedPokemons.some((e) => e.id === pokemon.id);
    if (isSelected) {
      dispatch(removePokemon(pokemon.id));
    } else {
      dispatch(
        addPokemon({
          id: pokemon.id,
          name: pokemon.name,
          sprites: {
            front_default: '',
          },
        })
      );
    }
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer} data-testid="loading">
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
          <div
            key={pokemon.id}
            className={styles['character-card']}
            onClick={() => handleCardClick(pokemon.name)}
            style={{ cursor: 'pointer' }}
          >
            <input
              type="checkbox"
              checked={selectedPokemons.some((e) => e.id === pokemon.id)}
              onChange={() => handleCheckboxChange(pokemon)}
              onClick={(e) => e.stopPropagation()}
              className={styles['character-checkbox']}
            />
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
};

export default CharacterCard;
