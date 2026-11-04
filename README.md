# Map Demo

A scenario-driven demo for [`turkey-map-react`](https://github.com/erdigokce/turkey-map-react). Each scenario lives in its own folder and is registered in one place, so new map features can be showcased without touching the existing demos.

## Project Structure

```
turkey-map-react-demo
├── src
│   ├── components
│   │   └── ScenarioPage.jsx              # Shared shell: hero, scenario switcher, version chip
│   ├── scenarios
│   │   ├── index.js                      # Scenario registry (add new demos here)
│   │   ├── earthquake
│   │   │   └── EarthquakeScenario.jsx    # Risk choropleth + recent quake feed
│   │   ├── metropolitan
│   │   │   ├── MetropolitanScenario.jsx  # Multi-select demo
│   │   │   └── metropolitanMunicipalities.json
│   │   ├── selection                     # Single + multiple selection, maxSelection
│   │   ├── tooltip                       # Custom tooltip studio
│   │   ├── disabled                      # Additive disabled-city sources
│   │   ├── theming                       # CSS variables, customStyle, getCityStyle
│   │   ├── accessibility                 # Roles, roving tabindex, live region, fallback
│   │   ├── data-entry                    # Root vs /core vs /data entry points
│   │   ├── regions
│   │   │   └── regions.js                # Seven-region mapping + merged custom paths
│   │   └── rendering                     # Per-province render counters
│   ├── utils
│   │   └── cityMetrics.js                # Population lookup + number formatting
│   ├── data
│   │   ├── population.json
│   │   ├── earthquakeRisk.json
│   │   └── recentQuakes.json
│   ├── App.jsx                           # Renders the active scenario
│   ├── App.css                           # Shared styles
│   └── main.jsx                          # Entry point
├── package.json
└── README.md
```

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run the application:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`.

Other scripts: `npm test`, `npm run lint`, and `npm run build`.

## Usage

Use the scenario tabs in the hero to switch between demos. The first two scenarios are story-driven dashboards;
the rest are focused playgrounds for the features shipped in the latest `turkey-map-react` release.

| Scenario | What it demonstrates |
| --- | --- |
| **Earthquake risk** | Hover, click-to-pin and a filterable quake feed on top of a choropleth. |
| **Büyükşehir selection** | Controlled multi-select with all 30 metropolitan municipalities preselected. |
| **Itinerary selection** | Single vs. multiple modes, `maxSelection`, `onSelect`, `onSelectionChange` and `onMaxSelectionReached`. |
| **Tooltip studio** | `renderTooltip`, cursor/city anchoring, offset, delay, portal, pointer and focus behavior. |
| **Winter dispatch** | `disabledCities`, `isCityDisabled`, `data[].disabled`, disabled tooltips and inert callbacks. |
| **Theme lab** | Two instance-scoped CSS-variable themes, `customStyle` overrides and `getCityStyle` density fills. |
| **A11y lab** | Group vs. listbox roles, one roving tab stop, arrow/Home/End navigation, live-region mirror and `a11yFallback`. |
| **Entry points** | The 81-province root entry next to a custom 7-region map rendered through `turkey-map-react/core`. |
| **Render radar** | Per-province render counters proving hover, selection and focus updates stay isolated. |
| **Choropleth studio** | `values`, all four `scaleType` modes, palettes, `noDataColor`, `getColor`, `animateValues` and value-aware tooltips. |
| **Zoom atlas** | `zoomable`, gestures, keyboard shortcuts, built-in controls, controlled/uncontrolled `viewport` and the `TurkeyMapRef` API. |
| **Headless board** | `useTurkeyMap` driving a custom SVG and an HTML list, with roving focus, live announcements, tooltips and a native-select fallback. |
| **Geography atlas** | Built-in region, centroid, neighbours, area, population, ISO/NUTS and alternative-name fields, including neighbour highlighting. |
| **GeoJSON workshop** | `geoJsonToCities` converting Polygon/MultiPolygon/hole features, with key mapping, projection, padding and precision controls. |

The `security-scanning` capability is CI-only (scheduled audit, CodeQL and guarded auto-merge), so it has no map
scenario here.

## Adding a new scenario

1. Create `src/scenarios/<name>/<Name>Scenario.jsx`. It only needs to render the scenario body, usually starting with the shared `map-grid` layout.
2. Add an entry to `SCENARIOS` in `src/scenarios/index.js`:

```js
import MyScenario from './my-scenario/MyScenario';

export const SCENARIOS = [
  // ...existing scenarios
  {
    id: 'my-scenario',
    label: 'My scenario',
    eyebrow: 'Turkey Map React · My feature',
    title: 'A title for the hero',
    description: 'One or two sentences shown under the title.',
    source: 'Data: where the demo data comes from',
    component: MyScenario,
  },
];
```

The first entry is the default. `ScenarioPage` provides the hero, scenario switcher, and version chip automatically, so a new scenario only owns its map, controls, and side panel.

## Testing Local Changes in turkey-map-react

The choropleth, viewport, headless-hook, geography-data and GeoJSON scenarios depend on the
`feat/geography-hooks-zoom` line of `turkey-map-react`. Until that branch is published, the demo can
be pointed at the sibling checkout with a `file:` dependency. The checked-in `.npmrc` uses
`install-links=true` so npm copies that package instead of symlinking it; a symlink would make the
library resolve its own nested React copy and break hooks in tests.

If you have local changes in the sibling `turkey-map-react` repo and want to test them in this demo before publishing, use `npm pack`:

```bash
# 1. Build the library
cd ../turkey-map-react
npm run build

# 2. Pack it into a tarball
npm pack --pack-destination ../turkey-map-react-demo

# 3. Install the local tarball in the demo
cd ../turkey-map-react-demo
npm install ./turkey-map-react-*.tgz

# 4. Run the demo
npm run dev
```

Alternatively, use `npm link`:

```bash
# 1. Build and register the library
cd ../turkey-map-react
npm run build
npm link

# 2. Link it in the demo
cd ../turkey-map-react-demo
npm link turkey-map-react

# 3. Run the demo
npm run dev
```

`npm link` shares the library's full working tree, including its own `node_modules`. If React hooks fail
with an “Invalid hook call” error, prefer the `file:` dependency with `install-links=true` or the tarball
flow above so the demo and the library use one React copy.

To revert to the published version:

```bash
cd ../turkey-map-react-demo
npm unlink turkey-map-react
npm install turkey-map-react
```

## Automated dependency updates

Dependabot checks the npm registry once a day for new `turkey-map-react` releases and opens a pull request.
CI runs lint, tests, and the production build on every PR. Patch and minor releases are auto-merged once the
`verify` check passes; major releases stay open for manual review.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.