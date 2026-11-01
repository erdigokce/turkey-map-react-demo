import EarthquakeScenario from './earthquake/EarthquakeScenario';
import MetropolitanScenario from './metropolitan/MetropolitanScenario';

/**
 * Scenario registry.
 *
 * To add a new demo, create a component under `src/scenarios/<name>/` and
 * append an entry here. `App` renders the first scenario by default and the
 * shared `ScenarioPage` shell takes care of the hero, scenario switcher and
 * version chip. Scenario components only render their own body content.
 */
export const SCENARIOS = [
  {
    id: 'earthquake',
    label: 'Earthquake risk',
    eyebrow: 'Turkey Map React · Demo Story',
    title: 'Earthquake risk + recent activity',
    description: 'A quick, expressive view of seismic risk levels by province, paired with a short feed of recent events. Click a province to pin details and scan the latest notable quakes.',
    source: 'Data: demo values inspired by AFAD hazard map + sample quake feed',
    component: EarthquakeScenario,
  },
  {
    id: 'metropolitan',
    label: 'Büyükşehir selection',
    eyebrow: 'Turkey Map React · Multi-select',
    title: 'Türkiye’s metropolitan municipalities',
    description: 'All 30 büyükşehir municipalities start selected. Click a province to add or remove it and watch the controlled selection update in the side panel.',
    source: 'Data: 30 büyükşehir belediyesi · multi-select feature demo',
    component: MetropolitanScenario,
  },
];
