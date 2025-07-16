import { Component } from 'react';
import styles from './inputElem.module.css';
import type { InputElemProps } from '../../types/types';

class InputElem extends Component<InputElemProps> {
  render() {
    const { searchQuery, onSearchChange, onSearchSubmit } = this.props;

    return (
      <header className={styles['search-header']}>
        <form onSubmit={onSearchSubmit} className={styles['search-wrapper']}>
          <input
            type="text"
            placeholder="Search pokemon..."
            value={searchQuery}
            onChange={onSearchChange}
            className={styles['search-input']}
          />
          <button type="submit" className={styles['search-button']}>
            Search
          </button>
        </form>
      </header>
    );
  }
}

export default InputElem;
