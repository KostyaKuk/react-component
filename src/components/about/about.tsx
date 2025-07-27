import { useNavigate } from 'react-router-dom';
import styles from './about.module.css';

const About: React.FC = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.aboutContainer}>
      <button className={styles.backButton} onClick={handleBack}>
        Back to Pokemons list!
      </button>
      <h1 className={styles.title}>About Us!</h1>
      <div className={styles.developerInfo}>
        <h2>Author:</h2>
        <p>
          <strong>Name:</strong> Kostia Kukushkin
        </p>
        <p>
          <strong>Role:</strong> Beginning Front-end Developer
        </p>
        <p>
          <strong>School:</strong>
          <a href="https://rs.school/"> Rolling Scopes School</a>
        </p>
        <p>
          <strong>GitHub:</strong>{' '}
          <a
            href="https://github.com/KostyaKuk"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://github.com/KostyaKuk
          </a>
        </p>
      </div>
    </div>
  );
};

export default About;
