import type { Pokemon, PokemonResponse } from '../types/types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchPokemons = async (
  limit = 10,
  offset = 0
): Promise<Pokemon[]> => {
  const response = await fetch(
    `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  );

  if (!response.ok) {
    throw new Error('Failed to load pokemons');
  }

  const data: PokemonResponse = await response.json();
  const pokemonPromises = data.results.map((pokemon) =>
    fetch(pokemon.url).then((res) => res.json())
  );

  return Promise.all(pokemonPromises);
};

export const fetchPokemonByName = async (name: string): Promise<Pokemon> => {
  const response = await fetch(
    `${BASE_URL}/pokemon/${name.toLowerCase().trim()}`
  );

  if (!response.ok) {
    throw new Error('Pokemon not found');
  }

  return response.json();
};
