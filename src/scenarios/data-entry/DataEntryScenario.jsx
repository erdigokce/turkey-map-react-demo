import React, { useMemo, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import TurkeyMapCore from 'turkey-map-react/core';
import { cities } from 'turkey-map-react/data';
import { formatNumber, getPopulationByPlate } from '../../utils/cityMetrics';
import { REGIONS, REGION_BY_PLATE, buildRegionCities } from '../regions/regions';

const REGION_CITIES = buildRegionCities(cities);
const REGION_DATA = { cities: REGION_CITIES };
const REGION_COLOR_BY_ID = new Map(REGIONS.map((region) => [region.id, region.color]));
const CITY_BY_ID = new Map(cities.map((city) => [city.id, city]));

const getProvinceStyle = (city, state) => {
  const region = REGION_BY_PLATE.get(Number(city.plateNumber));
  return {
    fill: region?.color || '#94a3b8',
    opacity: state.hovered && !state.selected ? 0.76 : 1,
    stroke: state.selected ? '#0f172a' : undefined,
    strokeWidth: state.selected ? 2.6 : undefined,
  };
};

const getRegionStyle = (city, state) => {
  const base = REGION_COLOR_BY_ID.get(city.id) || '#94a3b8';
  return {
    fill: base,
    opacity: state.hovered && !state.selected ? 0.76 : 1,
    stroke: state.selected ? '#0f172a' : undefined,
    strokeWidth: state.selected ? 2.6 : undefined,
  };
};

const regionStats = REGIONS.map((region) => ({
  ...region,
  population: region.plates.reduce(
    (total, plate) => total + (getPopulationByPlate(plate) || 0),
    0,
  ),
}));

function DataEntryScenario() {
  const [selectedProvince, setSelectedProvince] = useState('istanbul');
  const [selectedRegion, setSelectedRegion] = useState('marmara');

  const province = selectedProvince ? CITY_BY_ID.get(selectedProvince) : null;
  const provinceRegion = province ? REGION_BY_PLATE.get(Number(province.plateNumber)) : null;
  const region = useMemo(
    () => regionStats.find((item) => item.id === selectedRegion) || null,
    [selectedRegion],
  );

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Entry points · root vs core vs data</p>
            <h3>Anatolia, two ways</h3>
          </div>
          <div className="pill">81 provinces → 7 custom regions</div>
        </div>

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">Same component, different data</span>
            <span className="legend-note">The core entry never imports the built-in dataset</span>
          </div>
          <ul className="hint-list">
            <li>The left map imports the default root entry and uses all 81 built-in provinces.</li>
            <li>The right map imports `turkey-map-react/core` and receives seven merged region paths.</li>
            <li>Both maps share the same selection, tooltip and keyboard API.</li>
          </ul>
        </div>

        <div className="entrypoint-maps">
          <div className="entrypoint-map">
            <div className="entrypoint-map-head">
              <span className="entrypoint-tag">root</span>
              <strong>81 provinces</strong>
              <span>turkey-map-react</span>
            </div>
            <div className="map-wrapper">
              <TurkeyMap
                id="entry-root"
                hoverable
                showTooltip
                selectionMode="single"
                selectedCity={selectedProvince}
                onSelectionChange={(next) => setSelectedProvince(next[0]?.id || null)}
                ariaLabel="All 81 provinces from the root entry"
                getCityStyle={getProvinceStyle}
              />
            </div>
          </div>

          <div className="entrypoint-map">
            <div className="entrypoint-map-head">
              <span className="entrypoint-tag is-core">core</span>
              <strong>7 regions</strong>
              <span>turkey-map-react/core</span>
            </div>
            <div className="map-wrapper">
              <TurkeyMapCore
                id="entry-core"
                hoverable
                showTooltip
                selectionMode="single"
                data={REGION_DATA}
                selectedCity={selectedRegion}
                onSelectionChange={(next) => setSelectedRegion(next[0]?.id || null)}
                ariaLabel="Seven custom regions from the core entry"
                getCityStyle={getRegionStyle}
              />
            </div>
          </div>
        </div>

        <div className="map-footer">
          <div className="pill subtle">
            Root dataset:
            {' '}
            {cities.length}
            {' '}
            cities
          </div>
          <div className="pill subtle">
            Custom dataset:
            {' '}
            {REGION_CITIES.length}
            {' '}
            region shapes
          </div>
          <div className="pill subtle">Merged SVG paths keep the original geometry</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Selected province · root map</p>
          {province ? (
            <>
              <h3>{province.name}</h3>
              <p className="meta">
                Plate
                {' '}
                <strong>{province.plateNumber}</strong>
                {' · '}
                {provinceRegion?.name}
                {' '}
                region
              </p>
              <p className="meta">
                Population:
                {' '}
                <strong>{formatNumber(getPopulationByPlate(province.plateNumber))}</strong>
              </p>
              <p className="meta subtle-text">
                Rendered from the built-in dataset bundled with the root entry.
              </p>
            </>
          ) : (
            <div className="empty">Click a province to inspect it.</div>
          )}
        </div>

        <div className="panel">
          <p className="label">Selected region · core map</p>
          {region ? (
            <>
              <h3>{region.name}</h3>
              <p className="meta">
                {region.plates.length}
                {' '}
                provinces · population
                {' '}
                <strong>{formatNumber(region.population)}</strong>
              </p>
              <div className="region-pills">
                {REGIONS.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`region-pill ${item.id === region.id ? 'active' : ''}`}
                    style={{ '--region-color': item.color }}
                    onClick={() => setSelectedRegion(item.id)}
                  >
                    {item.name}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="empty">Click a region to inspect it.</div>
          )}
        </div>

        <div className="panel">
          <p className="label">What each entry pays for</p>
          <ul className="source-list">
            <li className="is-on">
              <strong>`turkey-map-react`</strong>
              <span>Component + 81-province dataset. Best for the one-liner.</span>
            </li>
            <li className="is-on">
              <strong>`turkey-map-react/core`</strong>
              <span>Component only; `data` is required and custom geography is yours.</span>
            </li>
            <li className="is-on">
              <strong>`turkey-map-react/data`</strong>
              <span>The standalone 81-city array, usable without React or the component.</span>
            </li>
          </ul>
          <pre className="code-block">
            {`import TurkeyMap from 'turkey-map-react';
import TurkeyMapCore from 'turkey-map-react/core';
import { cities } from 'turkey-map-react/data';`}
          </pre>
        </div>
      </aside>
    </div>
  );
}

export default DataEntryScenario;
