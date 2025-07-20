import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import InputElem from '../components/inputElement/inputElem';

describe('InputElem Component', () => {
  const defaultProps = {
    searchQuery: '',
    onSearchChange: vi.fn(),
    onSearchSubmit: vi.fn(),
  };

  it('Correct initial props', () => {
    render(<InputElem {...defaultProps} />);

    expect(
      screen.getByPlaceholderText('Search pokemon...')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  it('Correct search query', () => {
    const props = { ...defaultProps, searchQuery: 'Pikachu' };
    render(<InputElem {...props} />);

    const input = screen.getByPlaceholderText('Search pokemon...');
    expect(input).toHaveValue('Pikachu');
  });

  it('Onsearch when render input', () => {
    render(<InputElem {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search pokemon...');
    fireEvent.change(input, { target: { value: 'Bulbasaur' } });

    expect(defaultProps.onSearchChange).toHaveBeenCalled();
    expect(defaultProps.onSearchChange).toHaveBeenCalledWith(
      expect.any(Object)
    );
  });

  it('onSearchSubmit when submit', () => {
    render(<InputElem {...defaultProps} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(defaultProps.onSearchSubmit).toHaveBeenCalled();
    expect(defaultProps.onSearchSubmit).toHaveBeenCalledWith(
      expect.any(Object)
    );
  });

  it('onSearchSubmit when search btn clicked', () => {
    render(<InputElem {...defaultProps} />);

    const button = screen.getByRole('button', { name: /search/i });
    fireEvent.click(button);

    expect(defaultProps.onSearchSubmit).toHaveBeenCalled();
  });

  it('Great attr for input', () => {
    render(<InputElem {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search pokemon...');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder', 'Search pokemon...');
  });

  it('Work prevent default', () => {
    const preventDefault = vi.fn();
    render(<InputElem {...defaultProps} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form, { preventDefault });
  });
});
