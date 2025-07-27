import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, expect, it, vi } from 'vitest';
import About from '../components/about/about';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('About component', () => {
  it('correct links', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    const schoolLink = screen.getByText('Rolling Scopes School');
    expect(schoolLink).toHaveAttribute('href', 'https://rs.school/');

    const githubLink = screen.getByText('https://github.com/KostyaKuk');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/KostyaKuk');
    expect(githubLink).toHaveAttribute('target', '_blank');
  });

  it('to main page after click', () => {
    render(
      <BrowserRouter>
        <About />
      </BrowserRouter>
    );

    const backButton = screen.getByRole('button', {
      name: /Back to Pokemons list!/i,
    });
    fireEvent.click(backButton);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });
});
