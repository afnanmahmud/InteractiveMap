const apiKey = '5b3ce3597851110001cf6248a1d686e75cef4e86a9782464ccdb71cf'; 
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
        center: ol.proj.fromLonLat([-84.5816, 34.0381]), 
        zoom: 16.5
      })
    });
    document.getElementById('find-route').addEventListener('click', function() {
      if (startCoords && endCoords) {
        getRoute(startCoords, endCoords); 
      } else {
        alert("Please enter both start and end locations.");
      }
    });

    
    function geocodeLocation(query) {
      return fetch(`${geocodeApiUrl}?api_key=${apiKey}&text=${query}`)
        .then(response => response.json())
        .then(data => {
          if (data.features && data.features.length > 0) {
            const coords = data.features[0].geometry.coordinates;
            return coords; 
          } else {
            alert("Location not found.");
            return null;
          }
        })
        .catch(error => {
          console.error("Error during geocoding:", error);
        });
    }
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
          const routeGeoJson = data.features[0]; 
          displayRoute(routeGeoJson);
        }
      })
      .catch(error => {
        console.error('Error fetching route:', error);
      });
    }
    function displayRoute(routeGeoJson) {
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
            color: '#FF0000',  
            width: 4
          })
        })
      });

      map.addLayer(vectorLayer);
      const routeExtent = vectorSource.getExtent();
      map.getView().fit(routeExtent, { size: map.getSize(), padding: [50, 50, 50, 50] });
    }
    document.getElementById('start').addEventListener('change', function() {
      const query = this.value;
      geocodeLocation(query).then(coords => {
        if (coords) {
          startCoords = coords;
          map.getView().setCenter(ol.proj.fromLonLat(startCoords)); 
        }
      });
    });
    document.getElementById('end').addEventListener('change', function() {
      const query = this.value;
      geocodeLocation(query).then(coords => {
        if (coords) {
          endCoords = coords;
        }
      });
    });
