import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterCard from '../components/card/card';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '../redux/store';
import { ThemeProvider } from '../themes/context/themeProvider';

describe('component card', () => {
  const mockPokemon = {
    id: 1,
    name: 'venusaur',
    sprites: { front_default: 'venusaur.png' },
  };

  it('Render name and img pokemon', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <CharacterCard
              pokemons={[mockPokemon]}
              loading={false}
              error={null}
            />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    const image = screen.getByRole('img', { name: /venusaur/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemon.sprites.front_default);

    const name = screen.getByRole('heading', { name: /venusaur/i });
    expect(name).toBeInTheDocument();
  });

  it('Render no pokemons found', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <CharacterCard pokemons={[]} loading={false} error={null} />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );

    const noResults = screen.getByText(/no pokemons found/i);
    expect(noResults).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter>
            <CharacterCard pokemons={[]} loading={false} error="Test error" />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
});
