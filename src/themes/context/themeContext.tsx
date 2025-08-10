import { createContext } from 'react';
import type { ThemeContextType } from './themeProvider';

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);
