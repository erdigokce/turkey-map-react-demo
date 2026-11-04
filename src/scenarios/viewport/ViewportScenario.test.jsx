import {
  render, screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import ViewportScenario from './ViewportScenario';

describe('ViewportScenario', () => {
  test('zoomTo and resetView update the uncontrolled readout', async () => {
    const user = userEvent.setup();
    render(<ViewportScenario />);

    expect(screen.getByTestId('viewport-scale')).toHaveTextContent('1.00');

    await user.click(screen.getByRole('button', { name: /zoomTo\(3\)/i }));
    await waitFor(() => {
      expect(screen.getByTestId('viewport-scale')).toHaveTextContent('3.00');
    });

    await user.click(screen.getByRole('button', { name: /`resetView\(\)`/i }));
    await waitFor(() => {
      expect(screen.getByTestId('viewport-scale')).toHaveTextContent('1.00');
    });
  });

  test('controlled mode follows ref calls and keeps reporting', async () => {
    const user = userEvent.setup();
    render(<ViewportScenario />);

    await user.click(screen.getByRole('button', { name: 'controlled' }));
    expect(screen.getByText(/gestures report/i)).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /zoomTo\(3\)/i }));
    await waitFor(() => {
      expect(screen.getByTestId('viewport-scale')).toHaveTextContent('3.00');
    });

    await user.click(screen.getByRole('button', { name: 'uncontrolled' }));
    await waitFor(() => {
      expect(screen.getByTestId('viewport-scale')).toHaveTextContent('1.00');
    });
  });

  test('exposes focus presets and the keyboard shortcut help', () => {
    render(<ViewportScenario />);

    expect(screen.getByRole('button', { name: /focusCity · İstanbul/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /focusCity · Ankara/i })).toBeInTheDocument();
    expect(screen.getByText(/zoom in/i)).toBeInTheDocument();
    expect(screen.getByText(/reset view/i)).toBeInTheDocument();
  });
});
