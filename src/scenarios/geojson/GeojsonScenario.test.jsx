import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  afterEach, describe, expect, test, vi,
} from 'vitest';
// eslint-disable-next-line import-x/no-unresolved -- package subpath uses a conditional export map
import { geoJsonToCities } from 'turkey-map-react/geojson';
import GeojsonScenario from './GeojsonScenario';
import sampleGeoJson from './sampleGeoJson';

const countSubpaths = (path) => (path.match(/M /g) || []).length;

afterEach(() => {
  vi.restoreAllMocks();
});

describe('GeoJSON conversion', () => {
  test('converts every usable feature and skips the unsupported one', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const converted = geoJsonToCities(sampleGeoJson, { padding: 20 });

    expect(converted).toHaveLength(4);
    expect(converted.map((city) => city.id)).toEqual([
      'marmara',
      'ege',
      'ic-anadolu',
      'dogu-anadolu',
    ]);
    expect(countSubpaths(converted.find((city) => city.id === 'ic-anadolu').path)).toBe(2);
    expect(countSubpaths(converted.find((city) => city.id === 'dogu-anadolu').path)).toBe(2);
  });

  test('supports custom key mapping without dropping features', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const converted = geoJsonToCities(sampleGeoJson, {
      idKey: 'ADM1_CODE',
      nameKey: 'NAME_1',
      plateKey: 'PLATE',
    });

    expect(converted).toHaveLength(4);
    expect(converted[0]).toMatchObject({
      id: 'TR-MARMARA',
      name: 'Marmara',
      plateNumber: 34,
    });
  });

  test('changes generated coordinates with padding and precision', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});

    const compact = geoJsonToCities(sampleGeoJson, { padding: 0, precision: 2 });
    const padded = geoJsonToCities(sampleGeoJson, { padding: 40, precision: 2 });

    expect(compact[0].path).not.toBe(padded[0].path);
  });
});

describe('GeojsonScenario', () => {
  test('reports converted and skipped features', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    render(<GeojsonScenario />);

    expect(screen.getByText(/4 converted · 1 skipped/i)).toBeInTheDocument();
    expect(screen.getByText(/feature skipped because/i)).toBeInTheDocument();
  });

  test('switches to custom key mapping and hides the skip notice', async () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<GeojsonScenario />);

    await user.selectOptions(screen.getByLabelText(/key mapping/i), 'custom');
    expect(screen.getAllByText('TR-MARMARA').length).toBeGreaterThan(0);

    await user.selectOptions(screen.getByLabelText(/key mapping/i), 'accessor');
    expect(screen.getAllByText('tr-marmara').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('checkbox', { name: /include unsupported point/i }));
    expect(screen.queryByText(/feature skipped because/i)).toBeNull();
  });
});
