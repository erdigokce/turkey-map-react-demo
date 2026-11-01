import React from 'react';
import { version as turkeyMapVersion } from 'turkey-map-react/package.json';

function ScenarioPage({
  scenario, scenarios, onScenarioChange, children,
}) {
  return (
    <div className="page">
      <div className="hero">
        <div>
          <p className="eyebrow">{scenario.eyebrow}</p>
          <h1>{scenario.title}</h1>
          <p className="lede">{scenario.description}</p>
          <div className="hero-meta">
            <div className="source-chip">{scenario.source}</div>
            <div className="version-chip" data-testid="turkey-map-version">
              turkey-map-react v
              {turkeyMapVersion}
            </div>
          </div>
        </div>
        <div className="tabs" role="group" aria-label="Demo scenarios">
          {scenarios.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`tab-button ${item.id === scenario.id ? 'active' : ''}`}
              aria-pressed={item.id === scenario.id}
              onClick={() => onScenarioChange(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <div className="map-shell">
        {children}
      </div>
    </div>
  );
}

export default ScenarioPage;
