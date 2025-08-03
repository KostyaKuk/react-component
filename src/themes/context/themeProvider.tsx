import React, { useState, type ReactNode } from 'react';
import { ThemeContext } from './themeContext';

type Theme = 'light' | 'dark';
export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={`app ${theme}`}>{children}</div>
    </ThemeContext.Provider>
  );
};
