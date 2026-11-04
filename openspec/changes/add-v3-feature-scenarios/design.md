## Context

See `proposal.md` for the branch analysis and motivation, and `specs/demo-scenarios/spec.md` for the behavior contract.

The demo is a single-page React 19 + Vite app with no router. `src/App.jsx` picks the active scenario from `SCENARIOS` in `src/scenarios/index.js`; `ScenarioPage` owns the hero, tabs, and version chip. Scenarios share the `map-grid` / `map-card` / `side-panel` layout and CSS in `src/App.css`, and are exercised by one registry smoke test.

The library side of this change is the five commits on `feat/geography-hooks-zoom` after `master`:

- `01dd5e9` adds `values`, `colorScale`, `scaleType`, `thresholds`, `noDataColor`, `getColor`, and `animateValues`.
- `0e5452f` adds `zoomable`, `minZoom`, `maxZoom`, `zoomControls`, `viewport`, `onViewportChange`, and `TurkeyMapRef`.
- `3d14844` adds `useTurkeyMap` with selection, focus, tooltip, and ARIA prop getters.
- `aabad38` adds the optional `CityType` geography fields and full-city interaction payloads.
- `c914fa4` adds `geoJsonToCities` at the `turkey-map-react/geojson` subpath.

The published package in the demo is `2.3.0`, which has none of them. The library branch still reports `2.3.0` in `package.json`, and the docs target `2.6.0` for choropleth/geography and `3.0.0` for viewport/headless/GeoJSON, so the demo cannot pin a final version until the release is cut.

## Goals / Non-Goals

**Goals:**

- Give each library capability one self-contained, visually distinct scenario that a reviewer can exercise without reading the library tests.
- Reuse existing demo data (`population.json`, `earthquakeRisk.json`, built-in `cities`) and layout classes wherever possible.
- Keep every example copyable: the scenario body should show the props, hook options, or conversion options that matter.
- Keep all new scenarios keyboard-accessible and resilient to narrower layouts.

**Non-Goals:**

- Reproducing the library test matrix or documenting every option of every API.
- Adding a general-purpose data pipeline, router, persisted state, or charting dependency.
- Replacing the existing earthquake/theming/selection scenarios with the new APIs.
- Adding labels for all 81 provinces or a production cartographic projection.
- Changing demo-wide styling beyond narrowly scoped additions.

## Decisions

### Add five registry entries instead of one mega-scenario

Each feature gets its own folder and tab: `choropleth`, `viewport`, `headless`, `geography`, and `geojson`. The current first scenario stays first, and the new entries are appended.

Alternatives considered:

- **One "v3 lab" with sub-tabs.** Rejected because the existing contract is one scenario per feature, deep-linking is not available, and a single page would mix unrelated state (viewport, values, hook selection).
- **Extend existing scenarios in place.** Rejected because it would hide the new APIs inside older demos and risk changing their established behavior.

### Choropleth: derive `values` from existing population data, not a new dataset

Use `population.json` (already keyed by plate) and the built-in `cities` array to build a `Record<cityId, number>`. Omit a small set of provinces deliberately so `noDataColor` is visible.

State:

- `scaleType` (`linear` | `quantize` | `quantile` | `threshold`)
- `palette` (2–5 stops, chosen to keep legends readable)
- `showNoData` (remove/add the omitted provinces to `values`)
- `animateValues`
- `overrideIstanbul` (toggles `getColor` for one province)

`renderTooltip` receives `(city, value)` and renders the value plus the scale label. A small legend component maps the active palette to ranges; for `linear` it shows min/max endpoints, for the other types it shows the bucket count. This avoids implementing the library's out-of-scope Legend component.

Alternative: use `earthquakeRisk.json`. Rejected because those values are a 1–5 ordinal scale and make `quantile`/`linear` differences hard to see; population is skewed and shows off all four scales.

### Viewport: one ref, both modes, explicit readout

Render a `TurkeyMap` with `zoomable`, `zoomControls`, `minZoom={1}`, and `maxZoom={8}`. Keep a `mode` state (`controlled` | `uncontrolled`).

