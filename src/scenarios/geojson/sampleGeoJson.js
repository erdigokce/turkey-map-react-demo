/**
 * Small synthetic GeoJSON fixture for the GeoJSON workshop.
 *
 * Coordinates are longitude/latitude and deliberately simplified. Every usable
 * feature carries both the default property names and a custom set, so the demo
 * can switch key mappings without dropping features.
 */
const sampleGeoJson = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        id: 'marmara',
        name: 'Marmara',
        plateNumber: 34,
        ADM1_CODE: 'TR-MARMARA',
        NAME_1: 'Marmara',
        PLATE: 34,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [26.0, 40.0],
          [30.5, 40.0],
          [30.5, 42.1],
          [26.0, 42.1],
          [26.0, 40.0],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'ege',
        name: 'Ege',
        plateNumber: 35,
        ADM1_CODE: 'TR-EGE',
        NAME_1: 'Ege',
        PLATE: 35,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [26.1, 37.0],
          [30.2, 37.0],
          [30.2, 39.9],
          [26.1, 39.9],
          [26.1, 37.0],
        ]],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'ic-anadolu',
        name: 'İç Anadolu',
        plateNumber: 6,
        ADM1_CODE: 'TR-IC-ANADOLU',
        NAME_1: 'İç Anadolu',
        PLATE: 6,
      },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          [[
            [30.6, 38.8],
            [35.0, 38.8],
            [35.0, 41.1],
            [30.6, 41.1],
            [30.6, 38.8],
          ]],
          [[
            [35.4, 39.4],
            [36.8, 39.4],
            [36.8, 40.5],
            [35.4, 40.5],
            [35.4, 39.4],
          ]],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'dogu-anadolu',
        name: 'Doğu Anadolu',
        plateNumber: 25,
        ADM1_CODE: 'TR-DOGU-ANADOLU',
        NAME_1: 'Doğu Anadolu',
        PLATE: 25,
      },
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [37.0, 37.8],
            [43.2, 37.8],
            [43.2, 41.2],
            [37.0, 41.2],
            [37.0, 37.8],
          ],
          [
            [39.2, 39.0],
            [40.6, 39.0],
            [40.6, 40.0],
            [39.2, 40.0],
            [39.2, 39.0],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {
        id: 'unsupported-point',
        name: 'Unsupported point',
        plateNumber: 0,
        ADM1_CODE: 'TR-POINT',
        NAME_1: 'Unsupported point',
        PLATE: 0,
      },
      geometry: {
        type: 'Point',
        coordinates: [34.0, 39.0],
      },
    },
  ],
};

export default sampleGeoJson;
