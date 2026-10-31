import React, { useMemo, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import populationData from '../../data/population.json';
import metropolitanMunicipalities from './metropolitanMunicipalities.json';

const DEFAULT_SELECTION = metropolitanMunicipalities.map((city) => ({
  id: city.id,
  name: city.name,
  plateNumber: city.plate,
}));

const METROPOLITAN_IDS = new Set(metropolitanMunicipalities.map((city) => city.id));

const populationByPlate = new Map(
  populationData.map((city) => [Number(city.plate), city]),
);

const formatNumber = (value) => new Intl.NumberFormat('tr-TR').format(value);

const getPopulation = (city) => populationByPlate.get(Number(city.plateNumber))?.population;

const cloneDefaultSelection = () => DEFAULT_SELECTION.map((city) => ({ ...city }));

function MetropolitanScenario() {
  const [selectedCities, setSelectedCities] = useState(cloneDefaultSelection);
  const [lastSelected, setLastSelected] = useState(null);

  const sortedSelection = useMemo(
    () => [...selectedCities].sort((a, b) => (getPopulation(b) || 0) - (getPopulation(a) || 0)),
    [selectedCities],
  );

  const metropolitanSelectedCount = selectedCities.filter(
    (city) => METROPOLITAN_IDS.has(city.id),
  ).length;

  const totalPopulation = selectedCities.reduce(
    (total, city) => total + (getPopulation(city) || 0),
    0,
  );

  const resetSelection = () => {
    setSelectedCities(cloneDefaultSelection());
    setLastSelected(null);
  };

  const clearSelection = () => {
    setSelectedCities([]);
    setLastSelected(null);
  };

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Multiple selection · local demo</p>
            <h3>Büyükşehir municipalities of Türkiye</h3>
          </div>
          <div className="pill">
            {selectedCities.length}
            {' '}
            / 81 selected
          </div>
        </div>

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">Selection state</span>
            <span className="legend-note">All 30 büyükşehir start selected</span>
          </div>
          <div className="legend-swatches is-three">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#e2e8f0' }} />
              <span className="legend-label">Unselected</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#cbd5e1' }} />
              <span className="legend-label">Hover</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#1d4ed8' }} />
              <span className="legend-label">Selected</span>
            </div>
          </div>
        </div>

        <div className="map-wrapper">
          <TurkeyMap
            hoverable
            showTooltip
            selectionMode="multiple"
            selectedCities={selectedCities.map((city) => city.id)}
            onSelectionChange={(cities) => setSelectedCities(cities)}
            onSelect={(city) => setLastSelected(city)}
            customStyle={{
              idleColor: '#e2e8f0',
              hoverColor: '#cbd5e1',
              selectedColor: '#1d4ed8',
              selectedStroke: '#1e3a8a',
              selectedStrokeWidth: 2,
            }}
          />
        </div>

        <div className="map-footer">
          <button type="button" className="pill pill-button" onClick={resetSelection}>
            Reset to 30 büyükşehir
          </button>
          <button type="button" className="pill pill-button" onClick={clearSelection}>
            Clear all
          </button>
          <div className="pill subtle">Click a province to toggle its selection</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Selection summary</p>
          <h3>
            {metropolitanSelectedCount}
            {' '}
            of
            {' '}
            {metropolitanMunicipalities.length}
            {' '}
            büyükşehir selected
          </h3>
          <p className="metric">
            Provinces total:
            {' '}
            <strong>{selectedCities.length}</strong>
            {' '}
            / 81
          </p>
          <p className="meta">
            Population covered:
            {' '}
            <strong>{formatNumber(totalPopulation)}</strong>
          </p>
          <p className="meta subtle-text">
            The selection is controlled with the `selectedCities` and `onSelectionChange` props.
          </p>
        </div>

        <div className="panel">
          <p className="label">Selected provinces</p>
          {sortedSelection.length ? (
            <ul className="selection-list">
              {sortedSelection.map((city) => {
                const population = getPopulation(city);
                const isMetropolitan = METROPOLITAN_IDS.has(city.id);
                return (
                  <li key={city.id} className="selection-item">
                    <span>
                      <span className="selection-name">{city.name}</span>
                      <span className="selection-meta">
                        {String(city.plateNumber).padStart(2, '0')}
                        {' · '}
                        {isMetropolitan ? 'Büyükşehir' : 'Other province'}
                      </span>
                    </span>
                    <span className="selection-population">
                      {population ? formatNumber(population) : '—'}
                    </span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty">No provinces selected. Click a province on the map to add one.</div>
          )}
        </div>

        <div className="panel">
          <p className="label">onSelect event</p>
          <h4>{lastSelected ? lastSelected.name : 'No selection event yet'}</h4>
          <p className="meta subtle-text">
            {lastSelected
              ? 'Fired when a province was added to the selection.'
              : 'Click an unselected province to see onSelect fire.'}
          </p>
        </div>
      </aside>
    </div>
  );
}

export default MetropolitanScenario;
