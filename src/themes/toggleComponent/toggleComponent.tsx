import React from 'react';
import styles from './toggleComponent.module.css';
import { useTheme } from '../../hooks/useTheme';

const ToggleComponent: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles.toggleContainer}>
      <label className={styles.switch}>
        <input
          type="checkbox"
          checked={theme === 'dark'}
          onChange={toggleTheme}
          name="theme"
        />
        <span className={styles.slider}></span>
      </label>
      <span>{theme === 'dark' ? '🌙 ' : '☀️  '}</span>
    </div>
  );
};

export default ToggleComponent;
