import { render, screen } from '@testing-library/react';
import {
  describe, expect, test, vi,
} from 'vitest';
import App from './App';

vi.mock('turkey-map-react', () => ({
  default: () => <div data-testid="turkey-map-mock" />, // lightweight mock component
}));

describe('App', () => {
  test('renders the earthquake risk dashboard', () => {
    render(<App />);
    const heading = screen.getByRole('heading', {
      name: /earthquake risk \+ recent activity/i,
    });
    expect(heading).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /risk map/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /recent quakes/i })).toBeInTheDocument();
  });
});
