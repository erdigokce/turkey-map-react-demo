import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import ChoroplethScenario from './ChoroplethScenario';

describe('ChoroplethScenario', () => {
  test('switches between all four scale types', async () => {
    const user = userEvent.setup();
    render(<ChoroplethScenario />);

    expect(screen.getByText(/builds equal-count buckets/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'linear' }));
    expect(screen.getByText(/interpolates the palette/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'quantize' }));
    expect(screen.getByText(/equal-width buckets/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'threshold' }));
    expect(screen.getByText(/fixed population boundaries/i)).toBeInTheDocument();
  });

  test('toggles no-data provinces and the getColor override', async () => {
    const user = userEvent.setup();
    render(<ChoroplethScenario />);

    expect(screen.getByText('4 provinces')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /withhold four provinces/i }));
    expect(screen.getByText('unused')).toBeInTheDocument();

    await user.click(screen.getByRole('checkbox', { name: /getColor/i }));
    expect(screen.getAllByText(/getColor override/i).length).toBeGreaterThan(0);
  });

  test('changes the palette and keeps the legend in sync', async () => {
    const user = userEvent.setup();
    render(<ChoroplethScenario />);

    expect(screen.getByText('Terrain scale')).toBeInTheDocument();

    await user.selectOptions(screen.getByLabelText('Palette'), 'ocean');
    expect(screen.getByText('Ocean scale')).toBeInTheDocument();
  });
});
