import React, { useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { cities } from 'turkey-map-react/data';
import { formatNumber } from '../../utils/cityMetrics';

const REGIONS = [
  { id: 'marmara', label: 'Marmara', color: '#2563eb' },
  { id: 'ege', label: 'Ege', color: '#0d9488' },
  { id: 'akdeniz', label: 'Akdeniz', color: '#ea580c' },
  { id: 'ic-anadolu', label: 'İç Anadolu', color: '#ca8a04' },
  { id: 'karadeniz', label: 'Karadeniz', color: '#16a34a' },
  { id: 'dogu-anadolu', label: 'Doğu Anadolu', color: '#7c3aed' },
  { id: 'guneydogu-anadolu', label: 'Güneydoğu Anadolu', color: '#be123c' },
];

const REGION_BY_ID = new Map(REGIONS.map((region) => [region.id, region]));
const CITY_BY_ID = new Map(cities.map((city) => [city.id, city]));

function GeographyScenario() {
  const [hoveredId, setHoveredId] = useState(null);
  const [selectedId, setSelectedId] = useState('ankara');

  const activeId = hoveredId || selectedId;
  const activeCity = activeId ? CITY_BY_ID.get(activeId) : null;
  const neighborSet = new Set(activeCity?.neighbors || []);
  const activeRegion = activeCity?.region ? REGION_BY_ID.get(activeCity.region) : null;

  const getCityStyle = (city, state) => {
    const region = REGION_BY_ID.get(city.region);
    const isActive = activeId === city.id;
    const isNeighbor = Boolean(activeId) && neighborSet.has(city.id);
    const dimmed = Boolean(activeId) && !isActive && !isNeighbor;

    return {
      fill: region?.color || '#94a3b8',
      opacity: dimmed ? 0.28 : state.hovered ? 0.9 : 1,
      stroke: state.selected ? '#0f172a' : undefined,
      strokeWidth: state.selected ? 2.4 : undefined,
    };
  };

  const cityWrapper = (cityComponent, city) => {
    if (!city.centroid) return cityComponent;

    const isActive = activeId === city.id;
    const isNeighbor = neighborSet.has(city.id);
    const showLabel = isActive || isNeighbor;

    return (
      <g className="geo-city">
        {cityComponent}
        <circle
          className={`geo-centroid ${isActive ? 'is-active' : ''}`}
          cx={city.centroid.x}
          cy={city.centroid.y}
          r={isActive ? 3.6 : 2.2}
          data-testid="geo-centroid"
          aria-hidden="true"
        />
        {showLabel && (
          <text
            className={`geo-centroid-label ${isActive ? 'is-active' : ''}`}
            x={city.centroid.x}
            y={city.centroid.y - 6}
            textAnchor="middle"
            aria-hidden="true"
          >
            {city.name}
          </text>
        )}
      </g>
    );
  };

  const renderTooltip = (city) => {
    const region = city.region ? REGION_BY_ID.get(city.region) : null;
    return (
      <span className="tooltip-card">
        <span className="chroma-tooltip-top">
          <span className="tooltip-plate">{String(city.plateNumber).padStart(2, '0')}</span>
          <span className="chroma-tooltip-scale">{region?.label || 'Unknown region'}</span>
        </span>
        <strong className="tooltip-card-name">{city.name}</strong>
        <span className="tooltip-card-meta">
          {formatNumber(city.areaKm2)}
          {' km² · '}
          {formatNumber(city.population)}
          {' people'}
        </span>
        <span className="tooltip-card-hint">
          {city.isoCode}
          {' · '}
          {city.nutsCode}
        </span>
      </span>
    );
  };

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Geography atlas · built-in CityType fields</p>
            <h3>Regions, neighbours and centroids</h3>
          </div>
          <div className="pill">
            {activeCity ? activeCity.name : 'Hover a province'}
            {activeRegion ? ` · ${activeRegion.label}` : ''}
          </div>
        </div>

        <div className="legend geo-legend">
          <div className="legend-header">
            <span className="legend-title">Seven regions from `city.region`</span>
            <span className="legend-note">Hover a province to isolate its land neighbours</span>
          </div>
          <div className="geo-region-list">
            {REGIONS.map((region) => (
              <span key={region.id} className="geo-region">
                <span className="legend-color" style={{ backgroundColor: region.color }} />
                {region.label}
              </span>
            ))}
          </div>
        </div>

        <div className="map-wrapper">
          <TurkeyMap
            id="geography-atlas"
            hoverable
            showTooltip
            selectionMode="single"
            selectedCity={selectedId}
            onSelectionChange={(next) => setSelectedId(next[0]?.id || null)}
            onHover={(city) => setHoveredId(city ? city.id : null)}
            getCityStyle={getCityStyle}
            cityWrapper={cityWrapper}
            renderTooltip={renderTooltip}
            ariaLabel="Geography data atlas"
            customStyle={{
              hoverColor: '#0f172a',
              selectedStroke: '#0f172a',
              selectedStrokeWidth: 2,
              focusStroke: '#7c3aed',
            }}
          />
        </div>

        <div className="map-footer">
          <div className="pill subtle">Centroid dots are pointer-inert</div>
          <div className="pill subtle">Labels appear for the active province and neighbours</div>
          <div className="pill subtle">Click or press Enter to pin a province</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel" data-testid="geo-detail-panel">
          <p className="label">Active province</p>
          {activeCity ? (
            <>
              <h3>{activeCity.name}</h3>
              <p className="meta">
                {activeRegion?.label}
                {' · '}
                <strong>{activeCity.isoCode}</strong>
                {' · '}
                {activeCity.nutsCode}
              </p>

              <div className="geo-stat-grid">
                <div className="geo-stat">
                  <small>Area</small>
                  <strong>{formatNumber(activeCity.areaKm2)} km²</strong>
                </div>
                <div className="geo-stat">
                  <small>Population</small>
                  <strong>{formatNumber(activeCity.population)}</strong>
                </div>
                <div className="geo-stat">
                  <small>Plate</small>
                  <strong>{String(activeCity.plateNumber).padStart(2, '0')}</strong>
                </div>
                <div className="geo-stat">
                  <small>Centroid</small>
                  <strong>
                    {activeCity.centroid?.x.toFixed(1)}
                    {', '}
                    {activeCity.centroid?.y.toFixed(1)}
                  </strong>
                </div>
              </div>

              <p className="meta">
                Also known as:
                {' '}
                <strong>{activeCity.altNames?.length ? activeCity.altNames.join(', ') : '—'}</strong>
              </p>
              <p className="meta subtle-text">
                Region, area, population and codes all came from the interaction payload.
              </p>
            </>
          ) : (
            <div className="empty">Hover or select a province to inspect its geography.</div>
          )}
        </div>

        <div className="panel">
          <p className="label">Land neighbours</p>
          {activeCity?.neighbors?.length ? (
            <div className="geo-neighbors">
              {activeCity.neighbors.map((neighborId) => {
                const neighbor = CITY_BY_ID.get(neighborId);
                const region = neighbor?.region ? REGION_BY_ID.get(neighbor.region) : null;
                return (
                  <span key={neighborId} className="geo-neighbor">
                    <span
                      className="legend-color"
                      style={{ backgroundColor: region?.color || '#94a3b8' }}
                    />
                    {neighbor?.name || neighborId}
                  </span>
                );
              })}
            </div>
          ) : (
            <div className="empty">
              {activeCity ? 'This province has no land neighbours in the dataset.' : 'No province active.'}
            </div>
          )}
          <p className="meta subtle-text">
            `neighbors` is symmetric and stores city ids, so resolving names stays a one-line lookup.
          </p>
        </div>

        <div className="panel">
          <p className="label">Available fields</p>
          <pre className="code-block">
            {`{
  id: '${activeCity?.id || 'ankara'}',
  region: '${activeCity?.region || 'ic-anadolu'}',
  centroid: { x: ${activeCity?.centroid?.x?.toFixed(2) || '0'}, y: ${activeCity?.centroid?.y?.toFixed(2) || '0'} },
  neighbors: [${(activeCity?.neighbors || []).slice(0, 3).map((id) => `'${id}'`).join(', ')}${(activeCity?.neighbors?.length || 0) > 3 ? ', …' : ''}],
  areaKm2: ${activeCity?.areaKm2 || 0},
  population: ${activeCity?.population || 0},
  isoCode: '${activeCity?.isoCode || ''}',
  nutsCode: '${activeCity?.nutsCode || ''}',
}`}
          </pre>
        </div>
      </aside>
    </div>
  );
}

export default GeographyScenario;
