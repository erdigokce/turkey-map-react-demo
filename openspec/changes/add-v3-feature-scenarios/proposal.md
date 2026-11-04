## Why

The sibling `turkey-map-react` branch `feat/geography-hooks-zoom` adds five public capabilities that are not on `master` or in the demo's current `2.3.0` dependency: choropleth values and color scales, zoom/pan plus an imperative ref API, the headless `useTurkeyMap` hook, rich built-in geography data, and the `turkey-map-react/geojson` converter. The demo currently documents and exercises only the `2.3.0` surface, so reviewers cannot see how the new APIs compose, and the release has no public, copyable examples.

This change adds one focused scenario per capability, in the existing scenario-catalog style, so the next published release can be validated visually and used as living documentation.

## What Changes

This change is **additive** to the demo. It adds new scenarios and leaves every existing scenario, its registry id, and the default first scenario unchanged. The only potentially breaking surface is the `turkey-map-react` dependency version, which must be raised to a release containing the branch commits (or validated against an `npm pack` tarball until that release exists). No existing demo API or URL is removed.

- Add a **Choropleth studio** scenario (`choropleth`) that colors provinces from checked-in population/risk values and lets a visitor switch `scaleType` between `linear`, `quantize`, `quantile`, and `threshold`. It includes a live legend, a palette choice, `noDataColor` for provinces deliberately omitted from `values`, an `animateValues` toggle, a `getColor` override, and a `renderTooltip` value readout.
- Add a **Zoom atlas** scenario (`viewport`) that enables `zoomable`, `zoomControls`, and the documented keyboard gestures. It demonstrates both uncontrolled and controlled `viewport` modes, exposes `onViewportChange` telemetry, and provides buttons that call `focusCity`, `zoomTo`, and `resetView` through `TurkeyMapRef`. Province selection stays independent from viewport changes.
- Add a **Headless province board** scenario (`headless`) that renders a custom SVG map and an HTML list from the same `useTurkeyMap` state. It uses `getContainerProps`, `getCityProps`, and `getTooltipProps`, a consumer-owned tooltip and polite live region, controlled multi-selection with a cap, scenario-defined city metadata, and `changeSelection` for a native-select fallback.
- Add a **Geography atlas** scenario (`geography`) that uses the built-in `CityType` fields directly: seven-region coloring from `region`, centroid markers/labels from `centroid`, hovered-neighbor highlighting from `neighbors`, and a detail panel for `areaKm2`, `population`, `isoCode`, `nutsCode`, and `altNames`. It shows that interaction callbacks carry the complete city object without a separate lookup.
- Add a **GeoJSON workshop** scenario (`geojson`) that converts a checked-in sample `FeatureCollection` with `geoJsonToCities`. The sample covers `Polygon`, `MultiPolygon`, holes, custom `idKey`/`nameKey`/`plateKey` accessors, and a custom projection; controls switch key mapping, padding, precision, and projection, and the converted paths render through `turkey-map-react/core`.
- Register all five scenarios in `SCENARIOS`, extend the README scenario table and feature notes, and add scenario-level tests plus a GeoJSON-conversion unit test.
- Raise `turkey-map-react` to the first release that contains `01dd5e9`, `0e5452f`, `3d14844`, `aabad38`, and `c914fa4`. Until that release is published, verify against the sibling repository through `npm pack` and keep the installed version out of the committed lockfile only if the release is not yet available.
- Add only the CSS needed by the new controls, legends, headless board, and detail panels, reusing existing `map-grid`, `map-card`, `side-panel`, `control-row`, `legend`, and `pill` patterns.

**Explicitly out of scope:** changing the library itself; adding a legend component to `turkey-map-react`; fetching live population, earthquake, or GeoJSON data; adding runtime dependencies; a URL router or per-scenario deep links; replacing or restyling existing scenarios; automatic publishing of `turkey-map-react`; and making the demo's first scenario default to a new one.

## Capabilities

### New Capabilities

- `demo-scenarios`: the five new gallery scenarios, their visible controls and outputs, the registry/README integration, the dependency gate for the library release, and the accessibility and graceful-degradation behavior of the demos.

### Modified Capabilities

None. The existing scenarios' required behavior does not change.

## Impact

- **Dependency:** `turkey-map-react` must be upgraded from `^2.3.0` to a release that exposes the choropleth and geography props plus the viewport, headless, and GeoJSON APIs. The library changes are additive, so existing demo scenarios should render unchanged after the bump. If the release is not yet published, the change cannot ship to `main`; it can be reviewed and tested with a tarball or `npm link`.
- **Code:** `package.json` / `package-lock.json`; `src/scenarios/index.js`; new folders `src/scenarios/choropleth/`, `src/scenarios/viewport/`, `src/scenarios/headless/`, `src/scenarios/geography/`, and `src/scenarios/geojson/`; a checked-in GeoJSON fixture under the GeoJSON scenario; small additions to `src/App.css`; possibly `vite.config.mjs` `optimizeDeps.include` for `turkey-map-react/geojson` while the package is linked.
- **Docs:** `README.md` scenario table and the local-testing section (tarball/link workflow and the new subpath).
- **Tests:** the existing registry smoke test must render every new scenario without network access; new focused tests cover scale switching, viewport controls/ref calls, headless selection and announcements, geography detail rendering, and GeoJSON conversion.
- **Accessibility:** every scenario keeps the existing keyboard model; new controls use native buttons, labels, and fieldsets, the headless board exposes a polite live region, and the GeoJSON/geography maps keep tooltips and accessible names.
- **Compatibility:** no persisted state, storage, or URL contracts change. Scenarios are client-only and work with the existing Vite build.
