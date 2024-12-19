import React, { useState } from 'react';
import TurkeyPopulationHeatmap from './Heatmap/TurkeyPopulationHeatmap';

function TabLayout() {
  const [activeTab, setActiveTab] = useState('population');

  const renderHeatmap = () => {
    switch (activeTab) {
      case 'population':
        return <TurkeyPopulationHeatmap />;
      default:
        return null;
    }
  };

  return (
    <div className="tab-layout">
      <div className="tabs">
        <button type="button" onClick={() => setActiveTab('population')} className={activeTab === 'population' ? 'active' : ''} hidden>
          Turkey Population Heatmap
        </button>
      </div>
      <div className="heatmap-container">
        {renderHeatmap()}
      </div>
    </div>
  );
}

export default TabLayout;
