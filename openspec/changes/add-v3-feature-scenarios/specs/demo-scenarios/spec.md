## Purpose

Guides visitors through the turkey-map-react features added on the `geography-hooks-zoom` line, using self-contained, accessible scenarios that double as copyable examples for choropleths, viewport control, headless rendering, rich geography data, and GeoJSON conversion.

## ADDED Requirements

### Requirement: New scenarios join the existing catalog without changing existing ones

The demo SHALL register each new scenario exactly once in `SCENARIOS` with a unique kebab-case id, a short tab label, an eyebrow, a title, a description, a data/source note, and a component. The five new ids SHALL be `choropleth`, `viewport`, `headless`, `geography`, and `geojson`.

The existing scenarios and their ids SHALL remain in the catalog and render with unchanged behavior. The first registered scenario SHALL remain the default on load. The scenario switcher SHALL list every registered scenario, and the README scenario table SHALL describe every scenario, including the new ones.

#### Scenario: Every scenario renders from the registry

- **WHEN** the scenario registry smoke test renders each registered scenario component
- **THEN** every scenario mounts without network access and renders at least one heading

#### Scenario: Existing entry points are preserved

- **WHEN** a visitor opens the demo with no stored scenario selection
- **THEN** the existing first scenario is active, and its tab and content are unchanged

#### Scenario: The new tabs appear

- **WHEN** the demo loads
- **THEN** the scenario switcher exposes the five new labels alongside every existing label, and selecting one renders only that scenario

#### Scenario: README matches the registry

- **WHEN** a maintainer compares the README scenario table with `SCENARIOS`
- **THEN** every registered scenario has one matching row describing what it demonstrates

### Requirement: Choropleth studio exposes values, scale types, and interaction composition

The `choropleth` scenario SHALL color provinces from a checked-in numeric dataset keyed by city id and SHALL let a visitor switch `scaleType` among `linear`, `quantize`, `quantile`, and `threshold` without leaving the page.

The scenario SHALL show a legend that reflects the active scale and palette, SHALL deliberately omit at least one province from `values` so `noDataColor` is visible, and SHALL display the province's numeric value in a custom tooltip. It SHALL provide a `getColor` override for at least one province and an `animateValues` toggle. Hover and selection SHALL keep the value fill visible while using the documented outline treatment, and all controls SHALL have visible labels and keyboard-operable native inputs.

#### Scenario: Switching scale type recolors the map

- **WHEN** the visitor selects `quantize`, `quantile`, or `threshold` instead of `linear`
- **THEN** the province fills and the legend buckets change to match the selected scale

#### Scenario: Missing values use the no-data color

- **WHEN** the scenario renders with the checked-in values
- **THEN** provinces without a finite value use the configured `noDataColor`, and the legend names that state

#### Scenario: The tooltip shows the current value

- **WHEN** the visitor hovers or focuses a province that has a value
- **THEN** the custom tooltip shows the province name, its numeric value, and the active scale label

#### Scenario: The getColor override wins

- **WHEN** the visitor enables the `getColor` override
- **THEN** the designated province uses the override color while other provinces keep their scale color

#### Scenario: Values can animate

- **WHEN** the visitor changes the dataset and `animateValues` is enabled
- **THEN** fills transition, and the transition is suppressed when the visitor prefers reduced motion

#### Scenario: Interaction keeps the metric visible

- **WHEN** the visitor hovers or selects a province in choropleth mode
- **THEN** the fill remains the value or no-data color and hover/selection is indicated by the documented outline instead of replacing the fill

### Requirement: Zoom atlas demonstrates gestures, viewport state, and the imperative ref API

The `viewport` scenario SHALL render a map with `zoomable` and `zoomControls` and SHALL document the keyboard shortcuts available while the SVG viewport has focus. It SHALL let the visitor switch between uncontrolled and controlled viewport modes, SHALL display the current `Viewport` values reported by `onViewportChange`, and SHALL provide native buttons that call `focusCity`, `zoomTo`, and `resetView` through a `TurkeyMapRef`.

Province selection SHALL remain usable and independent from viewport changes. The scenario SHALL expose a visible reset action, SHALL keep controls keyboard operable with accessible names, and SHALL NOT fake viewport values when the installed library does not support the API.

