import React, { useCallback, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { getPopulation } from '../../utils/cityMetrics';

const HEAT_STOPS = ['#fef3c7', '#fdba74', '#fb923c', '#ef4444', '#991b1b'];

const THEMES = {
  daylight: {
    id: 'daylight',
    label: 'Aegean dawn',
    card: '#f0f9ff',
    accent: '#0369a1',
    vars: {
      '--tm-idle-color': '#dbeafe',
      '--tm-hover-color': '#bfdbfe',
      '--tm-selected-color': '#2563eb',
      '--tm-disabled-color': '#e2e8f0',
      '--tm-stroke-color': '#ffffff',
      '--tm-stroke-width': '1',
      '--tm-focus-ring': '#2563eb',
    },
  },
  midnight: {
    id: 'midnight',
    label: 'Anatolian midnight',
    card: '#0f172a',
    accent: '#fbbf24',
    vars: {
      '--tm-idle-color': '#1e293b',
      '--tm-hover-color': '#334155',
      '--tm-selected-color': '#f59e0b',
      '--tm-disabled-color': '#0f172a',
      '--tm-stroke-color': '#0b1120',
      '--tm-stroke-width': '1.2',
      '--tm-focus-ring': '#fbbf24',
    },
  },
  neon: {
    id: 'neon',
    label: 'Neon bazaar',
    card: '#111827',
    accent: '#22d3ee',
    vars: {
      '--tm-idle-color': '#1f2937',
      '--tm-hover-color': '#312e81',
      '--tm-selected-color': '#22d3ee',
      '--tm-disabled-color': '#0b1120',
      '--tm-stroke-color': '#a855f7',
      '--tm-stroke-width': '1.4',
      '--tm-focus-ring': '#22d3ee',
    },
  },
  terracotta: {
    id: 'terracotta',
    label: 'Terracotta coast',
    card: '#fff7ed',
    accent: '#b45309',
    vars: {
      '--tm-idle-color': '#fed7aa',
      '--tm-hover-color': '#fdba74',
      '--tm-selected-color': '#b45309',
      '--tm-disabled-color': '#e7e5e4',
      '--tm-stroke-color': '#fffbeb',
      '--tm-stroke-width': '1',
      '--tm-focus-ring': '#b45309',
    },
  },
};

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const value = parseInt(clean, 16);
  return {
    r: (value >> 16) & 255,
    g: (value >> 8) & 255,
    b: value & 255,
  };
};

const mix = (from, to, ratio) => {
  const a = hexToRgb(from);
  const b = hexToRgb(to);
  const channel = (start, end) => Math.round(start + (end - start) * ratio);
  return `rgb(${channel(a.r, b.r)}, ${channel(a.g, b.g)}, ${channel(a.b, b.b)})`;
};

const getHeatColor = (population) => {
  if (!population) return HEAT_STOPS[0];
  const min = 80_000;
  const max = 16_000_000;
  const ratio = Math.min(1, Math.max(0, (Math.log10(population) - Math.log10(min))
    / (Math.log10(max) - Math.log10(min))));
  const scaled = ratio * (HEAT_STOPS.length - 1);
  const index = Math.min(HEAT_STOPS.length - 2, Math.floor(scaled));
  return mix(HEAT_STOPS[index], HEAT_STOPS[index + 1], scaled - index);
};

function ThemeTile({
  mapId, theme, selected, onSelectionChange, heat, label, override,
}) {
  const getCityStyle = useCallback((city, state) => {
    if (!heat) return undefined;
    const fill = getHeatColor(getPopulation(city));
    return {
      fill,
      opacity: state.hovered ? 0.82 : 1,
      stroke: state.selected ? theme.accent : undefined,
      strokeWidth: state.selected ? 2.4 : undefined,
    };
  }, [heat, theme.accent]);

  return (
    <div
      className="theme-tile"
      style={{ background: theme.card, color: theme.id === 'daylight' || theme.id === 'terracotta' ? '#0f172a' : '#e2e8f0' }}
    >
      <div className="theme-tile-head">
        <div>
          <p className="label" style={{ color: theme.accent }}>{label}</p>
          <h4>{theme.label}</h4>
        </div>
        <span className="theme-id">#{mapId}</span>
      </div>
      <div className="map-wrapper">
        <TurkeyMap
          id={mapId}
          hoverable
          showTooltip
          selectionMode="multiple"
          selectedCities={selected}
          onSelectionChange={(cities) => onSelectionChange(cities.map((city) => city.id))}
          ariaLabel={`${theme.label} themed map`}
          style={theme.vars}
          containerProps={{ 'data-theme': theme.id }}
          svgProps={{ 'data-themed': 'true' }}
          getCityStyle={getCityStyle}
          customStyle={override ? {
            idleColor: '#475569',
            hoverColor: '#64748b',
            selectedColor: '#0f172a',
            selectedStroke: '#f8fafc',
            selectedStrokeWidth: 2,
          } : undefined}
        />
      </div>
      <div className="theme-tile-foot">
        <span>{selected.length} selected</span>
        <span>{heat ? 'getCityStyle density overlay' : 'CSS variable theme only'}</span>
      </div>
    </div>
  );
}

