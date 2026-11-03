import React, { useMemo, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { cities } from 'turkey-map-react/data';
import { formatNumber, getPopulation } from '../../utils/cityMetrics';

const MAX_STOPS = 5;
const PRESET_BASE = 'ankara';
const PRESET_STOPS = ['istanbul', 'izmir', 'nevsehir', 'trabzon'];
const CITY_BY_ID = new Map(cities.map((city) => [city.id, city]));

const MODES = [
  {
    id: 'single',
    label: 'Single · base city',
    hint: 'Pick where the trip starts. Choosing another province replaces the base city.',
  },
  {
    id: 'multiple',
    label: 'Multiple · itinerary',
    hint: 'Toggle up to five stops. Order is preserved and removing a stop is always allowed.',
  },
];

function SelectionScenario() {
  const [mode, setMode] = useState('multiple');
  const [baseId, setBaseId] = useState(PRESET_BASE);
  const [stopIds, setStopIds] = useState(PRESET_STOPS);
  const [lastEvent, setLastEvent] = useState(null);
  const [limitNotice, setLimitNotice] = useState(null);

  const selectedCityObjects = useMemo(() => {
    const ids = mode === 'single' ? (baseId ? [baseId] : []) : stopIds;
    return ids.map((id) => CITY_BY_ID.get(id)).filter(Boolean);
  }, [mode, baseId, stopIds]);

  const baseCity = baseId ? CITY_BY_ID.get(baseId) : null;
  const totalPopulation = selectedCityObjects.reduce(
    (total, city) => total + (getPopulation(city) || 0),
    0,
  );
  const activeMode = MODES.find((item) => item.id === mode) || MODES[0];

  const handleSelectionChange = (nextCities) => {
    setLimitNotice(null);
    if (mode === 'single') {
      setBaseId(nextCities[0]?.id || null);
    } else {
      setStopIds(nextCities.map((city) => city.id));
    }
    setLastEvent({
      callback: 'onSelectionChange',
      detail: nextCities.length
        ? nextCities.map((city) => city.name).join(' → ')
        : 'Selection cleared (empty array)',
    });
  };

  const handleSelect = (city) => {
    setLastEvent({
      callback: 'onSelect',
      detail: `${city.name} (${city.plateNumber}) was added to the selection`,
    });
  };

  const handleMaxSelection = (city, currentSelection, limit) => {
    setLimitNotice(
      `${city.name} was rejected: ${currentSelection.length}/${limit} stops are already pinned. Remove one first.`,
    );
    setLastEvent({
      callback: 'onMaxSelectionReached',
      detail: `${city.name} hit the ${limit}-stop cap`,
    });
  };

  const loadPreset = () => {
    setMode('multiple');
    setBaseId(PRESET_BASE);
    setStopIds(PRESET_STOPS);
    setLimitNotice(null);
    setLastEvent({ callback: 'preset', detail: 'Loaded the classic 4-stop route from Ankara' });
  };

  const clearSelection = () => {
    setBaseId(null);
    setStopIds([]);
    setLimitNotice(null);
    setLastEvent({ callback: 'local state', detail: 'Cleared every controlled value' });
  };

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Selection playground · controlled state</p>
            <h3>Build a Türkiye itinerary</h3>
          </div>
          <div className="pill">
            {mode === 'single' ? 'Single select' : `${stopIds.length} / ${MAX_STOPS} stops`}
          </div>
        </div>

        <div className="control-row is-wrapping">
          <div className="segmented" role="group" aria-label="Selection mode">
            {MODES.map((item) => (
              <button
                key={item.id}
                type="button"
                className={`segmented-button ${mode === item.id ? 'active' : ''}`}
                aria-pressed={mode === item.id}
                onClick={() => {
                  setMode(item.id);
                  setLimitNotice(null);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
          <div className="pill subtle">{activeMode.hint}</div>
        </div>

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">Selection semantics</span>
            <span className="legend-note">Click, Enter, Space, Escape and arrow keys all work</span>
          </div>
          <div className="legend-swatches is-three">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#e2e8f0' }} />
              <span className="legend-label">Idle</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#cbd5e1' }} />
              <span className="legend-label">Hover</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#0f766e' }} />
              <span className="legend-label">Selected</span>
            </div>
          </div>
        </div>

        {limitNotice && (
          <div className="warning-banner" role="status">
            {limitNotice}
          </div>
        )}

        <div className="map-wrapper">
          <TurkeyMap
            id="selection-playground"
            hoverable
            showTooltip
            ariaLabel="Türkiye itinerary selection demo"
            selectionMode={mode}
            selectedCity={mode === 'single' ? baseId : undefined}
            selectedCities={mode === 'multiple' ? stopIds : undefined}
            maxSelection={mode === 'multiple' ? MAX_STOPS : undefined}
            onMaxSelectionReached={mode === 'multiple' ? handleMaxSelection : undefined}
            onSelectionChange={handleSelectionChange}
            onSelect={handleSelect}
            customStyle={{
              idleColor: '#e2e8f0',
              hoverColor: '#cbd5e1',
              selectedColor: '#0f766e',
              selectedStroke: '#134e4a',
              selectedStrokeWidth: 2,
              focusStroke: '#0d9488',
            }}
          />
        </div>

        <div className="map-footer">
          <button type="button" className="pill pill-button" onClick={loadPreset}>
            Load classic route
          </button>
          <button type="button" className="pill pill-button" onClick={clearSelection}>
            Clear selection
          </button>
          <div className="pill subtle">
            {mode === 'single' ? 'Activating another city replaces the base' : 'Escape clears the whole route'}
          </div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Trip summary</p>
          <h3>{mode === 'single' ? 'Base city' : 'Route order'}</h3>

          {mode === 'single' ? (
            baseCity ? (
              <div className="feature-card">
                <span className="feature-kicker">
                  {String(baseCity.plateNumber).padStart(2, '0')}
                  {' · '}
                  base camp
                </span>
                <strong>{baseCity.name}</strong>
                <span>
                  {formatNumber(getPopulation(baseCity))}
                  {' '}
                  residents
                </span>
              </div>
            ) : (
              <div className="empty">No base city yet. Click any province to choose one.</div>
            )
          ) : stopIds.length ? (
            <ol className="route-list">
              {selectedCityObjects.map((city, index) => (
                <li key={city.id} className="route-item">
                  <span className="route-index">{index + 1}</span>
                  <span className="route-copy">
                    <strong>{city.name}</strong>
                    <span>
                      {String(city.plateNumber).padStart(2, '0')}
                      {' · '}
                      {formatNumber(getPopulation(city))}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
          ) : (
            <div className="empty">The itinerary is empty. Click a province to add the first stop.</div>
          )}

          {mode === 'multiple' && (
            <div className="meter-block">
              <div className="meter-head">
                <span>Selection cap</span>
                <strong>
                  {stopIds.length}
                  {' '}
                  / 
                  {MAX_STOPS}
                </strong>
              </div>
              <div className="meter">
                <span style={{ width: `${(stopIds.length / MAX_STOPS) * 100}%` }} />
              </div>
              <p className="meta subtle-text">
                `maxSelection` rejects a sixth stop and calls `onMaxSelectionReached` instead.
              </p>
            </div>
          )}

          <p className="meta">
            Population covered:
            {' '}
            <strong>{formatNumber(totalPopulation)}</strong>
          </p>
        </div>

        <div className="panel">
          <p className="label">Callback feed</p>
          <h4>{lastEvent ? lastEvent.callback : 'Waiting for an interaction'}</h4>
          <p className="meta">{lastEvent ? lastEvent.detail : 'Click, toggle or press Escape to see the event.'}</p>
          <ul className="hint-list">
            <li>`onSelect` fires only when a city enters the selection.</li>
            <li>`onSelectionChange` always receives the full `CityType[]`.</li>
            <li>Controlled values win: the map never owns this trip state.</li>
          </ul>
        </div>

        <div className="panel">
          <p className="label">State shape</p>
          <pre className="code-block">
            {mode === 'single'
              ? `selectedCity = ${baseId ? `"${baseId}"` : 'null'}`
              : `selectedCities = ${JSON.stringify(stopIds)}`}
          </pre>
          <p className="meta subtle-text">
            Switch modes to compare single replacement with multi-select toggling.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default SelectionScenario;
