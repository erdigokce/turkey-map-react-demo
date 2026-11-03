import populationData from '../data/population.json';

const populationByPlate = new Map(
  populationData.map((city) => [Number(city.plate), city]),
);

export const formatNumber = (value) => (
  typeof value === 'number' ? new Intl.NumberFormat('tr-TR').format(value) : '—'
);

export const getPopulationRecord = (city) => (
  city ? populationByPlate.get(Number(city.plateNumber)) : undefined
);

export const getPopulation = (city) => getPopulationRecord(city)?.population;

export const getPopulationByPlate = (plate) => populationByPlate.get(Number(plate))?.population;