#### Scenario: Gestures update the viewport readout

- **WHEN** the visitor zooms with the wheel, double-click, controls, or keyboard, or pans by dragging
- **THEN** the visible scale and translation values update from `onViewportChange` and stay within the configured zoom bounds

#### Scenario: Controlled mode follows the parent state

- **WHEN** controlled mode is active and the visitor gestures or uses a ref button
- **THEN** the scenario receives the requested viewport through `onViewportChange` and re-renders the map only after updating its controlled value

#### Scenario: Uncontrolled mode owns its viewport

- **WHEN** uncontrolled mode is active and the visitor gestures
- **THEN** the map updates itself and the scenario mirrors the latest reported viewport

#### Scenario: Preset focus centers a province

- **WHEN** the visitor activates a preset such as `focusCity("istanbul", 4)`
- **THEN** the map centers that province at the requested scale, and an unknown preset is not offered

#### Scenario: Reset restores the initial view

- **WHEN** the visitor activates reset after zooming and panning
- **THEN** the map returns to the minimum zoom, centered, and the readout reflects the reset viewport

#### Scenario: Selection is independent of zoom

- **WHEN** the visitor taps a province without dragging, or activates it from the keyboard, at any zoom level
- **THEN** the selection changes normally, and a drag beyond the threshold does not select a province

#### Scenario: Zoom shortcuts are discoverable

- **WHEN** the visitor reads the scenario instructions or focuses the SVG viewport
- **THEN** the scenario names the `+`/`=`, `-`, arrow-key, and `0` shortcuts and states that province navigation is unchanged

### Requirement: Headless province board renders the hook without the map component

The `headless` scenario SHALL use `useTurkeyMap` and SHALL NOT render `<TurkeyMap>` or `<CoreTurkeyMap>`. It SHALL render a consumer-owned interactive representation, including a custom SVG or HTML list, using `getContainerProps`, `getCityProps`, and `getTooltipProps` without overriding the hook's role, tab index, ARIA state, or handlers.

The scenario SHALL demonstrate controlled multiple selection with a visible cap, a selection summary, a consumer-owned tooltip, and a polite live region fed by the hook's `announcement`. It SHALL provide a native-select fallback that applies values through `changeSelection`, SHALL demonstrate scenario-defined custom city metadata, and SHALL show that selection and focus stay synchronized across the rendered representations.

#### Scenario: The hook drives a custom renderer

- **WHEN** the headless scenario renders
- **THEN** the map-like representation receives its container and city props from `useTurkeyMap`, no full map component is mounted, and provinces expose option or button semantics, accessible names, selected state, and a single roving tab stop

#### Scenario: Keyboard navigation works without the component

- **WHEN** the visitor tabs into the headless container and uses arrow keys, Home, End, Enter, or Space
- **THEN** focus and selection follow the same behavior as the component, and the live region announces the resulting state

#### Scenario: Selection is capped and summarized

- **WHEN** the visitor selects more provinces than the configured cap
- **THEN** the extra activation is rejected, the scenario reports the cap, and the selected list and live region reflect the unchanged selection

#### Scenario: Custom metadata survives the hook

- **WHEN** the visitor selects a city with scenario-defined metadata
- **THEN** the selected list and callbacks show that metadata without a separate lookup table

#### Scenario: The fallback select stays synchronized

- **WHEN** the visitor changes the native-select fallback value
- **THEN** `changeSelection` applies the same normalization, cap, callbacks, and announcement as pointer selection, and the custom renderer updates

#### Scenario: Tooltip content is consumer-owned

- **WHEN** the visitor hovers or focuses a province with tooltips enabled
- **THEN** the scenario renders its own tooltip content with the hook's tooltip props, and the tooltip does not capture pointer events

### Requirement: Geography atlas uses the built-in rich city fields

The `geography` scenario SHALL color provinces by their built-in `region`, SHALL draw a marker at each available `centroid`, and SHALL highlight the hovered province's `neighbors` to demonstrate the rich dataset.