function ThemingScenario() {
  const [themeA, setThemeA] = useState('daylight');
  const [themeB, setThemeB] = useState('midnight');
  const [selectedA, setSelectedA] = useState(['istanbul', 'ankara']);
  const [selectedB, setSelectedB] = useState(['izmir', 'antalya']);
  const [heat, setHeat] = useState(false);
  const [overrideLeft, setOverrideLeft] = useState(false);

  const swapThemes = () => {
    setThemeA(themeB);
    setThemeB(themeA);
  };

  const clearSelections = () => {
    setSelectedA([]);
    setSelectedB([]);
  };

  const activeTheme = THEMES[themeA];

  return (
    <div className="map-grid theme-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Theming lab · CSS variables + callback</p>
            <h3>Two moods, one component</h3>
          </div>
          <div className="pill">
            {heat ? 'Density overlay on' : 'Density overlay off'}
          </div>
        </div>

        <div className="control-row is-wrapping">
          <label className="field is-inline" htmlFor="theme-a">
            <span>Left theme</span>
            <select
              id="theme-a"
              value={themeA}
              onChange={(event) => setThemeA(event.target.value)}
            >
              {Object.values(THEMES).map((theme) => (
                <option key={theme.id} value={theme.id}>{theme.label}</option>
              ))}
            </select>
          </label>
          <label className="field is-inline" htmlFor="theme-b">
            <span>Right theme</span>
            <select
              id="theme-b"
              value={themeB}
              onChange={(event) => setThemeB(event.target.value)}
            >
              {Object.values(THEMES).map((theme) => (
                <option key={theme.id} value={theme.id}>{theme.label}</option>
              ))}
            </select>
          </label>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={heat}
              onChange={(event) => setHeat(event.target.checked)}
            />
            <span>Population overlay</span>
          </label>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={overrideLeft}
              onChange={(event) => setOverrideLeft(event.target.checked)}
            />
            <span>customStyle override (left)</span>
          </label>
          <button type="button" className="pill pill-button" onClick={swapThemes}>
            Swap themes
          </button>
          <button type="button" className="pill pill-button" onClick={clearSelections}>
            Clear selections
          </button>
        </div>

        <div className="theme-tiles">
          <ThemeTile
            mapId="theme-left"
            label="Instance A"
            theme={THEMES[themeA]}
            selected={selectedA}
            onSelectionChange={setSelectedA}
            heat={heat}
            override={overrideLeft}
          />
          <ThemeTile
            mapId="theme-right"
            label="Instance B"
            theme={THEMES[themeB]}
            selected={selectedB}
            onSelectionChange={setSelectedB}
            heat={heat}
          />
        </div>

        <div className="legend is-heat">
          <div className="legend-header">
            <span className="legend-title">Layer order</span>
            <span className="legend-note">Defaults → CSS variables → customStyle → getCityStyle</span>
          </div>
          <ul className="hint-list">
            <li>Each tile sets its own `--tm-*` variables through the `style` prop.</li>
            <li>Distinct `id` values scope the SVG, tooltip and province group ids.</li>
            <li>`getCityStyle` receives hovered, selected, disabled and focused state.</li>
            <li>Turn the overlay off to see the pure CSS-variable palette again.</li>
          </ul>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Active variables · left map</p>
          <h4>{activeTheme.label}</h4>
          <pre className="code-block">
            {Object.entries(activeTheme.vars)
              .map(([name, value]) => `${name}: ${value};`)
              .join('\n')}
          </pre>
        </div>

        <div className="panel">
          <p className="label">Layer recipe</p>
          <ul className="hint-list">
            <li>`style` themes one instance without a global stylesheet.</li>
            <li>`customStyle` beats variables when both define the same color.</li>
            <li>`getCityStyle` wins for the properties it returns; `undefined` falls through.</li>
            <li>Selected stroke stays authoritative over general stroke variables.</li>
          </ul>
        </div>

        <div className="panel">
          <p className="label">Selection state</p>
          <p className="meta">
            Left:
            {' '}
            <strong>{selectedA.length}</strong>
            {' '}
            provinces · Right:
            {' '}
            <strong>{selectedB.length}</strong>
            {' '}
            provinces
          </p>
          <p className="meta subtle-text">
            Both maps keep independent selection and independent theme variables on the same page.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default ThemingScenario;
