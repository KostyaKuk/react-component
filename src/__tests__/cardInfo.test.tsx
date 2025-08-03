import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchPokemonByName } from '../api/apiPokemon';
import PokemonDetails from '../components/cardInfo/cardInfo';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ name: 'pikachu' }),
  };
});

vi.mock('../api/apiPokemon', () => ({
  fetchPokemonByName: vi.fn(),
}));

describe('PokemonDetails component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('Show spinner', () => {
    render(
      <BrowserRouter>
        <PokemonDetails />
      </BrowserRouter>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  it('Back to main page after close', async () => {
    const mockPokemon = {
      name: 'Pikachu',
      id: 25,
      sprites: { front_default: 'https://pokeapi.co/pikachu.png' },
      types: [{ type: { name: 'electric' } }],
      abilities: [{ ability: { name: 'static' } }],
      height: 4,
      weight: 60,
    };
    vi.mocked(fetchPokemonByName).mockResolvedValue(mockPokemon);

    render(
      <BrowserRouter>
        <PokemonDetails />
      </BrowserRouter>
    );

    const closeButton = await screen.findByRole('button', { name: /x/i });
    fireEvent.click(closeButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
