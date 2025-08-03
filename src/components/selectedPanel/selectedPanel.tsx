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

  const handleDownload = () => {
    const headers = ['ID', 'Name', 'Details URL', 'Sprite URL'];
    const rows = selectedPokemons.map((pokemon) => [
      pokemon.id.toString(),
      pokemon.name,
      `${window.location.origin}/pokemon/${pokemon.name}`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${selectedPokemons.length}_items.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.panel}>
      <span>Selected {selectedPokemons.length} element(s)</span>
      <div className={styles.buttons}>
        <button onClick={handleClearSelection} className={styles.clearButton}>
          Remove all elements
        </button>
        <button onClick={handleDownload} className={styles.downloadButton}>
          Download
        </button>
      </div>
    </div>
  );
};

export default SelectedPanel;
