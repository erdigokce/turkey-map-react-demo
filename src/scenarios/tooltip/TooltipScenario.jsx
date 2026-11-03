import React, { useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import { formatNumber, getPopulationRecord } from '../../utils/cityMetrics';

const RARITY_LABELS = ['Common', 'Regional', 'Coastal', 'Metropolitan', 'Legendary'];

const getRarity = (city) => RARITY_LABELS[Number(city.plateNumber) % RARITY_LABELS.length];

const renderTradingCard = (city) => {
  const record = getPopulationRecord(city);

  return (
    <span className="tooltip-card">
      <span className="tooltip-card-top">
        <span className="tooltip-plate">{String(city.plateNumber).padStart(2, '0')}</span>
        <span className="tooltip-rarity">{getRarity(city)}</span>
      </span>
      <strong className="tooltip-card-name">{city.name}</strong>
      <span className="tooltip-card-meta">
        {formatNumber(record?.population)}
        {' '}
        residents
      </span>
      <span className="tooltip-card-hint">Custom `renderTooltip` card</span>
    </span>
  );
};

function TooltipScenario() {
  const [position, setPosition] = useState('cursor');
  const [offset, setOffset] = useState(16);
  const [delay, setDelay] = useState(80);
  const [portal, setPortal] = useState(true);
  const [rich, setRich] = useState(true);

  return (
    <div className="map-grid">
      <div className="map-card">
        <div className="map-header">
          <div>
            <p className="label">Tooltip studio · pointer + keyboard</p>
            <h3>Province trading cards</h3>
          </div>
          <div className="pill">
            {portal ? 'Portal: body' : 'Portal: inline'}
            {' · '}
            {position === 'city' ? 'City anchor' : 'Cursor anchor'}
          </div>
        </div>

        <div className="legend">
          <div className="legend-header">
            <span className="legend-title">Try it</span>
            <span className="legend-note">Hover, focus with Tab, or use touch</span>
          </div>
          <ul className="hint-list">
            <li>Switch to city anchoring to pin the card above the province.</li>
            <li>Turn the portal off and hover a province near the top edge to see clipping.</li>
            <li>Tab into the map: keyboard focus reveals the tooltip without the hover delay.</li>
            <li>Move between adjacent provinces: the card updates immediately without flicker.</li>
          </ul>
        </div>

        <div className="map-wrapper tooltip-clip-frame">
          <TurkeyMap
            id="tooltip-lab"
            hoverable
            showTooltip
            selectionMode="single"
            defaultSelectedCity="ankara"
            ariaLabel="Tooltip playground map"
            tooltipPosition={position}
            tooltipOffset={offset}
            tooltipDelay={delay}
            tooltipPortal={portal}
            renderTooltip={rich ? renderTradingCard : undefined}
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
          <div className="pill subtle">
            {rich
              ? 'Rich tooltip: custom React content'
              : 'Built-in text tooltip: province name'}
          </div>
          <div className="pill subtle">The tooltip never steals pointer events</div>
        </div>
      </div>

      <aside className="side-panel">
        <div className="panel">
          <p className="label">Tooltip controls</p>
          <h4>Live prop playground</h4>

          <fieldset className="control-fieldset">
            <legend>Anchor</legend>
            <label className="switch-row">
              <input
                type="radio"
                name="tooltip-position"
                value="cursor"
                checked={position === 'cursor'}
                onChange={() => setPosition('cursor')}
              />
              <span>
                Cursor
                <small>Follows the pointer; offset shifts right and up.</small>
              </span>
            </label>
            <label className="switch-row">
              <input
                type="radio"
                name="tooltip-position"
                value="city"
                checked={position === 'city'}
                onChange={() => setPosition('city')}
              />
              <span>
                City
                <small>Centered above the province bounds.</small>
              </span>
            </label>
          </fieldset>

          <label className="field" htmlFor="tooltip-offset">
            <span>
              `tooltipOffset`
              <strong>{offset}px</strong>
            </span>
            <input
              id="tooltip-offset"
              type="range"
              min="0"
              max="48"
              step="4"
              value={offset}
              onChange={(event) => setOffset(Number(event.target.value))}
            />
          </label>

          <label className="field" htmlFor="tooltip-delay">
            <span>
              `tooltipDelay`
              <strong>{delay}ms</strong>
            </span>
            <input
              id="tooltip-delay"
              type="range"
              min="0"
              max="400"
              step="20"
              value={delay}
              onChange={(event) => setDelay(Number(event.target.value))}
            />
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={portal}
              onChange={(event) => setPortal(event.target.checked)}
            />
            <span>
              `tooltipPortal`
              <small>Escape the map card&apos;s `overflow: hidden`.</small>
            </span>
          </label>

          <label className="switch-row">
            <input
              type="checkbox"
              checked={rich}
              onChange={(event) => setRich(event.target.checked)}
            />
            <span>
              `renderTooltip`
              <small>Swap the built-in name text for a card.</small>
            </span>
          </label>
        </div>

        <div className="panel">
          <p className="label">Why it feels native</p>
          <ul className="hint-list">
            <li>Pointer Events drive touch and pen input with the same lifecycle.</li>
            <li>`tooltipDelay` is a hover intent window, not a debounce.</li>
            <li>Reduced-motion users get an instant hide with no fade.</li>
            <li>`role="tooltip"` and `aria-hidden` track visibility.</li>
          </ul>
        </div>

        <div className="panel">
          <p className="label">Current props</p>
          <pre className="code-block">
            {`<TurkeyMap
  showTooltip
  tooltipPosition="${position}"
  tooltipOffset={${offset}}
  tooltipDelay={${delay}}
  tooltipPortal={${portal}}
  ${rich ? 'renderTooltip={renderTradingCard}' : 'renderTooltip={undefined}'}
/>`}
          </pre>
        </div>
      </aside>
    </div>
  );
}

export default TooltipScenario;
