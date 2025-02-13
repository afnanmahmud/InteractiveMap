// Coordinates for Kennesaw State University and Atlanta, GA
const kennesawCoords = [-84.58308, 34.0384]; 
const atlantaCoords = [-84.5196, 33.9380]; 

const map = new ol.Map({
  target: 'map', // The div where the map will be rendered
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM(),
    }),
    new ol.layer.Vector({
      source: new ol.source.Vector({
        features: [
          
          new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(kennesawCoords)), // Kennesaw
          }),
         
          new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.fromLonLat(atlantaCoords)), // Atlanta
          }),
          
          new ol.Feature({
            geometry: new ol.geom.LineString([
              ol.proj.fromLonLat(kennesawCoords),
              ol.proj.fromLonLat(atlantaCoords), 
            ]),
          }),
        ],
      }),
      style: new ol.style.Style({
        // Style for the route (line)
        stroke: new ol.style.Stroke({
          color: '#FF0000', // Red color for the route
          width: 2, // Line width
        }),
        image: new ol.style.Icon({
          anchor: [0.5, 1],
          src: 'https://maps.google.com/mapfiles/kml/paddle/red-blank.png', // Marker icon for both locations
        }),
      }),
    }),
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat(kennesawCoords), // Center on Kennesaw State University
    zoom: 10, // Zoom level to view both points and the route
  }),
});
