import styles from './header.module.scss';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <img src="/img/logo.svg" alt="logo" />
    </header>
  );
};

export default Header;
