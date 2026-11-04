import EarthquakeScenario from './earthquake/EarthquakeScenario';
import MetropolitanScenario from './metropolitan/MetropolitanScenario';
import SelectionScenario from './selection/SelectionScenario';
import TooltipScenario from './tooltip/TooltipScenario';
import DisabledScenario from './disabled/DisabledScenario';
import ThemingScenario from './theming/ThemingScenario';
import AccessibilityScenario from './accessibility/AccessibilityScenario';
import DataEntryScenario from './data-entry/DataEntryScenario';
import ProvinceRenderingScenario from './rendering/ProvinceRenderingScenario';
import ChoroplethScenario from './choropleth/ChoroplethScenario';
import ViewportScenario from './viewport/ViewportScenario';
import HeadlessScenario from './headless/HeadlessScenario';
import GeographyScenario from './geography/GeographyScenario';
import GeojsonScenario from './geojson/GeojsonScenario';

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
  {
    id: 'selection',
    label: 'Itinerary selection',
    eyebrow: 'Turkey Map React · City selection',
    title: 'Build a Türkiye itinerary',
    description: 'Compare single replacement with multi-select toggling. The trip is fully controlled, capped at five stops, and the callback feed shows every selection event.',
    source: 'Feature: single + multiple selection, maxSelection, onSelect and onSelectionChange',
    component: SelectionScenario,
  },
  {
    id: 'tooltip',
    label: 'Tooltip studio',
    eyebrow: 'Turkey Map React · Tooltips',
    title: 'Province trading cards',
    description: 'Hover, focus or touch a province to reveal a custom card. Tune the anchor, offset, delay and portal live, and watch the tooltip escape the map card clipping.',
    source: 'Feature: renderTooltip, tooltipPosition, tooltipOffset, tooltipDelay, tooltipPortal',
    component: TooltipScenario,
  },
  {
    id: 'disabled',
    label: 'Winter dispatch',
    eyebrow: 'Turkey Map React · Disabled cities',
    title: 'Winter dispatch board',
    description: 'Three additive sources close provinces for the day: an id list, a predicate and per-city data flags. Grey provinces stay visible and announce themselves, but refuse every callback.',
    source: 'Feature: disabledCities, isCityDisabled, data[].disabled and disabledTooltipText',
    component: DisabledScenario,
  },
  {
    id: 'theming',
    label: 'Theme lab',
    eyebrow: 'Turkey Map React · Theming',
    title: 'Two moods, one component',
    description: 'Two maps, two CSS-variable themes, one page. Layer customStyle and getCityStyle over the variables and flip on a population density overlay.',
    source: 'Feature: CSS custom properties, instance ids, customStyle and getCityStyle',
    component: ThemingScenario,
  },
  {
    id: 'accessibility',
    label: 'A11y lab',
    eyebrow: 'Turkey Map React · Accessibility',
    title: 'A map you can drive with a keyboard',
    description: 'Switch between group and listbox modes, inspect the roving tab model, mirror the live region, and try the hidden native select fallback for assistive technology.',
    source: 'Feature: roles, roving tabindex, live region, focus ring and a11yFallback',
    component: AccessibilityScenario,
  },
  {
    id: 'data-entry',
    label: 'Entry points',
    eyebrow: 'Turkey Map React · Data entry points',
    title: 'Anatolia, two ways',
    description: 'The root entry renders all 81 built-in provinces. The core entry renders seven custom region shapes built from the standalone dataset, so you only pay for the geography you use.',
    source: 'Feature: turkey-map-react, /core and /data entry points',
    component: DataEntryScenario,
  },
  {
    id: 'rendering',
    label: 'Render radar',
    eyebrow: 'Turkey Map React · Province rendering',
    title: 'Render radar',
    description: 'Instrument every province with a render counter. Hovering, selecting and focusing should move only the affected counters, even as the parent replaces its callbacks.',
    source: 'Feature: province-level render isolation and callback replacement',
    component: ProvinceRenderingScenario,
  },
  {
    id: 'choropleth',
    label: 'Choropleth studio',
    eyebrow: 'Turkey Map React · Choropleth',
    title: 'One metric, four colour scales',
    description: 'Compare linear, quantize, quantile and threshold scales on the same population data. Toggle a no-data province, animate the fills and add a per-province colour override.',
    source: 'Feature: values, colorScale, scaleType, thresholds, noDataColor, getColor and animateValues',
    component: ChoroplethScenario,
  },
  {
    id: 'viewport',
    label: 'Zoom atlas',
    eyebrow: 'Turkey Map React · Viewport',
    title: 'Zoom, pan and fly to a province',
    description: 'Drive the viewport with the wheel, drag, keyboard or built-in controls. Switch between controlled and uncontrolled state, then focus a province with the imperative ref API.',
    source: 'Feature: zoomable, zoomControls, viewport, onViewportChange and TurkeyMapRef',
    component: ViewportScenario,
  },
  {
    id: 'headless',
    label: 'Headless board',
    eyebrow: 'Turkey Map React · Headless hook',
    title: 'The map engine without the map component',
    description: 'Render a custom SVG and a plain HTML list from the same useTurkeyMap state. Selection, roving focus, announcements, tooltips and a native-select fallback are all consumer-owned.',
    source: 'Feature: useTurkeyMap, getContainerProps, getCityProps, getTooltipProps and changeSelection',
    component: HeadlessScenario,
  },
  {
    id: 'geography',
    label: 'Geography atlas',
    eyebrow: 'Turkey Map React · Geography data',
    title: 'Regions, neighbours and centroids',
    description: 'Use the built-in geography fields directly: colour by region, draw centroid markers, highlight land neighbours and inspect area, population and official codes.',
    source: 'Feature: CityType region, centroid, neighbors, areaKm2, population, isoCode, nutsCode and altNames',
    component: GeographyScenario,
  },
  {
    id: 'geojson',
    label: 'GeoJSON workshop',
    eyebrow: 'Turkey Map React · GeoJSON',
    title: 'From coordinates to clickable provinces',
    description: 'Convert a checked-in FeatureCollection with geoJsonToCities. Switch key mappings, projection, padding and precision, then render the generated paths through the core entry.',
    source: 'Feature: geoJsonToCities and the turkey-map-react/geojson entry point',
    component: GeojsonScenario,
  },
];
