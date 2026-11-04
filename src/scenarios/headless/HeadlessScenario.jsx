import React, {
  useEffect, useRef, useState,
} from 'react';
import { useTurkeyMap } from 'turkey-map-react';
import { cities } from 'turkey-map-react/data';

const DISABLED_IDS = ['hakkari', 'sirnak'];
const MAX_SELECTION = 6;
const INITIAL_SELECTION = ['istanbul', 'ankara', 'izmir'];

const DESK_BY_ID = {
  istanbul: 'Bosphorus desk',
  ankara: 'Capital desk',
  izmir: 'Aegean desk',
  trabzon: 'Black Sea desk',
  gaziantep: 'Silk Road desk',
  van: 'Van basin desk',
  antalya: 'Turquoise coast desk',
  bursa: 'Marmara desk',
};

const HEADLESS_DATA = {
  cities: cities.map((city) => ({
    ...city,
    meta: {
      desk: DESK_BY_ID[city.id] || 'Open province desk',
    },
  })),
};

function HeadlessScenario() {
  const [renderer, setRenderer] = useState('svg');
  const [selectedIds, setSelectedIds] = useState(INITIAL_SELECTION);
  const [notice, setNotice] = useState('');
  const containerRef = useRef(null);
  const focusIdRef = useRef(INITIAL_SELECTION[0]);
  const mountedRef = useRef(false);

  const {
    selectedCities,
    selectedIds: effectiveIds,
    tooltipCity,
    announcement,
    isCityDisabled,
    changeSelection,
    getContainerProps,
    getCityProps,
    getTooltipProps,
  } = useTurkeyMap({
    data: HEADLESS_DATA,
    selectionMode: 'multiple',
    selectedCities: selectedIds,
    maxSelection: MAX_SELECTION,
    onSelectionChange: (nextCities) => {
      setSelectedIds(nextCities.map((city) => city.id));
      setNotice('');
    },
    onMaxSelectionReached: (city, currentSelection, limit) => {
      setNotice(`${city.name} was rejected: ${currentSelection.length}/${limit} seats are already filled.`);
    },
    disabledCities: DISABLED_IDS,
    showTooltip: true,
    tooltipPosition: 'city',
    tooltipPortal: true,
    tooltipOffset: 14,
    ariaLabel: 'Headless province board',
  });

  focusIdRef.current = effectiveIds[0] || HEADLESS_DATA.cities[0].id;

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }

    const next = containerRef.current?.querySelector(
      `[data-tm-city-id="${focusIdRef.current}"]`,
    );
    next?.focus();
  }, [renderer]);

  const handleNativeChange = (event) => {
    const nextIds = Array.from(event.currentTarget.selectedOptions, (option) => option.value);
    changeSelection(nextIds);
    setNotice('');
  };

  const selected = new Set(effectiveIds);

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Headless hook · consumer-owned markup</p>
            <h3>The map engine without the map component</h3>
          </div>
          <div className="pill">
            {effectiveIds.length}
            {' / '}
            {MAX_SELECTION}
            {' '}
            seats
          </div>
        </div>

        <div className="control-row is-wrapping">
          <div className="segmented" role="group" aria-label="Headless renderer">
            <button
              type="button"
              className={`segmented-button ${renderer === 'svg' ? 'active' : ''}`}
              aria-pressed={renderer === 'svg'}
              onClick={() => setRenderer('svg')}
            >
              custom SVG
            </button>
            <button
              type="button"
              className={`segmented-button ${renderer === 'list' ? 'active' : ''}`}
              aria-pressed={renderer === 'list'}
              onClick={() => setRenderer('list')}
            >
              HTML list
            </button>
          </div>
          <div className="pill subtle">
            No &lt;TurkeyMap /&gt; is mounted in this scenario
          </div>
        </div>

        {notice && (
          <div className="warning-banner" role="status">
            {notice}
          </div>
        )}

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">One hook, two renderers</span>
            <span className="legend-note">
              Tab once, then use arrows, Home, End, Enter, Space or Escape
            </span>
          </div>
          <ul className="hint-list">
            <li>Switch renderers without losing the controlled selection.</li>
            <li>The live region below mirrors focus and selection announcements.</li>
            <li>Hakkâri and Şırnak are disabled and refuse activation.</li>
          </ul>
        </div>

        <div className="map-wrapper headless-frame">
          {renderer === 'svg' ? (
            <svg
              {...getContainerProps()}
              ref={containerRef}
              className="headless-svg"
              viewBox="0 80 1050 585"
            >
              {HEADLESS_DATA.cities.map((city) => (
                <path
                  key={city.id}
                  {...getCityProps(city)}
                  d={city.path}
                  className={`headless-path ${selected.has(city.id) ? 'is-selected' : ''}`}
                />
              ))}
            </svg>
          ) : (
            <div
              {...getContainerProps()}
              ref={containerRef}
              className="headless-list"
            >
              {HEADLESS_DATA.cities.map((city) => (
                <button
                  key={city.id}
                  type="button"
                  {...getCityProps(city)}
                  className={`headless-row ${selected.has(city.id) ? 'is-selected' : ''}`}
                >
                  <span className="headless-plate">
                    {String(city.plateNumber).padStart(2, '0')}
                  </span>
                  <span className="headless-row-copy">
                    <strong>{city.name}</strong>
                    <small>{city.meta.desk}</small>
                  </span>
                  <span className="headless-state">
                    {selected.has(city.id) ? 'selected' : 'available'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {tooltipCity && (
          <div {...getTooltipProps()} className="headless-tooltip">
            <strong>{tooltipCity.name}</strong>
            <span>{tooltipCity.meta.desk}</span>
            <small>{String(tooltipCity.plateNumber).padStart(2, '0')} · headless tooltip</small>
          </div>
        )}

        <div
          className="visually-hidden"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          {announcement}
        </div>

        <div className="map-footer">
          <div className="pill subtle">{renderer === 'svg' ? 'SVG paths' : 'HTML buttons'}</div>
          <div className="pill subtle">`getCityProps` owns role, tab index and ARIA state</div>
          <div className="pill subtle">`getTooltipProps` owns positioning and pointer-events</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Selected provinces</p>
          <h3>
            {selectedCities.length}
            {' '}
            of
            {' '}
            {MAX_SELECTION}
            {' '}
            seats filled
          </h3>
          {selectedCities.length ? (
            <ul className="selection-list">
              {selectedCities.map((city) => (
                <li key={city.id} className="selection-item">
                  <span>
                    <span className="selection-name">{city.name}</span>
                    <span className="selection-meta">{city.meta.desk}</span>
                  </span>
                  <span className="selection-population">
                    {String(city.plateNumber).padStart(2, '0')}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">No seats filled. Activate a province to add one.</div>
          )}
          <p className="meta subtle-text">
            These are full city objects with `meta.desk`, returned by the hook — no lookup table.
          </p>
        </div>

        <div className="panel">
          <p className="label">Live region</p>
          <div className="a11y-mirror" aria-hidden="true">
            {announcement || 'Announcements will appear here.'}
          </div>
          <p className="meta subtle-text">
            Render the hook&apos;s `announcement` in your own polite status region.
          </p>
        </div>

        <div className="panel">
          <p className="label">Native select fallback</p>
          <label className="field" htmlFor="headless-fallback">
            <span>
              `changeSelection`
              <strong>{effectiveIds.length} selected</strong>
            </span>
            <select
              id="headless-fallback"
              multiple
              size={8}
              value={effectiveIds}
              onChange={handleNativeChange}
            >
              {HEADLESS_DATA.cities.map((city) => (
                <option
                  key={city.id}
                  value={city.id}
                  disabled={isCityDisabled(city)}
                >
                  {city.name}
                </option>
              ))}
            </select>
          </label>
          <p className="meta subtle-text">
            The select applies the same normalization, cap, callbacks and announcement as a tap.
          </p>
        </div>

        <div className="panel">
          <p className="label">Hook options</p>
          <pre className="code-block">
            {`const {
  selectedCities,
  announcement,
  getContainerProps,
  getCityProps,
  getTooltipProps,
  changeSelection,
} = useTurkeyMap({
  data,
  selectionMode: 'multiple',
  selectedCities,
  maxSelection: ${MAX_SELECTION},
  showTooltip: true,
  tooltipPosition: 'city',
});`}
          </pre>
        </div>
      </aside>
    </div>
  );
}

export default HeadlessScenario;
