import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import HeadlessScenario from './HeadlessScenario';

describe('HeadlessScenario', () => {
  test('selects a province through the custom SVG and announces it', async () => {
    const user = userEvent.setup();
    render(<HeadlessScenario />);

    const listbox = screen.getByRole('listbox', { name: 'Headless province board' });
    expect(listbox).toBeInTheDocument();

    const bursa = within(listbox).getByRole('option', { name: /Bursa/i });
    await user.click(bursa);

    expect(screen.getByRole('status')).toHaveTextContent(/Bursa/i);
    expect(screen.getAllByText('Marmara desk').length).toBeGreaterThan(0);
  });

  test('switches renderers without losing selection', async () => {
    const user = userEvent.setup();
    render(<HeadlessScenario />);

    await user.click(screen.getByRole('button', { name: 'HTML list' }));

    const listbox = screen.getByRole('listbox', { name: 'Headless province board' });
    expect(within(listbox).getByRole('option', { name: /İstanbul/i })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /Ankara/i })).toBeInTheDocument();
    expect(within(listbox).getByRole('option', { name: /İzmir/i })).toBeInTheDocument();
  });

  test('applies a native-select value through changeSelection', async () => {
    const user = userEvent.setup();
    render(<HeadlessScenario />);

    const fallback = screen.getByLabelText(/changeSelection/i);
    await user.selectOptions(fallback, ['trabzon']);

    expect(screen.getAllByText('Trabzon').length).toBeGreaterThan(1);
    expect(screen.getByText('Black Sea desk')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/Trabzon/i);
  });
});
