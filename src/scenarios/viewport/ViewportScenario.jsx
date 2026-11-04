import React, { useRef, useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { cities } from 'turkey-map-react/data';
import { getPopulation, formatNumber } from '../../utils/cityMetrics';

const RESET_VIEWPORT = { scale: 1, translateX: 0, translateY: 0 };

const PRESETS = [
  { id: 'istanbul', label: 'İstanbul', zoom: 4 },
  { id: 'ankara', label: 'Ankara', zoom: 4 },
  { id: 'izmir', label: 'İzmir', zoom: 5 },
  { id: 'van', label: 'Van', zoom: 3.5 },
];

const cityById = new Map(cities.map((city) => [city.id, city]));

const formatViewport = (viewport) => ({
  scale: viewport.scale.toFixed(2),
  translateX: viewport.translateX.toFixed(1),
  translateY: viewport.translateY.toFixed(1),
});

function ViewportScenario() {
  const mapRef = useRef(null);
  const [mode, setMode] = useState('uncontrolled');
  const [reported, setReported] = useState(RESET_VIEWPORT);
  const [controlled, setControlled] = useState(RESET_VIEWPORT);
  const [selectedId, setSelectedId] = useState('istanbul');
  const [lastAction, setLastAction] = useState('Map mounted at 1×, centred');

  const selectedCity = selectedId ? cityById.get(selectedId) : null;
  const readout = formatViewport(reported);

  const handleViewportChange = (next) => {
    setReported(next);
    setLastAction('onViewportChange reported a new viewport');
    if (mode === 'controlled') {
      setControlled(next);
    }
  };

  const switchMode = (nextMode) => {
    if (nextMode === mode) return;

    if (nextMode === 'controlled') {
      setControlled(reported);
      setLastAction('Switched to controlled mode with the current viewport');
    } else {
      mapRef.current?.resetView();
      setLastAction('Switched to uncontrolled mode and reset the internal viewport');
    }

    setMode(nextMode);
  };

  const focusPreset = (preset) => {
    mapRef.current?.focusCity(preset.id, preset.zoom);
    setLastAction(`focusCity("${preset.id}", ${preset.zoom})`);
  };

  const zoomTo = (scale) => {
    mapRef.current?.zoomTo(scale);
    setLastAction(`zoomTo(${scale})`);
  };

  const resetView = () => {
    mapRef.current?.resetView();
    setLastAction('resetView()');
  };

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Viewport lab · gestures + controlled state</p>
            <h3>Zoom, pan and fly to a province</h3>
          </div>
          <div className="pill">
            {mode}
            {' · '}
            {readout.scale}
            ×
          </div>
        </div>

        <div className="control-row is-wrapping">
          <div className="segmented" role="group" aria-label="Viewport mode">
            <button
              type="button"
              className={`segmented-button ${mode === 'uncontrolled' ? 'active' : ''}`}
              aria-pressed={mode === 'uncontrolled'}
              onClick={() => switchMode('uncontrolled')}
            >
              uncontrolled
            </button>
            <button
              type="button"
              className={`segmented-button ${mode === 'controlled' ? 'active' : ''}`}
              aria-pressed={mode === 'controlled'}
              onClick={() => switchMode('controlled')}
            >
              controlled
            </button>
          </div>
          <button type="button" className="pill pill-button" onClick={() => zoomTo(3)}>
            `zoomTo(3)`
          </button>
          <button type="button" className="pill pill-button" onClick={resetView}>
            `resetView()`
          </button>
          <div className="pill subtle">{lastAction}</div>
        </div>

        <div className="legend viewport-legend">
          <div className="legend-header">
            <span className="legend-title">Viewport readout</span>
            <span className="legend-note">
              {mode === 'controlled'
                ? 'Gestures report; the parent applies the next value'
                : 'The map owns its internal viewport'}
            </span>
          </div>
          <div className="viewport-readout">
            <span>
              <small>scale</small>
              <strong data-testid="viewport-scale">{readout.scale}</strong>
            </span>
            <span><small>translateX</small><strong>{readout.translateX}</strong></span>
            <span><small>translateY</small><strong>{readout.translateY}</strong></span>
          </div>
          <div className="viewport-presets">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                className="pill pill-button"
                onClick={() => focusPreset(preset)}
              >
                focusCity
                {' · '}
                {preset.label}
                {' '}
                @
                {preset.zoom}
                ×
              </button>
            ))}
          </div>
        </div>

        <div className="map-wrapper">
          <TurkeyMap
            ref={mapRef}
            id="viewport-atlas"
            hoverable
            showTooltip
            zoomable
            zoomControls
            minZoom={1}
            maxZoom={8}
            viewport={mode === 'controlled' ? controlled : undefined}
            onViewportChange={handleViewportChange}
            selectionMode="single"
            selectedCity={selectedId}
            onSelectionChange={(next) => setSelectedId(next[0]?.id || null)}
            ariaLabel="Zoom and pan playground"
            customStyle={{
              idleColor: '#dbeafe',
              hoverColor: '#93c5fd',
              selectedColor: '#1d4ed8',
              selectedStroke: '#1e3a8a',
              selectedStrokeWidth: 2,
              focusStroke: '#2563eb',
            }}
          />
        </div>

        <div className="map-footer">
          <div className="pill subtle">Wheel or double-click to zoom around the pointer</div>
          <div className="pill subtle">Drag to pan · taps still select</div>
          <div className="pill subtle">Keyboard shortcuts work when the SVG has focus</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Pinned province</p>
          {selectedCity ? (
            <>
              <h3>{selectedCity.name}</h3>
              <p className="meta">
                Plate
                {' '}
                <strong>{String(selectedCity.plateNumber).padStart(2, '0')}</strong>
                {' · '}
                {formatNumber(getPopulation(selectedCity))}
                {' '}
                residents
              </p>
              <p className="meta subtle-text">
                Selection does not move the viewport. Use a preset or `focusCity` to fly there.
              </p>
            </>
          ) : (
            <div className="empty">Select a province to pin it here.</div>
          )}
        </div>

        <div className="panel">
          <p className="label">Keyboard while the SVG is focused</p>
          <div className="keyboard-grid">
            <span><kbd>+</kbd> / <kbd>=</kbd> zoom in</span>
            <span><kbd>-</kbd> zoom out</span>
            <span><kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> pan</span>
            <span><kbd>0</kbd> reset view</span>
            <span><kbd>Tab</kbd> enters the SVG once</span>
            <span>Province navigation is unchanged</span>
          </div>
        </div>

        <div className="panel">
          <p className="label">What controlled mode does</p>
          <ul className="hint-list">
            <li>Gestures and ref calls still emit `onViewportChange`.</li>
            <li>The map renders only the `viewport` value the parent supplies.</li>
            <li>Switch back to uncontrolled to let the map own the transform.</li>
          </ul>
          <pre className="code-block">
            {`const [viewport, setViewport] = useState(${JSON.stringify(RESET_VIEWPORT)});

<TurkeyMap
  ref={mapRef}
  zoomable
  viewport={viewport}
  onViewportChange={setViewport}
/>`}
          </pre>
        </div>
      </aside>
    </div>
  );
}

export default ViewportScenario;
