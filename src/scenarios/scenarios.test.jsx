import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { SCENARIOS } from './index';

describe('scenario registry', () => {
  test.each(SCENARIOS)('renders the $label scenario', ({ component: Scenario }) => {
    render(<Scenario />);

    expect(screen.getAllByRole('heading').length).toBeGreaterThan(0);
  });
});
