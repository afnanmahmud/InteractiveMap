const apiKey = '5b3ce3597851110001cf6248a1d686e75cef4e86a9782464ccdb71cf'; // Replace with your OpenRouteService API key
const orsApiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car/geojson';
const geocodeApiUrl = 'https://api.openrouteservice.org/geocode/search';

let startCoords = null;
let endCoords = null;

var map = new ol.Map({
  target: 'map',
  layers: [
    new ol.layer.Tile({
      source: new ol.source.OSM()
    })
  ],
  view: new ol.View({
    center: ol.proj.fromLonLat([37.41, 8.82]),
    zoom: 16.5
  })
});
const userVectorSource = new ol.source.Vector();
const userVectorLayer = new ol.layer.Vector({
  source: userVectorSource
});
map.addLayer(userVectorLayer); // Add it once

function trackUserLocation() {
  const geolocation = new ol.Geolocation({
    tracking: true,  // Enable continuous tracking
    projection: map.getView().getProjection()
  });

  geolocation.on('change:position', function () {
    const userCoords = geolocation.getPosition();
    if (userCoords) {
      const lonLat = ol.proj.toLonLat(userCoords); // Convert to longitude & latitude
      console.log("User location:", lonLat);

      // Update the user marker
      updateUserMarker(lonLat);

      // Center the map on the user's location (optional)
      map.getView().setCenter(userCoords);
    }
  });

  geolocation.on('error', function (error) {
    console.error('Geolocation error:', error.message);
    alert('Could not access location. Please enable location services.');
  });
}

// Function to update the user marker
function updateUserMarker(lonLat) {
  userVectorSource.clear(); // Remove previous marker

  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)),
    name: "You are here"
  });

  const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: 'https://cdn-icons-png.flaticon.com/128/884/884094.png', // User location icon
      scale: 0.2
    })
  });

  marker.setStyle(markerStyle);
  userVectorSource.addFeature(marker); // Add updated marker
}

// Start tracking user location
trackUserLocation();


// Handle search button click
document.getElementById('find-route').addEventListener('click', function() {
  if (endCoords) {
    getRoute(startCoords, endCoords); // Fetch route if both coordinates are set
  } else {
    alert("Please enter both start and end locations.");
  }
});

// Search for location using OpenRouteService Geocoding API
function geocodeLocation(query) {
  return fetch(`${geocodeApiUrl}?api_key=${apiKey}&text=${query}`)
    .then(response => response.json())
    .then(data => {
      if (data.features && data.features.length > 0) {
        const coords = data.features[0].geometry.coordinates;
        return coords; // Return the coordinates (longitude, latitude)
      } else {
        alert("Location not found.");
        return null;
      }
    })
    .catch(error => {
      console.error("Error during geocoding:", error);
    });
}

// Function to add a marker to the map
function addMarker(lonLat, label) {
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)),
    name: label
  });

  const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: 'https://cdn-icons-png.flaticon.com/128/9131/9131546.png', 
      scale: 0.2
      
    })
  });

  marker.setStyle(markerStyle);

  const vectorSource = new ol.source.Vector({
    features: [marker]
  });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  map.addLayer(vectorLayer);
}
function addMarker2(lonLat, label) {
  const marker = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat(lonLat)),
    name: label
  });

  const markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      src: 'https://cdn-icons-png.flaticon.com/128/7976/7976202.png',
      scale: 0.2
      
    })
  });

  marker.setStyle(markerStyle);

  const vectorSource = new ol.source.Vector({
    features: [marker]
  });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource
  });

  map.addLayer(vectorLayer);
}


// Function to get the route between start and end coordinates
function getRoute(startLonLat, endLonLat) {
  const payload = {
    coordinates: [startLonLat, endLonLat]
  };

  fetch(orsApiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': apiKey
    },
    body: JSON.stringify(payload)
  })
  .then(response => response.json())
  .then(data => {
    if (data.features && data.features.length > 0) {
      const routeGeoJson = data.features[0]; // The GeoJSON route data
      displayRoute(routeGeoJson);
    }
  })
  .catch(error => {
    console.error('Error fetching route:', error);
  });
}

// Display the route on the map using GeoJSON
function displayRoute(routeGeoJson) {
  // Clear previous route if there is one
  map.getLayers().forEach(layer => {
    if (layer instanceof ol.layer.Vector) {
      map.removeLayer(layer);
    }
  });

  const vectorSource = new ol.source.Vector({
    features: (new ol.format.GeoJSON()).readFeatures(routeGeoJson, {
      featureProjection: 'EPSG:3857'
    })
  });

  const vectorLayer = new ol.layer.Vector({
    source: vectorSource,
    style: new ol.style.Style({
      stroke: new ol.style.Stroke({
        color: '#0073e6',  // Red route
        width: 4
      })
    })
  });

  map.addLayer(vectorLayer);
  addMarker2(startCoords, 'Start');
  addMarker(endCoords, 'End');

  // Center the map on the route
  const routeExtent = vectorSource.getExtent();
  map.getView().fit(routeExtent, { size: map.getSize(), padding: [50, 50, 50, 50] });
}

// Set the coordinates for the start location after searching
document.getElementById('start').addEventListener('change', function() {
  const query = this.value;
  geocodeLocation(query).then(coords => {
    if (coords) {
      startCoords = coords;
      addMarker2(startCoords, 'Start');
      map.getView().setCenter(ol.proj.fromLonLat(startCoords));
    }
  });
});

// Set the coordinates for the end location after searching
document.getElementById('end').addEventListener('change', function() {
  const query = this.value;
  geocodeLocation(query).then(coords => {
    if (coords) {
      endCoords = coords;
      addMarker(endCoords, 'End');
      map.getView().setCenter(ol.proj.fromLonLat(endCoords));   
    }
  });
});
