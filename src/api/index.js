/* eslint-disable no-return-await,max-len */
const endpoint = 'https://sonuc.ysk.gov.tr/api';

const headers = {
  accept: 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.9,tr-TR;q=0.8,tr;q=0.7',
  'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="101", "Opera";v="87"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"macOS"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-origin',
};

const init = {
  headers,
  referrer: 'https://sonuc.ysk.gov.tr/sorgu',
  referrerPolicy: 'strict-origin-when-cross-origin',
  body: null,
  method: 'GET',
  mode: 'cors',
};

export const getElectionCities = async ({ electionId }) => await fetch(`${endpoint}/getIlList?secimId=${electionId}&secimTuru=6&sandikTuru=-1&yurtIciDisi=1`, init)
  .then((res) => res.json());

export const getElectionResultsOfCity = async ({ electionId, electionCircleId, cityId }) => await fetch(`${endpoint}/getSecimSandikSonucList?secimId=${electionId}&secimTuru=6&ilId=${cityId}&ilceId=0&beldeId=0&birimId=&muhtarlikId=&cezaeviId=&sandikTuru=&sandikNoIlk=&sandikNoSon=&ulkeId=0&disTemsilcilikId=0&gumrukId=&yurtIciDisi=1&sandikRumuzIlk=&sandikRumuzSon=&secimCevresiId=${electionCircleId}&sandikId=&sorguTuru=1`, init)
  .then((res) => res.json());

export const getCandidates = async ({ electionId, electionCircleId, cityId }) => await fetch(`${endpoint}/getSandikSecimSonucBaslikList?secimId=${electionId}&secimCevresiId=${electionCircleId}&ilId=${cityId}&bagimsiz=1&secimTuru=6&yurtIciDisi=1`, init)
  .then((res) => res.json());
