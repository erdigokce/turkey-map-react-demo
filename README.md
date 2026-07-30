# Map Demo

This project is a React application that visualizes demographic data for Turkey through interactive heatmaps. It includes two main features: a Turkey Population Heatmap and a Turkey Unemployment Rate Heatmap. Users can switch between these two visualizations using a tab layout.

## Project Structure

```
turkey-map-react-demo
├── public
│   ├── index.html          # Main HTML file for the application
│   └── favicon.ico         # Favicon for the application
├── src
│   ├── components
│   │   ├── Heatmap
│   │   │   ├── TurkeyPopulationHeatmap.js  # Component for Population Heatmap
│   │   │   └── TurkeyUnemploymentHeatmap.js # Component for Unemployment Rate Heatmap
│   │   └── TabLayout.js    # Component for tab layout
│   ├── data
│   │   ├── population.json  # Population data for cities
│   │   └── unemployment.json # Unemployment data for cities
│   ├── App.css             # CSS styles for the application
│   ├── App.js              # Main application component
│   ├── index.css           # Global CSS styles
│   └── index.js            # Entry point for the React application
├── package.json            # npm configuration file
├── .gitignore              # Git ignore file
└── README.md               # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd my-react-app
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the application:**
   ```
   npm start
   ```

4. **Open your browser:**
   Navigate to `http://localhost:3000` to view the application.

## Usage

- Use the tabs on the left side of the application to switch between the Turkey Population Heatmap and the Turkey Unemployment Rate Heatmap.
- Hover over the cities on the heatmaps to view detailed information about the population or unemployment rate.

## Testing Local Changes in turkey-map-react

If you have local changes in the sibling `turkey-map-react` repo and want to test them in this demo before publishing, use `npm pack`:

```bash
# 1. Build the library
cd ../turkey-map-react
npm run build

# 2. Pack it into a tarball
npm pack --pack-destination ../turkey-map-react-demo

# 3. Install the local tarball in the demo
cd ../turkey-map-react-demo
npm install ./turkey-map-react-2.0.5.tgz

# 4. Run the demo
npm run dev
```

Alternatively, use `npm link`:

```bash
# 1. Build and register the library
cd ../turkey-map-react
npm run build
npm link

# 2. Link it in the demo
cd ../turkey-map-react-demo
npm link turkey-map-react

# 3. Run the demo
npm run dev
```

To revert to the published version:

```bash
cd ../turkey-map-react-demo
npm unlink turkey-map-react
npm install turkey-map-react
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License.