import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import NotFound from '../components/notFound/notFound';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

describe('NotFound Component', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockImplementation(() => mockNavigate);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correct 404', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(screen.getByText('404 Page Not Found')).toBeInTheDocument();
    expect(screen.getByText('Sorry, this page not exist.')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Back to Pokemons' })
    ).toBeInTheDocument();
  });

  it('navigate to home page', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    const backButton = screen.getByRole('button', { name: 'Back to Pokemons' });
    fireEvent.click(backButton);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('matches snapshot', () => {
    const { container } = render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

    expect(container).toMatchSnapshot();
  });
});
