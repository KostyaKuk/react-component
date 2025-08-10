import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../themes/context/themeProvider';
import { pokemonApi } from '../api/pokemonApi';
import { store } from '../redux/store';
import ResultArea from '../components/resultsArea/ResultArea';
import type { Pokemon } from '../types/types';

const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
};

describe('Component ResultArea', () => {
  const mockPokemons: Pokemon[] = [
    {
      id: 1,
      name: 'Bulbasaur',
      sprites: { front_default: 'bulbasaur.png' },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(
      mockLocalStorage.getItem
    );
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(
      mockLocalStorage.setItem
    );
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation(
      mockLocalStorage.removeItem
    );
  });

  it('Render loading', async () => {
    vi.spyOn(pokemonApi.endpoints.getPokemons, 'useQuery').mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
      isSuccess: false,
      refetch: vi.fn(),
    });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>
            <ResultArea />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByTestId('loading')).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  it('Recovery local storage', () => {
    mockLocalStorage.getItem.mockReturnValue('pikachu');

    vi.spyOn(pokemonApi.endpoints.getPokemons, 'useQuery').mockReturnValue({
      data: mockPokemons,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    });

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>
            <ResultArea />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByPlaceholderText('Search pokemon...')).toHaveValue(
      'pikachu'
    );
  });

  it('Save query after search', async () => {
    vi.spyOn(pokemonApi.endpoints.getPokemonByName, 'useQuery').mockReturnValue(
      {
        data: {
          id: 2,
          name: 'ivysaur',
          sprites: { front_default: 'ivysaur.png' },
        },
        isLoading: false,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
        isFetching: false,
        error: undefined,
        currentData: {
          id: 2,
          name: 'ivysaur',
          sprites: { front_default: 'ivysaur.png' },
        },
      }
    );

    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>
            <ResultArea />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    const input = screen.getByPlaceholderText('Search pokemon...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'ivysaur' } });
    fireEvent.submit(form);

    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      'pokemon_search_query',
      'ivysaur'
    );

    await waitFor(() => {
      expect(screen.getByText('ivysaur')).toBeInTheDocument();
    });
  });
});
