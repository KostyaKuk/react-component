import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { fetchPokemons } from '../api/apiPokemon';

vi.mock('../api/apiPokemon', () => ({
  fetchPokemons: vi.fn(),
}));

describe('App', () => {
  it('Render without problems', async () => {
    vi.mocked(fetchPokemons).mockResolvedValue([
      { id: 1, name: 'bulbasaur', sprites: { front_default: 'bulbasaur.png' } },
    ]);

    render(<App />);

    await waitFor(() => {
      expect(
        screen.getByRole('heading', { name: /bulbasaur/i })
      ).toBeInTheDocument();
    });
  });
});
