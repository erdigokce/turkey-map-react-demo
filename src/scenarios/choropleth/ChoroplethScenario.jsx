import React, { useMemo, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { cities } from 'turkey-map-react/data';
import populationData from '../../data/population.json';
import { formatNumber } from '../../utils/cityMetrics';

const SCALE_TYPES = [
  { id: 'linear', label: 'linear' },
  { id: 'quantize', label: 'quantize' },
  { id: 'quantile', label: 'quantile' },
  { id: 'threshold', label: 'threshold' },
];

const PALETTES = {
  terrain: {
    label: 'Terrain',
    colors: ['#f0fdf4', '#bbf7d0', '#86efac', '#22c55e', '#166534'],
  },
  heat: {
    label: 'Heat',
    colors: ['#fff7ed', '#fed7aa', '#fb923c', '#ea580c', '#9a3412'],
  },
  ocean: {
    label: 'Ocean',
    colors: ['#f0f9ff', '#bae6fd', '#38bdf8', '#0284c7', '#0c4a6e'],
  },
};

const NO_DATA_IDS = ['hakkari', 'sirnak', 'tunceli', 'bayburt'];
const NO_DATA_COLOR = '#e2e8f0';
const THRESHOLDS = [250_000, 1_000_000, 3_000_000, 8_000_000];

const cityIdByPlate = new Map(
  cities.map((city) => [Number(city.plateNumber), city.id]),
);
const cityById = new Map(cities.map((city) => [city.id, city]));

const formatCompact = (value) => {
  if (!Number.isFinite(value)) return 'no data';
  return new Intl.NumberFormat('tr-TR', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

const getThresholdLabels = () => [
  `< ${formatCompact(THRESHOLDS[0])}`,
  ...THRESHOLDS.slice(0, -1).map((threshold, index) => (
    `${formatCompact(threshold)} – ${formatCompact(THRESHOLDS[index + 1])}`
  )),
  `≥ ${formatCompact(THRESHOLDS[THRESHOLDS.length - 1])}`,
];

const getBucketLabels = (scaleType, count) => {
  if (scaleType === 'threshold') return getThresholdLabels();

  const labels = [];
  for (let index = 0; index < count; index += 1) {
    if (index === 0) labels.push('lowest');
    else if (index === count - 1) labels.push('highest');
    else labels.push(`bucket ${index + 1}`);
  }
  return labels;
};

function ChoroplethScenario() {
  const [scaleType, setScaleType] = useState('quantile');
  const [paletteId, setPaletteId] = useState('terrain');
  const [withholdProvinces, setWithholdProvinces] = useState(true);
  const [animateValues, setAnimateValues] = useState(true);
  const [overrideIstanbul, setOverrideIstanbul] = useState(false);
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState('istanbul');

  const palette = PALETTES[paletteId];

  const values = useMemo(() => {
    const next = {};
    populationData.forEach((row) => {
      const cityId = cityIdByPlate.get(Number(row.plate));
      if (!cityId) return;
      if (withholdProvinces && NO_DATA_IDS.includes(cityId)) return;
      next[cityId] = Number(row.population);
    });
    return next;
  }, [withholdProvinces]);

  const domain = useMemo(() => {
    const finite = Object.values(values).filter(Number.isFinite);
    return {
      min: finite.length ? Math.min(...finite) : 0,
      max: finite.length ? Math.max(...finite) : 0,
      count: finite.length,
    };
  }, [values]);

  const activeId = hoveredId || selectedId;
  const activeCity = activeId ? cityById.get(activeId) : null;
  const activeValue = activeCity ? values[activeCity.id] : undefined;

  const getColor = overrideIstanbul
    ? (value, city) => (city.id === 'istanbul' ? '#7c3aed' : undefined)
    : undefined;

  const renderTooltip = (city, value) => {
    if (!city) return null;
    return (
      <span className="tooltip-card">
        <span className="chroma-tooltip-top">
          <span className="tooltip-plate">{String(city.plateNumber).padStart(2, '0')}</span>
          <span className="chroma-tooltip-scale">{scaleType}</span>
        </span>
        <strong className="tooltip-card-name">{city.name}</strong>
        <span className="tooltip-card-meta">
          {Number.isFinite(value) ? `${formatNumber(value)} people` : 'No value supplied'}
        </span>
        <span className="tooltip-card-hint">
          {overridden(city.id) ? 'getColor override' : 'Current value fill'}
        </span>
      </span>
    );
  };

  const overridden = (cityId) => overrideIstanbul && cityId === 'istanbul';

  const legendLabels = getBucketLabels(scaleType, palette.colors.length);

  const scaleHint = {
    linear: 'Interpolates the palette across the full population range.',
    quantize: 'Divides the numeric range into equal-width buckets.',
    quantile: 'Builds equal-count buckets from the sorted values.',
    threshold: 'Uses fixed population boundaries and four thresholds.',
  }[scaleType];

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Choropleth studio · values + scale types</p>
            <h3>One metric, four colour scales</h3>
          </div>
          <div className="pill">
            {scaleType}
            {' · '}
            {formatCompact(domain.min)}
            {' – '}
            {formatCompact(domain.max)}
          </div>
        </div>

        <div className="control-row is-wrapping">
          <div className="segmented" role="group" aria-label="Color scale type">
            {SCALE_TYPES.map((scale) => (
              <button
                key={scale.id}
                type="button"
                className={`segmented-button ${scaleType === scale.id ? 'active' : ''}`}
                aria-pressed={scaleType === scale.id}
                onClick={() => setScaleType(scale.id)}
              >
                {scale.label}
              </button>
            ))}
          </div>
          <label className="field is-inline" htmlFor="choropleth-palette">
            <span>Palette</span>
            <select
              id="choropleth-palette"
              value={paletteId}
              onChange={(event) => setPaletteId(event.target.value)}
            >
              {Object.entries(PALETTES).map(([id, item]) => (
                <option key={id} value={id}>{item.label}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="control-row is-wrapping">
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={withholdProvinces}
              onChange={(event) => setWithholdProvinces(event.target.checked)}
            />
            <span>Withhold four provinces</span>
          </label>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={animateValues}
              onChange={(event) => setAnimateValues(event.target.checked)}
            />
            <span>`animateValues`</span>
          </label>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={overrideIstanbul}
              onChange={(event) => setOverrideIstanbul(event.target.checked)}
            />
            <span>`getColor` override</span>
          </label>
        </div>

        <div className="legend choropleth-legend">
          <div className="legend-header">
            <span className="legend-title">{palette.label} scale</span>
            <span className="legend-note">{scaleHint}</span>
          </div>

          {scaleType === 'linear' ? (
            <>
              <div
                className="chroma-gradient"
                style={{
                  background: `linear-gradient(90deg, ${palette.colors.join(', ')})`,
                }}
              />
              <div className="chroma-gradient-labels">
                <span>{formatNumber(domain.min)}</span>
                <span>{formatNumber(domain.max)}</span>
              </div>
            </>
          ) : (
            <div className="chroma-buckets">
              {palette.colors.map((color, index) => (
                <div key={color} className="chroma-bucket">
                  <span className="legend-color" style={{ backgroundColor: color }} />
                  <span className="legend-label">{legendLabels[index]}</span>
                </div>
              ))}
            </div>
          )}

          <div className="chroma-foot">
            <span className="chroma-no-data">
              <span className="legend-color" style={{ backgroundColor: NO_DATA_COLOR }} />
              no data
            </span>
            <span>{domain.count} provinces with a value</span>
            {overrideIstanbul && (
              <span className="chroma-override">
                <span className="legend-color" style={{ backgroundColor: '#7c3aed' }} />
                İstanbul override
              </span>
            )}
          </div>
        </div>

        <div className="map-wrapper">
          <TurkeyMap
            id="choropleth-studio"
            hoverable
            showTooltip
            selectionMode="single"
            selectedCity={selectedId}
            onSelectionChange={(next) => setSelectedId(next[0]?.id || null)}
            values={values}
            colorScale={palette.colors}
            scaleType={scaleType}
            thresholds={THRESHOLDS}
            noDataColor={NO_DATA_COLOR}
            getColor={getColor}
            animateValues={animateValues}
            renderTooltip={renderTooltip}
            onHover={(city) => setHoveredId(city ? city.id : null)}
            ariaLabel="Choropleth scale playground"
            customStyle={{
              hoverColor: '#0f172a',
              selectedStroke: '#0f172a',
              selectedStrokeWidth: 2,
              focusStroke: '#7c3aed',
            }}
          />
        </div>

        <div className="map-footer">
          <div className="pill subtle">Hover a province to inspect its value</div>
          <div className="pill subtle">Hover and selection draw outlines, not replacement fills</div>
          <div className="pill subtle">`thresholds` is ignored unless the scale is threshold</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Active province</p>
          {activeCity ? (
            <>
              <h3>{activeCity.name}</h3>
              <p className="metric">
                {Number.isFinite(activeValue) ? formatNumber(activeValue) : 'No value'}
                {Number.isFinite(activeValue) && <span className="metric-unit"> people</span>}
              </p>
              <p className="meta">
                Plate
                {' '}
                <strong>{String(activeCity.plateNumber).padStart(2, '0')}</strong>
                {' · '}
                {overridden(activeCity.id) ? 'getColor override' : `${scaleType} scale`}
              </p>
              <p className="meta subtle-text">
                {Number.isFinite(activeValue)
                  ? 'The tooltip receives this value as its second argument.'
                  : 'This province is not present in the values object, so noDataColor is used.'}
              </p>
            </>
          ) : (
            <div className="empty">Hover or select a province to inspect its value.</div>
          )}
        </div>

        <div className="panel">
          <p className="label">How the fill is resolved</p>
          <ol className="chroma-stack">
            <li><strong>getCityStyle</strong><span>not used in this demo</span></li>
            <li><strong>getColor</strong><span>{overrideIstanbul ? 'İstanbul only' : 'off'}</span></li>
            <li><strong>colorScale</strong><span>{palette.label}, {scaleType}</span></li>
            <li><strong>noDataColor</strong><span>{withholdProvinces ? '4 provinces' : 'unused'}</span></li>
          </ol>
          <p className="meta subtle-text">
            Selection keeps the value fill and adds the selected outline. Disabled provinces would
            keep the disabled fill instead.
          </p>
        </div>

        <div className="panel">
          <p className="label">Current values</p>
          <pre className="code-block">
            {`<TurkeyMap
  values={values}
  colorScale={${JSON.stringify(palette.colors)}}
  scaleType="${scaleType}"${scaleType === 'threshold' ? `\n  thresholds={${JSON.stringify(THRESHOLDS)}}` : ''}
  noDataColor="${NO_DATA_COLOR}"
  animateValues={${animateValues}}${overrideIstanbul ? '\n  getColor={(value, city) => ...}' : ''}
/>`}
          </pre>
        </div>
      </aside>
    </div>
  );
}

export default ChoroplethScenario;
