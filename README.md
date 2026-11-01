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
│   │   └── metropolitan
│   │       ├── MetropolitanScenario.jsx  # Multi-select demo
│   │       └── metropolitanMunicipalities.json
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

- Use the scenario tabs in the hero to switch between demos.
- **Earthquake risk:** hover a province to preview its risk level, click to pin it, and filter the recent quake feed by magnitude.
- **Büyükşehir selection:** the 30 metropolitan municipalities start selected. Click any province to add or remove it, then use **Reset to 30 büyükşehir** or **Clear all**. The side panel lists the controlled selection and the `onSelect` event.

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

If you have local changes in the sibling `turkey-map-react` repo and want to test them in this demo before publishing, use `npm pack`:

```bash
# 1. Build the library
cd ../turkey-map-react
npm run build

# 2. Pack it into a tarball
npm pack --pack-destination ../turkey-map-react-demo

# 3. Install the local tarball in the demo
cd ../turkey-map-react-demo
npm install ./turkey-map-react-2.0.5.tgz

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