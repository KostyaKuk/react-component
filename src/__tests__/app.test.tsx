import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { pokemonApi } from '../api/pokemonApi';
import App from '../App';

const createTestStore = () =>
  configureStore({
    reducer: {
      [pokemonApi.reducerPath]: pokemonApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(pokemonApi.middleware),
  });

describe('App', () => {
  it('renders without problems', async () => {
    const mockPokemonData = [
      { id: 1, name: 'bulbasaur', sprites: { front_default: 'bulbasaur.png' } },
    ];

    vi.spyOn(pokemonApi.endpoints.getPokemons, 'useQuery').mockReturnValue({
      data: mockPokemonData,
      isLoading: false,
      isError: false,
      isSuccess: true,
      refetch: vi.fn(),
    });

    render(
      <Provider store={createTestStore()}>
        <App />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /bulbasaur/i })
      ).toBeInTheDocument();
    });
  });
});
