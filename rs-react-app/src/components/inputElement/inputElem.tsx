import { Component } from 'react';
import styles from './inputElem.module.css';

class InputElem extends Component {
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
