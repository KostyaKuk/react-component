import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterCard from '../components/card/card';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

describe('component card', () => {
  const mockPokemon = {
    id: 1,
    name: 'venusaur',
    sprites: { front_default: 'venusaur.png' },
  };

  it('Render name and img pokemon', () => {
    render(
      <BrowserRouter>
        <CharacterCard pokemons={[mockPokemon]} loading={false} error={null} />
      </BrowserRouter>
    );

    const image = screen.getByRole('img', { name: /venusaur/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemon.sprites.front_default);

    const name = screen.getByRole('heading', { name: /venusaur/i });
    expect(name).toBeInTheDocument();
  });

  it('Render no pokemons found', () => {
    render(
      <BrowserRouter>
        <CharacterCard pokemons={[]} loading={false} error={null} />
      </BrowserRouter>
    );

    const noResults = screen.getByText(/no pokemons found/i);
    expect(noResults).toBeInTheDocument();
  });

  it('should display error message', () => {
    render(
      <MemoryRouter>
        <CharacterCard pokemons={[]} loading={false} error="Test error" />
      </MemoryRouter>
    );

    expect(screen.getByText('Error: Test error')).toBeInTheDocument();
  });
});
