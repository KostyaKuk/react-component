import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { addPokemon, clearSelectedPokemons } from '../redux/pokemonSlice';
import SelectedPanel from '../components/selectedPanel/selectedPanel';
import { store } from '../redux/store';

describe('SelectedPanel Component', () => {
  beforeEach(() => {
    store.dispatch(clearSelectedPokemons());
  });

  it('does not render when selectedPokemons is empty', () => {
    render(
      <Provider store={store}>
        <SelectedPanel />
      </Provider>
    );

    expect(screen.queryByText(/Selected/i)).not.toBeInTheDocument();
  });

  it('renders correctly with selected Pokemon', () => {
    store.dispatch(
      addPokemon({
        id: 1,
        name: 'Bulbasaur',
        sprites: { front_default: 'url1' },
      })
    );
    store.dispatch(
      addPokemon({
        id: 2,
        name: 'Charmander',
        sprites: { front_default: 'url2' },
      })
    );

    render(
      <Provider store={store}>
        <SelectedPanel />
      </Provider>
    );

    expect(screen.getByText(/Selected 2 element\(s\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Remove all elements/i)).toBeInTheDocument();
    expect(screen.getByText(/Download/i)).toBeInTheDocument();
  });

  it('Remove all elements button clicked', () => {
    store.dispatch(
      addPokemon({
        id: 1,
        name: 'Bulbasaur',
        sprites: { front_default: 'url1' },
      })
    );

    render(
      <Provider store={store}>
        <SelectedPanel />
      </Provider>
    );

    const clearButton = screen.getByText(/Remove all elements/i);
    fireEvent.click(clearButton);

    expect(store.getState().pokemon.selectedPokemons).toEqual([]);
  });
  it('triggers download button click without errors', () => {
    store.dispatch(
      addPokemon({
        id: 1,
        name: 'Bulbasaur',
        sprites: { front_default: 'url1' },
      })
    );

    render(
      <Provider store={store}>
        <SelectedPanel />
      </Provider>
    );

    const downloadButton = screen.getByText(/Download/i);
    fireEvent.click(downloadButton);

    expect(downloadButton).toBeInTheDocument();
  });
});
