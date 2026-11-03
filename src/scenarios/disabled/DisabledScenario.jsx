import React, { useMemo, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { cities } from 'turkey-map-react/data';
import { formatNumber, getPopulation } from '../../utils/cityMetrics';

const ROAD_CLOSURE_IDS = ['erzurum', 'kars', 'ardahan', 'agri'];
const DATA_FLAG_IDS = new Set(['bitlis', 'mus', 'hakkari']);
const STORM_PLATES = new Set([25, 36, 75, 76]);
const CITY_BY_ID = new Map(cities.map((city) => [city.id, city]));

const PLAIN_DATA = { cities };
const FLAGGED_DATA = {
  cities: cities.map((city) => (
    DATA_FLAG_IDS.has(city.id) ? { ...city, disabled: true } : city
  )),
};

function DisabledScenario() {
  const [roadList, setRoadList] = useState(true);
  const [stormPredicate, setStormPredicate] = useState(true);
  const [dataFlags, setDataFlags] = useState(true);
  const [route, setRoute] = useState(['istanbul']);
  const [dispatchCount, setDispatchCount] = useState(0);
  const [lastEvent, setLastEvent] = useState('No dispatch yet');

  const isStormDisabled = (city) => STORM_PLATES.has(Number(city.plateNumber));

  const disabledIds = useMemo(() => {
    const ids = new Set();
    if (roadList) {
      ROAD_CLOSURE_IDS.forEach((id) => ids.add(id));
    }
    if (dataFlags) {
      DATA_FLAG_IDS.forEach((id) => ids.add(id));
    }
    if (stormPredicate) {
      cities.forEach((city) => {
        if (STORM_PLATES.has(Number(city.plateNumber))) {
          ids.add(city.id);
        }
      });
    }
    return [...ids].sort((a, b) => (
      Number(CITY_BY_ID.get(a)?.plateNumber) - Number(CITY_BY_ID.get(b)?.plateNumber)
    ));
  }, [roadList, stormPredicate, dataFlags]);

  const openCount = cities.length - disabledIds.length;
  const openPopulation = cities
    .filter((city) => !disabledIds.includes(city.id))
    .reduce((total, city) => total + (getPopulation(city) || 0), 0);

  const handleClick = (city) => {
    setDispatchCount((count) => count + 1);
    setLastEvent(`Dispatch accepted for ${city.name} (${city.plateNumber})`);
  };

  const handleSelectionChange = (nextCities) => {
    setRoute(nextCities.map((city) => city.id));
    setLastEvent(
      nextCities.length
        ? `Route updated: ${nextCities.map((city) => city.name).join(' → ')}`
        : 'Route cleared',
    );
  };

  const allClear = () => {
    setRoadList(false);
    setStormPredicate(false);
    setDataFlags(false);
    setDispatchCount(0);
    setLastEvent('All restrictions lifted. Every province is interactive again.');
  };

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Disabled cities · additive sources</p>
            <h3>Winter dispatch board</h3>
          </div>
          <div className="pill">
            {openCount}
            {' '}
            / 
            {cities.length}
            {' '}
            provinces reachable
          </div>
        </div>

        <div className="control-row is-wrapping">
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={roadList}
              onChange={(event) => setRoadList(event.target.checked)}
            />
            <span>Road closure list</span>
          </label>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={stormPredicate}
              onChange={(event) => setStormPredicate(event.target.checked)}
            />
            <span>Storm predicate</span>
          </label>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={dataFlags}
              onChange={(event) => setDataFlags(event.target.checked)}
            />
            <span>Per-city data flag</span>
          </label>
          <button type="button" className="pill pill-button" onClick={allClear}>
            Lift all restrictions
          </button>
        </div>

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">Dispatch status</span>
            <span className="legend-note">Grey provinces are inert but still discoverable</span>
          </div>
          <div className="legend-swatches is-three">
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#dbeafe' }} />
              <span className="legend-label">Open</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#bfdbfe' }} />
              <span className="legend-label">Hover</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ backgroundColor: '#cbd5e1' }} />
              <span className="legend-label">Disabled</span>
            </div>
          </div>
        </div>

        <div className="map-wrapper">
          <TurkeyMap
            id="disabled-lab"
            hoverable
            showTooltip
            disabledTooltipText="Road closed — no dispatches today"
            selectionMode="multiple"
            maxSelection={8}
            selectedCities={route}
            data={dataFlags ? FLAGGED_DATA : PLAIN_DATA}
            disabledCities={roadList ? ROAD_CLOSURE_IDS : undefined}
            isCityDisabled={stormPredicate ? isStormDisabled : undefined}
            onClick={handleClick}
            onSelectionChange={handleSelectionChange}
            onMaxSelectionReached={(city, currentSelection, limit) => {
              setLastEvent(
                `${city.name} was not added: the dispatch route is capped at ${limit} (${currentSelection.length} already scheduled).`,
              );
            }}
            customStyle={{
              idleColor: '#dbeafe',
              hoverColor: '#bfdbfe',
              selectedColor: '#0f766e',
              selectedStroke: '#134e4a',
              selectedStrokeWidth: 2,
              disabledColor: '#cbd5e1',
              focusStroke: '#0d9488',
            }}
          />
        </div>

        <div className="map-footer">
          <div className="pill subtle">
            Hover a grey province: the tooltip still explains why it is closed.
          </div>
          <div className="pill subtle">
            Click a grey province: no `onClick`, `onSelect`, or `onSelectionChange`.
          </div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Restriction sources</p>
          <h3>
            {disabledIds.length}
            {' '}
            provinces offline
          </h3>
          <ul className="source-list">
            <li className={roadList ? 'is-on' : ''}>
              <strong>`disabledCities`</strong>
              <span>{ROAD_CLOSURE_IDS.length} closed mountain passes</span>
            </li>
            <li className={stormPredicate ? 'is-on' : ''}>
              <strong>`isCityDisabled`</strong>
              <span>Predicate checks plate numbers {[...STORM_PLATES].join(', ')}</span>
            </li>
            <li className={dataFlags ? 'is-on' : ''}>
              <strong>`data[].disabled`</strong>
              <span>{DATA_FLAG_IDS.size} maintenance flags baked into data</span>
            </li>
          </ul>
          <p className="meta subtle-text">
            The sources are additive: a city is disabled if any source says so.
          </p>
        </div>

        <div className="panel">
          <p className="label">Offline provinces</p>
          {disabledIds.length ? (
            <ul className="closure-list">
              {disabledIds.map((id) => {
                const city = CITY_BY_ID.get(id);
                return (
                  <li key={id}>
                    <span className="closure-plate">
                      {String(city.plateNumber).padStart(2, '0')}
                    </span>
                    <span>{city.name}</span>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty">No restrictions. Every province can receive a dispatch.</div>
          )}
        </div>

        <div className="panel">
          <p className="label">Dispatch desk</p>
          <h4>
            {dispatchCount}
            {' '}
            accepted clicks
          </h4>
          <p className="meta">{lastEvent}</p>
          <p className="meta">
            Active route:
            {' '}
            <strong>
              {route.length
                ? route.map((id) => CITY_BY_ID.get(id)?.name).filter(Boolean).join(' → ')
                : 'empty'}
            </strong>
          </p>
          <p className="meta">
            Reachable population:
            {' '}
            <strong>{formatNumber(openPopulation)}</strong>
          </p>
          <p className="meta subtle-text">
            Disabled provinces keep `aria-disabled`, board the roving tab order, and show a focus ring.
          </p>
        </div>
      </aside>
    </div>
  );
}

export default DisabledScenario;
