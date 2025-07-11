import { Component } from 'react';
import styles from './inputElem.module.css';

interface kostiaName {
  name: string;
}

class InputElem extends Component<kostiaName> {
  render() {
    return (
      <header className={styles['search-header']}>
        <div className={styles['search-wrapper']}>
          <input
            type="text"
            placeholder="Search..."
            className={styles['search-input']}
          />
          <button className={styles['search-button']}>Search</button>
        </div>
      </header>
    );
  }
}

export default InputElem;
