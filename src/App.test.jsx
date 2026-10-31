import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  describe, expect, test, vi,
} from 'vitest';
import { version as turkeyMapVersion } from 'turkey-map-react/package.json';
import App from './App';

vi.mock('turkey-map-react', () => ({
  default: () => <div data-testid="turkey-map-mock" />, // lightweight mock component
}));

const openMetropolitanScenario = async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole('button', { name: /büyükşehir selection/i }));
  return user;
};

describe('App', () => {
  test('renders the earthquake risk dashboard by default', () => {
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

  test('opens the metropolitan scenario with all 30 büyükşehir selected', async () => {
    await openMetropolitanScenario();

    expect(screen.getByRole('heading', {
      name: /metropolitan municipalities/i,
    })).toBeInTheDocument();
    expect(screen.getByText('30 of 30 büyükşehir selected')).toBeInTheDocument();
    expect(screen.getByText('İstanbul')).toBeInTheDocument();
    expect(screen.getByText('Ankara')).toBeInTheDocument();
  });

  test('clears and restores the metropolitan selection', async () => {
    const user = await openMetropolitanScenario();

    await user.click(screen.getByRole('button', { name: /clear all/i }));
    expect(screen.getByText('0 of 30 büyükşehir selected')).toBeInTheDocument();
    expect(screen.getByText(/no provinces selected/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /reset to 30 büyükşehir/i }));
    expect(screen.getByText('30 of 30 büyükşehir selected')).toBeInTheDocument();
  });
});