The scenario SHALL show a detail panel for the hovered or selected province containing at least its region name, area in km², population, ISO code, NUTS code, and alternative names when present. It SHALL prove that the complete city object reaches interaction callbacks by reading these fields directly from the callback payload. The map SHALL keep an accessible name, tooltip behavior, and keyboard selection.

#### Scenario: Regions are read from the dataset

- **WHEN** the scenario renders the built-in data
- **THEN** each province uses a color derived from its `region` field without a plate-to-region lookup

#### Scenario: Centroids anchor visible markers

- **WHEN** a province exposes a `centroid`
- **THEN** a pointer-inert marker or label is rendered at that point in the map coordinate space

#### Scenario: Neighbors highlight on hover or focus

- **WHEN** the visitor hovers or focuses a province with neighbors
- **THEN** every city id in that province's `neighbors` array is visually emphasized and the detail panel lists the neighbor names

#### Scenario: Detail panel explains the geography fields

- **WHEN** a province is active
- **THEN** the panel shows its region, area, population, ISO code, NUTS code, and alternative names where available

#### Scenario: Interaction payloads are complete

- **WHEN** a province is hovered, clicked, or selected
- **THEN** the scenario reads the rich fields from the callback's city object instead of looking them up separately

### Requirement: GeoJSON workshop converts and renders a checked-in sample

The `geojson` scenario SHALL convert a checked-in GeoJSON `FeatureCollection` with `geoJsonToCities` and render the result through `turkey-map-react/core`. The sample SHALL include at least one `Polygon`, one `MultiPolygon`, one polygon with an interior ring (hole), and properties that require custom key mapping.

The scenario SHALL let the visitor switch between property-name and accessor key mapping, SHALL expose `padding` and `precision` controls, and SHALL offer a custom `project` option alongside the default projection. It SHALL report how many features were converted versus skipped and SHALL surface a readable notice when an unsupported feature is present. The converted map SHALL remain keyboard accessible and use an accessible name.

#### Scenario: The sample converts to renderable cities

- **WHEN** the scenario loads the sample FeatureCollection
- **THEN** `geoJsonToCities` returns one city per usable feature and the core map renders every converted path

#### Scenario: Holes and multipolygons survive

- **WHEN** the sample includes a hole and a MultiPolygon
- **THEN** the rendered paths preserve the hole and every polygon part, and the scenario identifies both cases

#### Scenario: Key mapping is configurable

- **WHEN** the visitor switches the id, name, or plate mappings between property names and accessors
- **THEN** the converted city ids, names, and plate numbers update and the map re-renders without hand-written SVG paths

#### Scenario: Projection and output options change the geometry

- **WHEN** the visitor changes the projection, padding, or precision
- **THEN** the converted paths are regenerated with that option and the rendered map updates

#### Scenario: Unsupported features are reported

- **WHEN** the sample contains a feature with an unsupported geometry or missing id
- **THEN** the conversion skips it, reports the skipped count, and the rest of the map still renders

#### Scenario: The generated map is accessible

- **WHEN** a converted map is focused or driven from the keyboard
- **THEN** provinces expose the same accessible names, roving tab stop, and selection behavior as any custom-data core map

### Requirement: New scenarios are self-contained and dependency-gated

Every new scenario SHALL use only checked-in data and SHALL make no network request. The demo dependency SHALL point to a `turkey-map-react` release that exports every API used by the scenarios. If a required API is unavailable, the build or the scenario smoke test SHALL fail rather than render a silent mock.

The new scenarios SHALL be usable at the existing responsive breakpoints of the `map-grid` layout, and new shared controls SHALL use the existing demo CSS conventions or narrowly scoped additions.

#### Scenario: The demo works offline

- **WHEN** the app loads and a visitor exercises every new scenario with the network disabled
- **THEN** all data, GeoJSON, controls, and maps still render and respond

#### Scenario: A missing API fails loudly

- **WHEN** the installed `turkey-map-react` does not export an API used by a new scenario
- **THEN** the build or registry smoke test fails with that import error instead of showing fabricated data

#### Scenario: The layout stays usable on small screens

- **WHEN** the viewport is narrower than the existing responsive breakpoints
- **THEN** the map, controls, and side panels stack using the existing layout conventions without horizontal overflow beyond the page container
