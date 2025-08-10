import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/errorBoundary/error';

const ProblemChild = () => {
  throw new Error('Test error');
};

const NoProblemsChild = () => <div>Without problems</div>;

describe('component error boundary', () => {
  it('Render child component without problems', () => {
    render(
      <ErrorBoundary>
        <NoProblemsChild />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Without problems/i)).toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { name: /custom error/i })
    ).not.toBeInTheDocument();
  });

  it('Catch errror and render additional UI', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    const title = screen.getByRole('heading', { name: /custom error/i });
    expect(title).toBeInTheDocument();

    const message = screen.getByText(/yes, you are click test error button/i);
    expect(message).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Reload app/i });
    expect(button).toBeInTheDocument();

    expect(screen.queryByText(/should not render/i)).not.toBeInTheDocument();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Error was caughted:',
      expect.any(Error),
      expect.any(Object)
    );
    consoleErrorSpy.mockRestore();
  });
});
