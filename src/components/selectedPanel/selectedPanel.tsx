import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styles from './selectedPanel.module.css';
import { clearSelectedPokemons } from '../../redux/pokemonSlice';
import type { RootState } from '../../redux/store';

const SelectedPanel: React.FC = () => {
  const dispatch = useDispatch();
  const selectedPokemons = useSelector(
    (state: RootState) => state.pokemon.selectedPokemons
  );

  const handleClearSelection = () => {
    dispatch(clearSelectedPokemons());
  };

  if (selectedPokemons.length === 0) {
    return null;
  }

  return (
    <div className={styles.panel}>
      <span>Selected {selectedPokemons.length} element(s)</span>
      <div className={styles.buttons}>
        <button onClick={handleClearSelection} className={styles.clearButton}>
          Remove all elements
        </button>
        <button className={styles.downloadButton}>Download</button>
      </div>
    </div>
  );
};

export default SelectedPanel;
