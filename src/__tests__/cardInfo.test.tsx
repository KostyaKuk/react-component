import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../api/pokemonApi';
import PokemonDetails from '../components/cardInfo/cardInfo';

const createTestStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ name: 'pikachu' }),
  };
});

describe('PokemonDetails component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Show spinner', () => {
    vi.spyOn(pokemonApi.endpoints.getPokemonByName, 'useQuery').mockReturnValue(
      {
        data: undefined,
        isLoading: true,
        isError: false,
        isSuccess: false,
        refetch: vi.fn(),
        isFetching: true,
        error: undefined,
        currentData: undefined,
        fulfilledTimeStamp: undefined,
        startedTimeStamp: Date.now(),
        requestId: 'test-request-id',
        status: 'pending',
      }
    );

    render(
      <Provider store={createTestStore()}>
        <BrowserRouter>
          <PokemonDetails />
        </BrowserRouter>
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Back to main page after close', async () => {
    const mockPokemon = {
      name: 'pikachu',
      id: 25,
      sprites: { front_default: 'https://pokeapi.co/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
      height: 4,
      weight: 60,
    };

    vi.spyOn(pokemonApi.endpoints.getPokemonByName, 'useQuery').mockReturnValue(
      {
        data: mockPokemon,
        isLoading: false,
        isError: false,
        isSuccess: true,
        refetch: vi.fn(),
      }
    );

    render(
      <Provider store={createTestStore()}>
        <BrowserRouter>
          <PokemonDetails />
        </BrowserRouter>
      </Provider>
    );

    const closeButton = await screen.findByRole('button', { name: /x/i });
    fireEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
