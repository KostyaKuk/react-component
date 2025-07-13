import type { ChangeEvent, FormEvent } from 'react';

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
}

export interface PokemonResponse {
  results: {
    name: string;
    url: string;
  }[];
}

export interface CharacterCardState {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
}

export interface InputElemProps {
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: FormEvent) => void;
}
