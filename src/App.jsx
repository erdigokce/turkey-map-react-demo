import React, { useState } from 'react';
import './App.css';
import ScenarioPage from './components/ScenarioPage';
import { SCENARIOS } from './scenarios';

function App() {
  const [activeScenarioId, setActiveScenarioId] = useState(SCENARIOS[0].id);

  const scenario = SCENARIOS.find(({ id }) => id === activeScenarioId) || SCENARIOS[0];
  const ScenarioComponent = scenario.component;

  return (
    <div className="App">
      <ScenarioPage
        scenario={scenario}
        scenarios={SCENARIOS}
        onScenarioChange={setActiveScenarioId}
      >
        <ScenarioComponent />
      </ScenarioPage>
    </div>
  );
}

export default App;
