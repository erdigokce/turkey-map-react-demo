import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import GeographyScenario from './GeographyScenario';

const activateProvince = (name) => {
  const option = screen.getByRole('option', { name });
  fireEvent.keyDown(option, { key: 'Enter' });
};

describe('GeographyScenario', () => {
  test('shows the rich geography of the initial province', () => {
    render(<GeographyScenario />);

    const panel = screen.getByTestId('geo-detail-panel');
    expect(screen.getByRole('heading', { name: 'Ankara' })).toBeInTheDocument();
    expect(panel).toHaveTextContent(/25.632 km²/);
    expect(panel).toHaveTextContent('TR-06');
    expect(panel).toHaveTextContent('TR510');
  });

  test('selecting İzmir updates the detail panel, neighbours and alt names', () => {
    render(<GeographyScenario />);

    activateProvince(/İzmir, plate 35/i);

    const panel = screen.getByTestId('geo-detail-panel');
    expect(screen.getByRole('heading', { name: 'İzmir' })).toBeInTheDocument();
    expect(panel).toHaveTextContent(/11.891 km²/);
    expect(panel).toHaveTextContent('TR-35');
    expect(panel).toHaveTextContent('TR310');
    expect(panel).toHaveTextContent('Smyrna');
    expect(screen.getAllByText('Aydın').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Balıkesir').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Manisa').length).toBeGreaterThan(0);
  });

  test('renders a centroid marker for every province that has one', () => {
    render(<GeographyScenario />);

    expect(screen.getAllByTestId('geo-centroid')).toHaveLength(81);
  });
});
