import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './cardInfo.module.css';
import type { Pokemon } from '../../types/types';
import { fetchPokemonByName } from '../../api/apiPokemon';

const PokemonDetails: React.FC = () => {
  const { name } = useParams<{ name: string }>();
  const navigate = useNavigate();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPokemon = async () => {
      if (!name) return;
      setLoading(true);
      setError(null);
      try {
        const data = await fetchPokemonByName(name);
        setPokemon(data);
        setLoading(false);
      } catch (err) {
        setError(String(err));
        setLoading(false);
      }
    };
    loadPokemon();
  }, [name]);

  const handleClose = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className={styles.spinnerContainer}>
        <div className={styles.customSpinner}></div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className={styles.error}>Error: {error || 'Pokemon not found'}</div>
    );
  }

  return (
    <div className={styles.detailsPanel}>
      <button className={styles.closeButton} onClick={handleClose}>
        X
      </button>
      <h2 className={styles.pokemonName}>{pokemon.name}</h2>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className={styles.pokemonImage}
      />
      <div className={styles.pokemonInfo}>
        <p>
          <strong>ID:</strong> {pokemon.id}
        </p>
        <p>
          <strong>Types:</strong>{' '}
          {pokemon.types && pokemon.types.length > 0
            ? pokemon.types.map((t) => t.type.name).join(', ')
            : 'No types available'}
        </p>
        <p>
          <strong>Abilities:</strong>{' '}
          {pokemon.abilities && pokemon.abilities.length > 0
            ? pokemon.abilities.map((a) => a.ability.name).join(', ')
            : 'No abilities available'}
        </p>
        <p>
          <strong>Height:</strong> {pokemon.height} m
        </p>
        <p>
          <strong>Weight:</strong> {pokemon.weight} kg
        </p>
      </div>
    </div>
  );
};

export default PokemonDetails;
