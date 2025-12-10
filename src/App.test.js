import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock(
  'turkey-map-react',
  () => function () {
    return <div data-testid="turkey-map-mock" />;
  },
);

test('renders turkey population heatmap title', () => {
  render(<App />);
  const heading = screen.getByRole('heading', {
    name: /turkey population heatmap/i,
  });
  expect(heading).toBeInTheDocument();
});
