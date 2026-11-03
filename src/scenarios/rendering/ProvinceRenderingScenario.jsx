import React, {
  useCallback, useEffect, useRef, useState,
} from 'react';
import TurkeyMap from 'turkey-map-react';

const PRESET = ['istanbul', 'ankara', 'izmir'];

function ProvinceRenderingScenario() {
  const countsRef = useRef({});
  const logSequence = useRef(0);
  const refreshTimer = useRef(undefined);
  const [snapshot, setSnapshot] = useState({});
  const [selected, setSelected] = useState(PRESET);
  const [mode, setMode] = useState('multiple');
  const [showTooltip, setShowTooltip] = useState(false);
  const [hovered, setHovered] = useState(null);
  const [churn, setChurn] = useState(0);
  const [log, setLog] = useState([]);

  // getCityStyle runs inside each province's render, so it is a reliable
  // "this province actually re-rendered" probe. Keeping the callback identity
  // stable also proves that parent re-renders do not invalidate the provinces.
  const countCityRender = useCallback((city) => {
    countsRef.current[city.id] = (countsRef.current[city.id] || 0) + 1;
    return undefined;
  }, []);

  const pushLog = (text) => {
    logSequence.current += 1;
    const entry = { id: logSequence.current, text };
    setLog((entries) => [entry, ...entries].slice(0, 6));
  };

  useEffect(() => {
    setSnapshot({ ...countsRef.current });
  }, [selected, mode, showTooltip, churn, log]);

  useEffect(() => () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
  }, []);

  const refreshSnapshot = () => {
    if (refreshTimer.current) clearTimeout(refreshTimer.current);
    refreshTimer.current = setTimeout(() => {
      refreshTimer.current = undefined;
      setSnapshot({ ...countsRef.current });
    }, 0);
  };

  const rows = Object.entries(snapshot)
    .sort((left, right) => right[1] - left[1]);
  const maxCount = rows[0]?.[1] || 1;
  const totalRenders = rows.reduce((total, [, count]) => total + count, 0);

  const handleHover = (city) => {
    setHovered(city ? city.name : null);
    pushLog(city ? `Hover entered ${city.name}` : 'Hover left');
  };

  const handleSelectionChange = (cities) => {
    setSelected(cities.map((city) => city.id));
    pushLog(
      cities.length
        ? `Selection → ${cities.map((city) => city.name).join(', ')}`
        : 'Selection cleared',
    );
  };

  const handleClick = (city) => {
    pushLog(`onClick → ${city.name}`);
  };

  const handleSelect = (city) => {
    pushLog(`onSelect → ${city.name}`);
  };

  const resetCounters = () => {
    countsRef.current = {};
    setSnapshot({});
    pushLog('Render counters reset');
  };

  const bumpParent = () => {
    setChurn((value) => value + 1);
    pushLog('Parent re-rendered with fresh callbacks');
  };

  const resetSelection = () => {
    setMode('multiple');
    setSelected(PRESET);
    pushLog('Selection preset restored');
  };

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Province rendering · isolation lab</p>
            <h3>Render radar</h3>
          </div>
          <div className="pill">
            {totalRenders}
            {' '}
            captured renders
          </div>
        </div>

        <div className="control-row is-wrapping">
          <div className="segmented" role="group" aria-label="Selection mode">
            <button
              type="button"
              className={`segmented-button ${mode === 'multiple' ? 'active' : ''}`}
              aria-pressed={mode === 'multiple'}
              onClick={() => {
                setMode('multiple');
                pushLog('Switched to multiple mode');
              }}
            >
              multiple
            </button>
            <button
              type="button"
              className={`segmented-button ${mode === 'single' ? 'active' : ''}`}
              aria-pressed={mode === 'single'}
              onClick={() => {
                setMode('single');
                setSelected(PRESET.slice(0, 1));
                pushLog('Switched to single mode');
              }}
            >
              single
            </button>
          </div>
          <label className="toggle-chip">
            <input
              type="checkbox"
              checked={showTooltip}
              onChange={(event) => {
                setShowTooltip(event.target.checked);
                pushLog(event.target.checked ? 'Tooltip enabled' : 'Tooltip disabled');
              }}
            />
            <span>`showTooltip`</span>
          </label>
          <button type="button" className="pill pill-button" onClick={bumpParent}>
            Re-render parent
          </button>
          <button type="button" className="pill pill-button" onClick={resetCounters}>
            Reset counters
          </button>
          <button type="button" className="pill pill-button" onClick={resetSelection}>
            Restore preset
          </button>
        </div>

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">
              Hovered:
              {' '}
              {hovered || 'nothing yet'}
            </span>
            <span className="legend-note">
              Parent churn: {churn}
              {' '}
              · callbacks are replaced on every render
            </span>
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

        <div
          className="map-wrapper"
          onMouseOver={refreshSnapshot}
          onMouseOut={refreshSnapshot}
          onFocus={refreshSnapshot}
          onBlur={refreshSnapshot}
        >
          <TurkeyMap
            id="render-radar"
            hoverable
            showTooltip={showTooltip}
            selectionMode={mode}
            selectedCities={mode === 'multiple' ? selected : undefined}
            selectedCity={mode === 'single' ? (selected[0] || null) : undefined}
            onHover={handleHover}
            onClick={handleClick}
            onSelect={handleSelect}
            onSelectionChange={handleSelectionChange}
            getCityStyle={countCityRender}
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
          <div className="pill subtle">Hover one province: only its counter should grow.</div>
          <div className="pill subtle">Re-render the parent: counters should stay flat.</div>
          <div className="pill subtle">Toggle the tooltip: counters should stay flat.</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Render counters</p>
          <h3>Top provinces by renders</h3>
          {rows.length ? (
            <ul className="render-list">
              {rows.slice(0, 8).map(([id, count]) => (
                <li key={id} className="render-row">
                  <span className="render-name">{id}</span>
                  <span className="render-bar">
                    <span style={{ width: `${(count / maxCount) * 100}%` }} />
                  </span>
                  <strong>{count}</strong>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty">Counters are empty. Reset and interact with the map.</div>
          )}
          <p className="meta subtle-text">
            Counters increment from `getCityStyle`, which only runs when a province actually renders. React
            StrictMode can double initial counts in development, so watch the deltas.
          </p>
        </div>

        <div className="panel">
          <p className="label">Event log</p>
          <ul className="event-log">
            {log.length ? log.map((entry) => (
              <li key={entry.id}>{entry.text}</li>
            )) : (
              <li className="subtle-text">Interact with the map to populate the log.</li>
            )}
          </ul>
        </div>

        <div className="panel">
          <p className="label">What is isolated</p>
          <ul className="hint-list">
            <li>Hover updates only the province whose hover state changed.</li>
            <li>Selection re-renders only ids that entered or left the selection.</li>
            <li>Focus styling is local to the focused province.</li>
            <li>Callback replacement does not invalidate province rendering.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default ProvinceRenderingScenario;
