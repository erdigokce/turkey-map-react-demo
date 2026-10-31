import { cleanup, render, screen } from '@testing-library/react';
import {
  afterEach, describe, expect, test, vi,
} from 'vitest';
import { version as turkeyMapVersion } from 'turkey-map-react/package.json';
import App from './App';

vi.mock('turkey-map-react', () => ({
  default: () => <div data-testid="turkey-map-mock" />, // lightweight mock component
}));

afterEach(cleanup);

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

  test('shows the turkey-map-react version in use', () => {
    render(<App />);
    expect(screen.getByTestId('turkey-map-version')).toHaveTextContent(
      `turkey-map-react v${turkeyMapVersion}`,
    );
  });
});
