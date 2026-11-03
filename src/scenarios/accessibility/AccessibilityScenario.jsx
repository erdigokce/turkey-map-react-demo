import React, { useEffect, useRef, useState } from 'react';
import TurkeyMap from 'turkey-map-react';

const MODES = [
  { id: 'none', label: 'none · group' },
  { id: 'single', label: 'single · listbox' },
  { id: 'multiple', label: 'multiple · multiselect' },
];

const LABELS = [
  { value: 'Turkey map', label: 'English default' },
  { value: 'Türkiye haritası', label: 'Turkish' },
  { value: 'Carte des provinces', label: 'French' },
];

const DISABLED_IDS = ['hakkari', 'sirnak', 'tunceli'];

function AccessibilityScenario() {
  const mapRef = useRef(null);
  const [mode, setMode] = useState('multiple');
  const [label, setLabel] = useState('Türkiye haritası');
  const [fallback, setFallback] = useState(true);
  const [showDisabled, setShowDisabled] = useState(true);
  const [focusColor, setFocusColor] = useState('#1a73e8');
  const [selectedCity, setSelectedCity] = useState('ankara');
  const [selectedCities, setSelectedCities] = useState(['ankara', 'izmir']);
  const [announcement, setAnnouncement] = useState('');
  const [lastEvent, setLastEvent] = useState('');

  useEffect(() => {
    const container = mapRef.current;
    if (!container) return undefined;

    const liveRegion = container.querySelector('[role="status"][aria-live="polite"]');
    if (!liveRegion) return undefined;

    const update = () => setAnnouncement(liveRegion.textContent || '');
    update();

    const observer = new MutationObserver(update);
    observer.observe(liveRegion, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [mode, fallback, showDisabled, label, focusColor]);

  const handleSelectionChange = (nextCities) => {
    if (mode === 'single') {
      setSelectedCity(nextCities[0]?.id || null);
    } else if (mode === 'multiple') {
      setSelectedCities(nextCities.map((city) => city.id));
    }
    setLastEvent(
      nextCities.length
        ? `${nextCities.length} selected: ${nextCities.map((city) => city.name).join(', ')}`
        : 'Selection cleared',
    );
  };

  const handleMaxSelection = (city, currentSelection, limit) => {
    setLastEvent(
      `${city.name} was rejected at the ${limit}-city cap (${currentSelection.length} already selected)`,
    );
  };

  let selectedCount = 0;
  if (mode === 'single') {
    selectedCount = selectedCity ? 1 : 0;
  } else if (mode === 'multiple') {
    selectedCount = selectedCities.length;
  }

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Accessibility lab · keyboard + screen reader</p>
            <h3>A map you can drive with a keyboard</h3>
          </div>
          <div className="pill">
            {mode === 'none' ? 'role="group"' : 'role="listbox"'}
            {' · '}
            {fallback && mode !== 'none' ? 'native select on' : 'native select off'}
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
                onClick={() => setMode(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
          <label className="field is-inline" htmlFor="a11y-label">
            <span>Accessible name</span>
            <select
              id="a11y-label"
              value={label}
              onChange={(event) => setLabel(event.target.value)}
            >
              {LABELS.map((item) => (
                <option key={item.value} value={item.value}>{item.label}</option>
              ))}
            </select>
          </label>
          <label className="switch-row is-inline">
            <input
              type="checkbox"
              checked={fallback}
              disabled={mode === 'none'}
              onChange={(event) => setFallback(event.target.checked)}
            />
            <span>`a11yFallback`</span>
          </label>
          <label className="switch-row is-inline">
            <input
              type="checkbox"
              checked={showDisabled}
              onChange={(event) => setShowDisabled(event.target.checked)}
            />
            <span>Disabled provinces</span>
          </label>
          <label className="field is-inline" htmlFor="focus-color">
            <span>Focus ring</span>
            <input
              id="focus-color"
              type="color"
              value={focusColor}
              onChange={(event) => setFocusColor(event.target.value)}
            />
          </label>
        </div>

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">Keyboard model</span>
            <span className="legend-note">One roving tab stop · no wrapping</span>
          </div>
          <div className="keyboard-grid">
            <span><kbd>Tab</kbd> enter the map once</span>
            <span><kbd>→</kbd> <kbd>↓</kbd> next province</span>
            <span><kbd>←</kbd> <kbd>↑</kbd> previous province</span>
            <span><kbd>Home</kbd> first · <kbd>End</kbd> last</span>
            <span><kbd>Enter</kbd> / <kbd>Space</kbd> activate</span>
            <span><kbd>Esc</kbd> clear selection</span>
          </div>
        </div>

        <div ref={mapRef} className="map-wrapper">
          <TurkeyMap
            id="a11y-lab"
            hoverable
            showTooltip
            ariaLabel={label}
            selectionMode={mode}
            selectedCity={mode === 'single' ? selectedCity : undefined}
            selectedCities={mode === 'multiple' ? selectedCities : undefined}
            maxSelection={mode === 'multiple' ? 4 : undefined}
            onMaxSelectionReached={mode === 'multiple' ? handleMaxSelection : undefined}
            a11yFallback={mode !== 'none' && fallback}
            disabledCities={showDisabled ? DISABLED_IDS : undefined}
            disabledTooltipText="Unavailable in this demo"
            onSelectionChange={handleSelectionChange}
            style={{ '--tm-focus-ring': focusColor }}
            customStyle={{
              idleColor: '#e2e8f0',
              hoverColor: '#cbd5e1',
              selectedColor: '#7c3aed',
              selectedStroke: '#4c1d95',
              selectedStrokeWidth: 2,
              disabledColor: '#cbd5e1',
            }}
          />
        </div>

        <div className="map-footer">
          <div className="pill subtle">
            {mode === 'none' ? 'Selection inactive' : `${selectedCount} selected`}
          </div>
          <div className="pill subtle">
            The focus ring uses `--tm-focus-ring`
          </div>
          <div className="pill subtle">
            Disabled provinces stay focusable and announce their state
          </div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Screen reader mirror</p>
          <h4>Live region output</h4>
          <blockquote className="a11y-mirror" aria-live="off">
            {announcement || 'Focus or select a province to hear the announcement.'}
          </blockquote>
          <p className="meta subtle-text">
            This mirrors the map&apos;s polite live region so sighted developers can verify what is announced.
          </p>
        </div>

        <div className="panel">
          <p className="label">Semantics</p>
          <table className="a11y-table">
            <tbody>
              <tr>
                <th scope="row">Container</th>
                <td>{mode === 'none' ? 'group' : 'listbox'}</td>
              </tr>
              <tr>
                <th scope="row">Multi-select</th>
                <td>{mode === 'multiple' ? 'true' : 'not set'}</td>
              </tr>
              <tr>
                <th scope="row">Accessible name</th>
                <td>{label}</td>
              </tr>
              <tr>
                <th scope="row">Province role</th>
                <td>{mode === 'none' ? 'button' : 'option'}</td>
              </tr>
              <tr>
                <th scope="row">Native fallback</th>
                <td>{fallback && mode !== 'none' ? 'rendered (visually hidden)' : 'off'}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="panel">
          <p className="label">Last change</p>
          <h4>{lastEvent || 'No selection change yet'}</h4>
          <ul className="hint-list">
            <li>Try switching to `none`: Enter fires `onClick`, never a selection.</li>
            <li>Try `single` with the fallback select: the same callbacks fire.</li>
            <li>Disabled provinces are included in arrow-key navigation.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}

export default AccessibilityScenario;
