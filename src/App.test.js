import { render, screen } from '@testing-library/react';
import {
  describe, expect, test, vi,
} from 'vitest';
import App from './App';

vi.mock('turkey-map-react', () => ({
  default: () => <div data-testid="turkey-map-mock" />, // lightweight mock component
}));

describe('App', () => {
  test('renders turkey population heatmap title', () => {
    render(<App />);
    const heading = screen.getByRole('heading', {
      name: /turkey population heatmap/i,
    });
    expect(heading).toBeInTheDocument();
  });
});
