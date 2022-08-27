/* eslint-disable no-param-reassign */
import React, { useEffect, useState } from 'react';
import './App.css';
import TurkeyMap from 'turkey-map-react';
import { getCandidates, getElectionCities, getElectionResultsOfCity } from './api';
import { handleElectionResult } from './service/election-result-service';

const electionId = 49302;

function App() {
  const [electionCities, setElectionCities] = useState([]);
  const [electionResults, setElectionResults] = useState({});
  const [selectedCity, setSelectedCity] = useState();

  useEffect(() => {
    getElectionCities({ electionId }).then((resultCities) => {
      setElectionCities(resultCities.map((city) => ({ cityId: city.il_ID, electionCircleId: city.secim_CEVRESI_ID })));
    });
  }, []);

  const handleCityClick = ({ plateNumber }) => {
    const electionCity = electionCities.find((c) => c.cityId === plateNumber);
    if (electionCity) {
      const requestObject = { electionId, cityId: plateNumber, electionCircleId: electionCity.electionCircleId };
      getElectionResultsOfCity(requestObject).then((results) => {
        getCandidates(requestObject).then((candidates) => {
          setElectionResults({
            ...electionResults,
            [plateNumber]: handleElectionResult(results, candidates),
          });
          setSelectedCity(plateNumber);
        });
      });
    }
  };

  const renderCity = (cityComponent, city) => {
    const isElectionCity = electionCities.find((c) => c.cityId === city.plateNumber);
    cityComponent.props.key = city.id;
    cityComponent.props['data-is-election-city'] = !!isElectionCity;
    return (cityComponent);
  };

  const citySummary = selectedCity && electionResults[selectedCity].reduce((acc, total) => {
    total.voteCount += acc.voteCount;
    total.electorCount += acc.electorCount;
    total.totalIndependentVotes += acc.totalIndependentVotes;
    total.totalValidVotes += acc.totalValidVotes;
    total.totalInvalidVotes += acc.totalInvalidVotes;
    return total;
  }, {
    voteCount: 0,
    electorCount: 0,
    totalIndependentVotes: 0,
    totalValidVotes: 0,
    totalInvalidVotes: 0,
  });
  return (
    <div className="App">
      <h1>31st of March, 2019 - MUNICIPAL ELECTIONS of TURKEY</h1>
      <TurkeyMap showTooltip onClick={handleCityClick} cityWrapper={renderCity} />
      {citySummary && (
      <table border={1}>
        <thead style={{ backgroundColor: 'aqua' }}>
          <th>County</th>
          <th>Elector Count</th>
          <th>Total Independent Votes</th>
          <th>Total Invalid Votes</th>
          <th>Total Valid Votes</th>
          <th>Vote Count</th>
        </thead>
        <tbody>
          <tr style={{ backgroundColor: 'darkgray', color: 'white' }}>
            <td>Total</td>
            <td>{citySummary.electorCount}</td>
            <td>{citySummary.totalIndependentVotes}</td>
            <td>{citySummary.totalInvalidVotes}</td>
            <td>{citySummary.totalValidVotes}</td>
            <td>{citySummary.voteCount}</td>
          </tr>
          {selectedCity && electionResults[selectedCity].map((result) => (
            <tr key={result.county}>
              <td>{result.county}</td>
              <td>{result.electorCount}</td>
              <td>{result.totalIndependentVotes}</td>
              <td>{result.totalInvalidVotes}</td>
              <td>{result.totalValidVotes}</td>
              <td>{result.voteCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}

export default App;
