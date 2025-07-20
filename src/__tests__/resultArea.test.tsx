import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
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
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => null);
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {});
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(() => {});
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

  it('Show message if pokemons not found', async () => {
    vi.mocked(fetchPokemons).mockResolvedValue([]);
    render(<ResultArea />);

    await waitFor(() => {
      expect(screen.queryByTestId('loading')).toBeNull();
      expect(screen.getByText(/no pokemons found/i)).toBeInTheDocument();
    });
  });

  it('Peload list after empty search ', async () => {
    render(<ResultArea />);
    await waitFor(() => expect(screen.queryByTestId('loading')).toBeNull());

    vi.mocked(fetchPokemons).mockResolvedValueOnce(mockPokemons);

    const input = screen.getByPlaceholderText('Search pokemon...');
    fireEvent.change(input, { target: { value: '' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(fetchPokemons).toHaveBeenCalledTimes(2);
      expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
    });
  });

  it('Recovery local storage', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('pikachu');

    render(<ResultArea />);

    expect(screen.getByPlaceholderText('Search pokemon...')).toHaveValue(
      'pikachu'
    );
  });

  it('Save  query after search', async () => {
    render(<ResultArea />);

    const input = screen.getByPlaceholderText('Search pokemon...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'ivysaur' } });
    fireEvent.submit(form);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'pokemon_search_query',
      'ivysaur'
    );

    await waitFor(() => {
      expect(fetchPokemonByName).toHaveBeenCalledWith('ivysaur');
    });
  });
});
