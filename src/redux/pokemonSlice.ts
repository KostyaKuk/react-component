import { createSlice } from '@reduxjs/toolkit';
import type { Pokemon } from '../types/types';

interface PokemonState {
  selectedPokemons: Pokemon[];
}

const initialState: PokemonState = {
  selectedPokemons: [],
};

const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,
  reducers: {
    addPokemon: (state, action) => {
      state.selectedPokemons.push(action.payload);
    },
    removePokemon: (state, action) => {
      state.selectedPokemons = state.selectedPokemons.filter(
        (pokemon) => pokemon.id !== action.payload
      );
    },
    clearSelectedPokemons: (state) => {
      state.selectedPokemons = [];
    },
  },
});

export const { addPokemon, removePokemon, clearSelectedPokemons } =
  pokemonSlice.actions;
export default pokemonSlice.reducer;
