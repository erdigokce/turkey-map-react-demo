## 1. Dependency and local verification

- [ ] 1.1 Publish or identify the `turkey-map-react` release that contains `01dd5e9`, `0e5452f`, `3d14844`, `aabad38`, and `c914fa4`, then raise the demo dependency from `^2.3.0` to that release and update `package-lock.json`.
- [x] 1.2 Until the release exists, verify against the sibling repo with `npm pack` (or `npm link`) and record the temporary install method in the change notes; do not commit fake APIs or a patched copy of the library.
- [x] 1.3 Add `turkey-map-react/geojson` to `vite.config.mjs` `optimizeDeps.include` when the linked-package workflow is in use, and confirm `npm run dev` and `npm run build` resolve every new entry point.
- [x] 1.4 Run the existing scenario registry smoke test and a manual pass over all current tabs after the dependency bump, confirming no existing scenario changed behavior.

## 2. Scenario registry and README

- [x] 2.1 Add `choropleth`, `viewport`, `headless`, `geography`, and `geojson` imports and entries to `SCENARIOS`, appending them after the existing entries and leaving the first scenario as the default.
- [x] 2.2 Give every entry a unique id, label, eyebrow, title, description, and source note that names the demonstrated API.
- [x] 2.3 Extend the README scenario table and feature notes with one row per new scenario, including the `useTurkeyMap` and `turkey-map-react/geojson` entry points.
- [x] 2.4 Update the README local-testing section so the tarball/link workflow mentions the new `geojson` subpath and the release gate.

## 3. Choropleth studio scenario

- [x] 3.1 Create `src/scenarios/choropleth/ChoroplethScenario.jsx` and derive a `Record<cityId, number>` from `src/data/population.json` plus the built-in `cities` ids; deliberately omit several provinces from `values`.
- [x] 3.2 Add keyboard-operable controls for `scaleType` (`linear`, `quantize`, `quantile`, `threshold`), palette, no-data inclusion, `animateValues`, and a `getColor` override.
- [x] 3.3 Render a legend that reflects the active scale, palette, no-data color, and the designated override province.
- [x] 3.4 Add a custom `renderTooltip` that shows the province name, the numeric value from the second callback argument, and the active scale label.
- [x] 3.5 Compose hover and selection styling so the value fill remains visible with the documented hover/selection outlines.
- [x] 3.6 Add a side panel with the active scale explanation, selected province value, and a short note about `noDataColor` and reduced motion.

## 4. Zoom atlas scenario

- [x] 4.1 Create `src/scenarios/viewport/ViewportScenario.jsx` with a `TurkeyMap` using `zoomable`, `zoomControls`, `minZoom={1}`, and `maxZoom={8}`.
- [x] 4.2 Add a controlled/uncontrolled switch: controlled mode keeps a `viewport` state updated from `onViewportChange`; uncontrolled mode omits `viewport`.
- [x] 4.3 Add a fixed-precision viewport readout for `scale`, `translateX`, and `translateY` driven by `onViewportChange`.
- [x] 4.4 Add a typed `TurkeyMapRef` and native preset buttons that call `focusCity` for at least three provinces, `zoomTo`, and `resetView`.
- [x] 4.5 Add a single-selection detail panel and instructions that explain tap-versus-drag behavior and the `+`/`=`, `-`, arrow-key, and `0` shortcuts.
- [x] 4.6 Add a visible reset action and an explanation of what controlled mode reports versus renders.

## 5. Headless province board scenario

- [x] 5.1 Create `src/scenarios/headless/HeadlessScenario.jsx` that calls `useTurkeyMap` with built-in `cities`, controlled multi-selection, a selection cap, `showTooltip`, and scenario-defined city metadata.
- [x] 5.2 Render a custom SVG representation using `getContainerProps()` on the container and `getCityProps(city)` on each path, without rendering `<TurkeyMap>` or `<CoreTurkeyMap>`.
- [x] 5.3 Add a switchable HTML list renderer that uses the same hook state and `getCityProps`, rendering only one interactive representation at a time and preserving selection when switching.
- [x] 5.4 Render a consumer-owned tooltip with `getTooltipProps()` and `tooltipCity`, plus a visually hidden polite live region driven by `announcement`.
- [x] 5.5 Add a selection summary that shows the city objects' custom metadata, and surface the cap rejection without changing the hook's selection.
- [x] 5.6 Add a native multiple-select fallback wired to `changeSelection` and `isCityDisabled`, and verify it stays synchronized with pointer and keyboard selection.
- [x] 5.7 Make the SVG/list switch keyboard-safe: keep focus in the active representation and avoid duplicate tab stops while both branches exist in source.

