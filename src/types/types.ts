import { type ChangeEvent, type FormEvent } from 'react';

export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types?: { type: { name: string } }[];
  abilities?: { ability: { name: string } }[];
  height?: number;
  weight?: number;
}

export interface PokemonResponse {
  results: {
    name: string;
    url: string;
  }[];
}

export interface InputElemProps {
  searchQuery: string;
  onSearchChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: FormEvent) => void;
}

export interface ResultAreaProps {
  pokemons: Pokemon[];
  loading: boolean;
  error: string | null;
}
