export const REGIONS = [
  {
    id: 'marmara',
    name: 'Marmara',
    color: '#2563eb',
    plates: [10, 11, 16, 17, 22, 34, 39, 41, 54, 59, 77],
  },
  {
    id: 'ege',
    name: 'Ege',
    color: '#0d9488',
    plates: [3, 9, 20, 35, 43, 45, 48, 64],
  },
  {
    id: 'akdeniz',
    name: 'Akdeniz',
    color: '#ea580c',
    plates: [1, 7, 15, 31, 32, 33, 46, 70, 80],
  },
  {
    id: 'ic-anadolu',
    name: 'İç Anadolu',
    color: '#ca8a04',
    plates: [6, 18, 26, 38, 40, 42, 50, 51, 58, 66, 68, 71],
  },
  {
    id: 'karadeniz',
    name: 'Karadeniz',
    color: '#16a34a',
    plates: [5, 8, 14, 19, 28, 29, 37, 52, 53, 55, 57, 60, 61, 67, 69, 74, 78, 81],
  },
  {
    id: 'dogu-anadolu',
    name: 'Doğu Anadolu',
    color: '#7c3aed',
    plates: [4, 12, 13, 23, 24, 25, 30, 36, 44, 49, 62, 65, 75, 76],
  },
  {
    id: 'guneydogu-anadolu',
    name: 'Güneydoğu Anadolu',
    color: '#be123c',
    plates: [2, 21, 27, 47, 56, 63, 72, 73, 79],
  },
];

export const REGION_BY_PLATE = new Map(
  REGIONS.flatMap((region) => region.plates.map((plate) => [plate, region])),
);

export const buildRegionCities = (cities) => {
  const cityByPlate = new Map(cities.map((city) => [Number(city.plateNumber), city]));

  return REGIONS.map((region, index) => ({
    id: region.id,
    plateNumber: index + 1,
    name: region.name,
    path: region.plates
      .map((plate) => cityByPlate.get(plate)?.path)
      .filter(Boolean)
      .join(' '),
  }));
};
