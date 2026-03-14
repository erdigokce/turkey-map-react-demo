/* eslint-disable no-bitwise */
import React, { useMemo, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import populationData from '../data/population.json';
import riskLevels from '../data/earthquakeRisk.json';
import recentQuakes from '../data/recentQuakes.json';

const RISK_COLORS = ['#fef3c7', '#fde68a', '#fdba74', '#fb923c', '#b91c1c'];

const hexToRgb = (hex) => {
  const clean = hex.replace('#', '');
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
};

const lighten = (hex, ratio = 0.12) => {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel + (255 - channel) * ratio);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

const darken = (hex, ratio = 0.22) => {
  const { r, g, b } = hexToRgb(hex);
  const mix = (channel) => Math.round(channel * (1 - ratio));
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

const formatNumber = (value) => new Intl.NumberFormat('tr-TR').format(value);

function EarthquakeMap() {
  const [activeTab, setActiveTab] = useState('risk');
  const [hoveredPlate, setHoveredPlate] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [selectedPlate, setSelectedPlate] = useState(34);
  const [minMagnitude, setMinMagnitude] = useState(4.3);

  const populationByPlate = useMemo(
    () => new Map(populationData.map((city) => [Number(city.plate), city])),
    [],
  );

  const riskByPlate = useMemo(() => {
    const map = new Map();
    riskLevels.forEach((item) => {
      map.set(Number(item.plate), Number(item.riskLevel));
    });
    return map;
  }, []);

  const quakesByProvince = useMemo(() => {
    const map = new Map();
    recentQuakes.forEach((quake) => {
      if (quake.provincePlate) {
        const existing = map.get(quake.provincePlate) || [];
        existing.push(quake);
        map.set(quake.provincePlate, existing);
      }
    });
    return map;
  }, []);

  const filteredQuakes = useMemo(
    () => recentQuakes.filter((q) => q.magnitude >= minMagnitude).sort((a, b) => b.magnitude - a.magnitude),
    [minMagnitude],
  );

  const selectedCity = populationByPlate.get(selectedPlate);
  const selectedRisk = riskByPlate.get(selectedPlate) || 3;
  const selectedQuakes = (quakesByProvince.get(selectedPlate) || [])
    .filter((q) => q.magnitude >= minMagnitude)
    .sort((a, b) => b.magnitude - a.magnitude);

  const getRiskColor = (level) => {
    const index = Math.min(Math.max(level, 1), 5) - 1;
    return RISK_COLORS[index];
  };

  const renderLegend = () => (
    <div className="legend">
      <div className="legend-header">
        <span className="legend-title">Risk levels</span>
        <span className="legend-note">AFAD hazard-inspired (demo)</span>
      </div>
      <div className="legend-swatches">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className="legend-item">
            <span className="legend-color" style={{ backgroundColor: getRiskColor(level) }} />
            <span className="legend-label">
              Level
              {' '}
              {level}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderMagnitudeFilter = () => (
    <div className="magnitude-filter">
      <div className="filter-top">
        <span>Show quakes above</span>
        <strong>
          {minMagnitude.toFixed(1)}
          {' '}
          Mw
        </strong>
      </div>
      <input
        type="range"
        min="4"
        max="6"
        step="0.1"
        value={minMagnitude}
        onChange={(e) => setMinMagnitude(Number(e.target.value))}
      />
      <div className="filter-scale">
        <span>4.0</span>
        <span>5.0</span>
        <span>6.0</span>
      </div>
    </div>
  );

  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">Turkey Map React · Demo Story</p>
          <h1>Earthquake risk + recent activity</h1>
          <p className="lede">
            A quick, expressive view of seismic risk levels by province, paired with a short feed of
            recent events. Click a province to pin details and scan the latest notable quakes.
          </p>
          <div className="source-chip">Data: demo values inspired by AFAD hazard map + sample quake feed</div>
        </div>
        <div className="tabs">
          <button
            type="button"
            className={`tab-button ${activeTab === 'risk' ? 'active' : ''}`}
            onClick={() => setActiveTab('risk')}
          >
            Risk map
          </button>
          <button
            type="button"
            className={`tab-button ${activeTab === 'quakes' ? 'active' : ''}`}
            onClick={() => setActiveTab('quakes')}
          >
            Recent quakes
          </button>
        </div>
      </div>

      <div className="map-shell">
        <div className="map-grid">
          <div className="map-card">
            <div className="map-header">
              <div>
                <p className="label">Province-level choropleth</p>
                <h3>{activeTab === 'risk' ? 'Seismic hazard emphasis' : 'Filterable recent events'}</h3>
              </div>
              <div className="pill">
                {activeTab === 'risk' ? 'Hover for risk · Click to pin' : 'Recent Mw 4.0+ (sample)'}
              </div>
            </div>

            {renderLegend()}

            <div className="map-wrapper">
              <TurkeyMap
                hoverable
                showTooltip
                // Make hoverColor transparent so the map's province fill (set in cityWrapper)
                // remains visible and colorful instead of being overlaid with gray.
                customStyle={{ idleColor: '#450000ff', hoverColor: '#4500009a' }}
                cityWrapper={(cityComponent, city) => {
                  const plate = Number(city.plateNumber);
                  const riskLevel = riskByPlate.get(plate) || 3;
                  const baseColor = getRiskColor(riskLevel);
                  const isHovered = hoveredPlate === plate;
                  const isSelected = selectedPlate === plate;
                  // eslint-disable-next-line no-nested-ternary
                  const fill = isSelected ? darken(baseColor) : isHovered ? lighten(baseColor) : baseColor;

                  const { children } = cityComponent.props;
                  if (!children) return cityComponent;

                  if (React.isValidElement(children)) {
                    const style = { ...(children.props && children.props.style), fill };
                    return React.cloneElement(cityComponent, {}, React.cloneElement(children, { style }));
                  }

                  if (Array.isArray(children)) {
                    const newChildren = children.map((child) => (
                      React.isValidElement(child)
                        ? React.cloneElement(child, { style: { ...(child.props && child.props.style), fill } })
                        : child
                    ));
                    return React.cloneElement(cityComponent, {}, ...newChildren);
                  }

                  return cityComponent;
                }}
                onHover={(city) => setHoveredPlate(city ? Number(city.plateNumber) : null)}
                onClick={(city) => {
                  if (city && city.plateNumber) {
                    setSelectedPlate(Number(city.plateNumber));
                  }
                }}
              />
            </div>

            <div className="map-footer">
              <div className="pill">Click to pin a province · Hover to preview</div>
              <div className="pill subtle">Colors are illustrative for demo purposes</div>
            </div>
          </div>

          <aside className="side-panel">
            <div className="panel">
              <p className="label">Pinned province</p>
              <h3>{selectedCity ? selectedCity.name : 'Select a province'}</h3>
              <p className="metric">
                Risk level
                {' '}
                <strong>{selectedRisk}</strong>
                /5
              </p>
              {selectedCity && (
                <p className="meta">
                  Population:
                  {formatNumber(selectedCity.population)}
                </p>
              )}
              <p className="meta subtle-text">Click a province on the map to update.</p>
            </div>

            <div className="panel">
              <div className="panel-head">
                <div>
                  <p className="label">Recent quakes (demo)</p>
                  <h4>
                    {filteredQuakes.length}
                    {' '}
                    events ≥
                    {' '}
                    {minMagnitude.toFixed(1)}
                    {' '}
                    Mw
                  </h4>
                </div>
                {renderMagnitudeFilter()}
              </div>
              <div className="quake-list">
                {filteredQuakes.map((quake) => (
                  <div key={quake.id} className="quake-card">
                    <div className="badge">
                      Mw
                      {quake.magnitude.toFixed(1)}
                    </div>
                    <div className="quake-copy">
                      <p className="quake-location">{quake.location}</p>
                      <p className="quake-meta">
                        {new Date(quake.timeUtc).toLocaleString('tr-TR', { timeZone: 'Europe/Istanbul' })}
                        {' · '}
                        Depth
                        {' '}
                        {quake.depthKm}
                        {' '}
                        km
                      </p>
                    </div>
                    <span className="pill subtle">
                      {populationByPlate.get(quake.provincePlate)?.name || 'Province'}
                    </span>
                  </div>
                ))}
                {filteredQuakes.length === 0 && (
                  <div className="empty">No events at this magnitude cut.</div>
                )}
              </div>
            </div>

            <div className="panel">
              <p className="label">Pinned province events</p>
              {selectedQuakes.length ? (
                <ul className="list">
                  {selectedQuakes.map((quake) => (
                    <li key={quake.id}>
                      Mw
                      {quake.magnitude.toFixed(1)}
                      {' '}
                      —
                      {quake.location}
                      {' · '}
                      Depth
                      {' '}
                      {quake.depthKm}
                      {' '}
                      km
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="meta subtle-text">No recent sample events at this threshold.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default EarthquakeMap;