- Uncontrolled: do not pass `viewport`; `onViewportChange` updates a readout state.
- Controlled: keep `viewport` in scenario state; `onViewportChange` writes it back. The ref still calls the map's methods and the parent applies the reported value.

Expose three preset buttons that call `ref.current.focusCity(id, zoom)` for İstanbul, Ankara, and İzmir, plus `zoomTo(3)` and `resetView()`. The readout shows `scale`, `translateX`, and `translateY` with fixed precision.

Selection is `selectionMode="single"` with a pinned province shown in the side panel, which proves that a drag suppresses selection while a tap still selects. The scenario also names the viewport keyboard shortcuts so they are discoverable.

Alternatives considered:

- **Only uncontrolled mode.** Rejected because controlled mode is the more common dashboard integration and is where the "gestures report but do not replace" contract matters.
- **Custom controls instead of `zoomControls`.** Rejected because the built-in controls are part of the feature and the demo should show them.

### Headless: one hook, switchable SVG and HTML renderers

Call `useTurkeyMap` once with `data={{ cities }}`, `selectionMode="multiple"`, a cap, controlled `selectedCities`, `showTooltip`, and custom metadata. Render exactly one interactive representation at a time to avoid duplicate tab stops:

- **SVG view:** `<div {...getContainerProps()}><svg>...paths with getCityProps...</svg></div>`
- **List view:** the same container props around a grid of `<button>` or `<div>` rows, each with `getCityProps(city)`.

The renderer switch keeps hook state because the hook is above the branch. A consumer-owned tooltip uses `getTooltipProps()`, and a visually hidden `role="status"` region renders `announcement`. A separate native `<select multiple>` calls `changeSelection` to mirror the component's `a11yFallback`.

Custom metadata is layered onto the checked-in city objects at module scope (for example a `chamber` or `trail` field) so the selected list and callbacks read it back. This proves the hook's generic/runtime metadata flow even though the demo is JavaScript rather than TypeScript.

Alternatives considered:

- **Render SVG and list simultaneously.** Rejected because two interactive copies of the same city would create duplicate focusable controls and ambiguous announcements.
- **No SVG, list only.** Rejected because it would not demonstrate custom SVG rendering, which is the hook's headline use case.

### Geography: use the built-in fields directly and keep labels sparse

Import `cities` from `turkey-map-react/data`. Build:

- `CITY_BY_ID` for neighbor names and detail lookup.
- `REGION_COLORS` keyed by the library's `Region` values (`marmara`, `ege`, `akdeniz`, `ic-anadolu`, `karadeniz`, `dogu-anadolu`, `guneydogu-anadolu`).
- `getCityStyle` that uses `city.region` for the base fill, dims non-neighbors while a province is hovered, and uses the existing selection/focus state.

Centroids are shown with a `cityWrapper` that returns the province plus a pointer-inert `<circle>` at `city.centroid`; a label is drawn only for the active province and its neighbors to avoid 81 labels. The detail panel shows region, area, population, ISO, NUTS, and `altNames`, and reads those fields straight from the `onHover`/selection payload.

Alternatives: an absolutely positioned HTML overlay would not stay aligned with the SVG during hover/selection; a separate overlay SVG would duplicate coordinate logic. The `cityWrapper` keeps markers in the map coordinate space.

The library has no public focus callback, so the panel tracks hover plus selection (click/Enter/Space) rather than trying to infer keyboard focus from the DOM. Tooltips still follow focus as before.

### GeoJSON: synthetic, checked-in fixture with all supported cases

Add a small `sampleGeoJson.js` FeatureCollection under the scenario. It has:

- a `Polygon`,
- a `MultiPolygon`,
- a `Polygon` with an interior ring,
- an unsupported `Point` feature (and/or a feature without an id) to exercise the skip path.

Every usable feature carries both the default `id`/`name`/`plateNumber` properties and custom `ADM1_CODE`/`NAME_1`/`PLATE` properties, so switching the key mapping never skips a renderable feature. The unsupported feature is the only intentional skip.

