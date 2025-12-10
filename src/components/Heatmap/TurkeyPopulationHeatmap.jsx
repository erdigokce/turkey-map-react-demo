import React, { useState } from 'react';
import TurkeyMap from 'turkey-map-react';
import populationData from '../../data/population.json';

function TurkeyPopulationHeatmap() {
  const [hoveredCity, setHoveredCity] = useState(null);
  const maxPopulation = Math.max(...populationData.map((city) => city.population));

  const getColor = (population) => {
    const normalized = population / maxPopulation;
    const blue = Math.round(normalized * 255);
    return `rgb(173, 216, ${255 - blue})`;
  };

  const getHoverColor = (color) => {
    const [r, g, b] = color.match(/\d+/g).map(Number);
    return `rgb(${Math.min(r + 30, 255)}, ${Math.min(g + 30, 255)}, ${Math.min(b + 30, 255)})`;
  };

  const getCityInfo = (plate) => populationData.find((city) => city.plate === plate);

  return (
    <div>
      <h2>Turkey Population Heatmap</h2>
      <TurkeyMap
        customStyle={{ idleColor: '#e0e0e0', hoverColor: '#e0e0e0' }}
        hoverable
        cityWrapper={(cityComponent, city) => {
          const cityInfo = getCityInfo(city.plateNumber);
          const color = cityInfo ? getColor(cityInfo.population) : '#e0e0e0';
          const hoverColor = cityInfo && hoveredCity && hoveredCity.plate === city.plateNumber
            ? getHoverColor(color)
            : color;
          const { children } = cityComponent.props;
          if (children) {
            // If there's a single child element
            if (React.isValidElement(children)) {
              const child = children;
              const style = { ...(child.props && child.props.style), fill: hoverColor };
              const newChild = React.cloneElement(child, { style });
              return React.cloneElement(cityComponent, {}, newChild);
            }

            // If children is an array-like structure, map safely
            if (Array.isArray(children)) {
              const newChildren = children.map((child) => (
                React.isValidElement(child) ? React.cloneElement(child, { style: { ...(child.props && child.props.style), fill: hoverColor } }) : child
              ));
              return React.cloneElement(cityComponent, {}, ...newChildren);
            }
          }
          return cityComponent;
        }}
        onHover={(city) => {
          const cityInfo = getCityInfo(city.plateNumber);
          if (cityInfo) {
            const color = getColor(cityInfo.population);
            const hoverColor = getHoverColor(color);
            setHoveredCity({ ...cityInfo, hoverColor });
          } else {
            setHoveredCity(null);
          }
        }}
      />
      {hoveredCity && (
      <div className="hover-info">
        <p>
          <strong>{hoveredCity.name}</strong>
          :
          {hoveredCity.population}
          {' '}
          people
        </p>
      </div>
      )}
    </div>
  );
}

export default TurkeyPopulationHeatmap;
