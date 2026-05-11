import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CharacterCard from '../components/card/card';

describe('component card', () => {
  const mockPokemon = {
    id: 1,
    name: 'venusaur',
    sprites: { front_default: 'venusaur.png' },
  };

  it('Render name and img pokemon', () => {
    render(
      <CharacterCard pokemons={[mockPokemon]} loading={false} error={null} />
    );

    const image = screen.getByRole('img', { name: /venusaur/i });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemon.sprites.front_default);

    const name = screen.getByRole('heading', { name: /venusaur/i });
    expect(name).toBeInTheDocument();
  });

  it('Render no pokemons found', () => {
    render(<CharacterCard pokemons={[]} loading={false} error={null} />);

    const noResults = screen.getByText(/no pokemons found/i);
    expect(noResults).toBeInTheDocument();
  });
});
