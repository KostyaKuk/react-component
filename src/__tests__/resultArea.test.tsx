import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import type { Pokemon } from '../types/types';
import ResultArea from '../components/resultsArea/ResultArea';
import { fetchPokemonByName, fetchPokemons } from '../api/apiPokemon';

vi.mock('../api/apiPokemon', () => {
  const mockFetchPokemons = vi.fn();
  const mockFetchPokemonByName = vi.fn();
  return {
    fetchPokemons: mockFetchPokemons,
    fetchPokemonByName: mockFetchPokemonByName,
  };
});

describe('Component ResultArea moc', () => {
  const mockPokemons: Pokemon[] = [
    {
      id: 1,
      name: 'Bulbasaur',
      sprites: { front_default: 'bulbasaur.png' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(fetchPokemons).mockReturnValue(Promise.resolve(mockPokemons));
    vi.mocked(fetchPokemonByName).mockReturnValue(
      Promise.resolve(mockPokemons[0])
    );
  });

  it('Render loading', async () => {
    render(<ResultArea />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('Render card after load', async () => {
    render(<ResultArea />);
    await waitFor(() => {
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });
});
