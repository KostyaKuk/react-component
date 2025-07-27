import styles from './inputElem.module.css';
import type { InputElemProps } from '../../types/types';

function InputElem({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}: InputElemProps) {
  return (
    <header className={styles['search-header']}>
      <form
        onSubmit={onSearchSubmit}
        name="form"
        className={styles['search-wrapper']}
      >
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

export default InputElem;