## 6. Geography atlas scenario

- [x] 6.1 Create `src/scenarios/geography/GeographyScenario.jsx` and import `cities` from `turkey-map-react/data`; build `CITY_BY_ID` and a `Region`-keyed color map.
- [x] 6.2 Implement `getCityStyle` using `city.region`, dimming non-neighbors while a province is hovered and preserving the existing selected/focus treatment.
- [x] 6.3 Add pointer-inert centroid markers through `cityWrapper` using `city.centroid`, with text labels only for the active province and its neighbors.
- [x] 6.4 Add a detail panel for the hovered or selected province showing region, area in km², population, ISO code, NUTS code, and `altNames` when present.
- [x] 6.5 Show the active province's neighbors as named chips by resolving `city.neighbors` through `CITY_BY_ID`.
- [x] 6.6 Prove interaction payloads are complete by reading the region/area/codes directly from the `onHover` and selection callback city objects.
- [x] 6.7 Keep selection keyboard-accessible and provide a visible empty state before any province is active.

## 7. GeoJSON workshop scenario

- [x] 7.1 Create `src/scenarios/geojson/sampleGeoJson.js` with a `Polygon`, a `MultiPolygon`, a `Polygon` with a hole, and one unsupported or id-less feature; every usable feature carries both default and custom property names so switching key mapping never skips a renderable feature.
- [x] 7.2 Create `src/scenarios/geojson/GeojsonScenario.jsx` that converts the fixture with `geoJsonToCities` in a memo and renders the result through `turkey-map-react/core`.
- [x] 7.3 Add controls for property-name versus accessor key mapping, default versus custom Mercator `project`, `padding`, and `precision`.
- [x] 7.4 Display converted versus skipped feature counts and a readable notice explaining the intentional skip warning.
- [x] 7.5 Add an accessible name, selection, and tooltip behavior to the converted core map, and show the generated `CityType` shape for one feature.
- [x] 7.6 Confirm the sample's hole and all MultiPolygon parts remain visible in the rendered map.

## 8. Shared styling and accessibility

- [x] 8.1 Add narrowly scoped CSS for choropleth legends, viewport readout, headless board, centroid markers, and GeoJSON stats, reusing the existing `map-grid`, `map-card`, `side-panel`, `control-row`, `legend`, and `pill` classes.
- [x] 8.2 Verify the new controls use native buttons, labels, fieldsets, and visible focus states, and that the maps keep accessible names and the existing roving-tab model.
- [x] 8.3 Check the new scenarios at the existing `1024px` and `720px` breakpoints and remove any horizontal overflow.
- [x] 8.4 Confirm no new runtime dependency is added and every new data source is checked in.

## 9. Tests

- [x] 9.1 Extend the registry smoke test expectations if needed and keep every new scenario mountable without network access.
- [x] 9.2 Add a choropleth test that switches all four scale types, toggles no-data, and asserts the legend and override behavior.
- [x] 9.3 Add a viewport test that exercises controlled/uncontrolled switching, `zoomTo`, reset, and the readout without depending on jsdom layout; stub `getBBox` only if `focusCity` is asserted.
- [x] 9.4 Add a headless test that switches renderers, selects a city, asserts the live-region text and custom metadata, and applies a native-select value through `changeSelection`.
- [x] 9.5 Add a geography test that activates a province and asserts the rich detail fields and neighbor list render from the callback payload.
- [x] 9.6 Add a GeoJSON unit test that asserts the converted count, custom key mapping, hole/multipolygon preservation, skip count, and option changes.
- [x] 9.7 Run `npm test -- --run` and fix any act, timer, or focus warnings introduced by the new scenarios.

## 10. Verification

- [x] 10.1 Run `npm run lint`, `npm test -- --run`, and `npm run build`.
- [ ] 10.2 Manually exercise every new scenario with keyboard-only navigation, reduced motion enabled, and the network disabled.
- [ ] 10.3 Compare all existing scenario tabs before and after the dependency bump and confirm no visual or behavioral regressions.
- [ ] 10.4 Verify the installed `turkey-map-react` version in the UI chip and `package.json` is the intended release, and remove any temporary tarball/link configuration before opening the PR.
