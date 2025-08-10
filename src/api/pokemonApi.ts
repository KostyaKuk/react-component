import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Pokemon, PokemonResponse } from '../types/types';

const BASE_URL = 'https://pokeapi.co/api/v2';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getPokemons: builder.query<Pokemon[], { limit: number; offset: number }>({
      query: ({ limit, offset }) => `/pokemon?limit=${limit}&offset=${offset}`,
      transformResponse: async (response: PokemonResponse) => {
        const pokemonPromises = response.results.map((pokemon) =>
          fetch(pokemon.url).then((res) => res.json())
        );
        return Promise.all(pokemonPromises);
      },
    }),
    getPokemonByName: builder.query<Pokemon, string>({
      query: (name) => `/pokemon/${name.toLowerCase().trim()}`,
    }),
  }),
});

export const { useGetPokemonsQuery, useGetPokemonByNameQuery } = pokemonApi;
