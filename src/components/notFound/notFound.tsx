import { useNavigate } from 'react-router-dom';
import styles from './notFound.module.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.notFoundContainer}>
      <h1 className={styles.title}>404 Page Not Found</h1>
      <p className={styles.message}>Sorry, this page not exist.</p>
      <button className={styles.backButton} onClick={handleBack}>
        Back to Pokemons
      </button>
    </div>
  );
};

export default NotFound;
