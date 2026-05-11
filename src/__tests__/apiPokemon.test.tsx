import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchPokemons, fetchPokemonByName } from '../api/apiPokemon';
import type { Pokemon, PokemonResponse } from '../types/types';

const mockFetch = vi.spyOn(globalThis, 'fetch');

describe('API', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    mockFetch.mockReset();
  });

  describe('fetchPokemons', () => {
    it('return array pokemons, success response', async () => {
      const mockPokemonResponse: PokemonResponse = {
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        ],
      };

      const mockPokemon: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: { front_default: 'bulbasaur.png' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemonResponse,
      } as Response);

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      } as Response);

      const result = await fetchPokemons(1);

      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1/'
      );
      expect(result).toEqual([mockPokemon]);
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('bulbasaur');
      expect(result[0].sprites.front_default).toBe('bulbasaur.png');
    });

    it('Throw error, bad request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({}),
      } as Response);

      await expect(fetchPokemons(1)).rejects.toThrow('Failed to load pokemons');
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=1'
      );
    });
  });

  describe('fetchPokemonByName', () => {
    it('Return poremon, success request', async () => {
      const mockPokemon: Pokemon = {
        id: 1,
        name: 'bulbasaur',
        sprites: { front_default: 'bulbasaur.png' },
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockPokemon,
      } as Response);

      const result = await fetchPokemonByName('Bulbasaur');

      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/bulbasaur'
      );
      expect(result).toEqual(mockPokemon);
      expect(result.name).toBe('bulbasaur');
      expect(result.sprites.front_default).toBe('bulbasaur.png');
    });

    it('throw error, bad request', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => ({}),
      } as Response);

      await expect(fetchPokemonByName('unknown')).rejects.toThrow(
        'Pokemon not found'
      );
      expect(mockFetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/unknown'
      );
    });
  });
});