The scenario calls `geoJsonToCities(sample, options)` in a `useMemo`, reports `converted`/`skipped`, and renders the result with `CoreTurkeyMap` from `turkey-map-react/core`. Controls switch the key mapping (property names versus accessors), projection (default equirectangular versus a small Mercator projection), padding, and precision. A `renderTooltip` shows the original feature source if useful.

The sample is deliberately synthetic and documented as such; real provincial GeoJSON would be large, require external provenance, and make the demo's bundle and license story worse. The library's own fixture and docs cover cartographic limitations.

### Dependency sequencing and local verification

The first task is to bump `turkey-map-react` from `^2.3.0` to the release that contains all five commits. The change should not be merged to `main` before that release exists.

Until then, validate with the README's `npm pack` flow from `../turkey-map-react`. While the dependency is `file:../turkey-map-react`, the checked-in `.npmrc` sets `install-links=true` so npm copies the package instead of symlinking it; a symlink makes the library resolve its own nested React and creates a second renderer instance. Add `turkey-map-react/geojson` to Vite's `optimizeDeps.include` (alongside the existing root/core/data entries) so the named export works. If a tarball is used, the regular dependency install path applies. Revert any temporary `file:`/link entries before opening the final PR.

The library's webpack CommonJS bundle does not set `__esModule`, which makes Vitest's default-import interop return the whole module object. A small Vitest-only alias in `vite.config.mjs` maps the root and core specifiers to `src/test-utils/` shims that unwrap the component; the application build keeps importing the real package. This is a test-environment workaround, not a runtime dependency.

Alternatives: copying the library source into the demo or mocking the APIs would hide integration failures and is rejected.

### Tests stay scenario-scoped

The registry smoke test automatically covers mounting. Add small tests for behavior that is easy to regress:

- Choropleth: switch each scale type and assert the legend labels change; toggle no-data and `getColor`.
- Viewport: click `zoomTo`/reset and assert the readout; do not rely on `focusCity`, which needs `getBBox` and is a no-op in jsdom unless stubbed.
- Headless: switch renderers, select a city, assert the live region/selection list, and apply a native-select value.
- Geography: click a province and assert the detail panel shows rich fields.
- GeoJSON: conversion returns the expected feature count, preserves the hole/multipolygon, and skips the unsupported feature.

## Risks / Trade-offs

- **The required library release may not exist yet** → Keep the change in review/tarball mode and merge only after publishing; do not commit a fake or locally patched API.
- **Dependency bump could regress existing scenarios** → Run the full registry smoke test and a visual pass over all existing tabs before merging; the library claims the changes are additive.
- **`focusCity` cannot be tested in jsdom** → Stub `getBBox` in the focused test or assert only `zoomTo`/`resetView`; the scenario still exposes `focusCity` in the browser.
- **Choropleth legends can misrepresent quantile buckets** → Label the legend by scale type and show bucket counts/ranges rather than claiming exact continuous values.
- **81 centroid markers plus hover-driven styles could add noise** → Keep markers pointer-inert and small, and draw text only for the active province and neighbors.
- **`cityWrapper` changes may re-render all provinces on hover** → Acceptable for a demo; the library's render-isolation scenario remains the performance reference.
- **Headless renderer toggle could lose focus when switching** → Preserve selection and announce the renderer change; move focus to the new container after the switch if needed.
- **GeoJSON sample warnings are noisy in development** → Keep exactly one unsupported feature, surface the skip count in the UI, and explain that the warning is intentional.
- **Large GeoJSON sample could bloat the bundle** → Keep the fixture to a handful of small polygons and do not add a real-world dataset.
- **Vite linked-package resolution for a new subpath** → Add `turkey-map-react/geojson` to `optimizeDeps.include` while linked and verify both `npm run dev` and `npm run build`.

## Migration Plan

1. Publish the library release containing the five commits.
2. Bump the demo dependency and install.
3. Add the five scenarios and registry entries.
4. Run lint, tests, and build; compare all existing scenarios against the pre-bump screenshots.
5. Roll back by reverting the demo commit and the dependency bump; no data migration or persisted state is involved.

## Open Questions

None. The only external dependency is the timing of the library release, and the plan defines a tarball-based review path until it exists.
