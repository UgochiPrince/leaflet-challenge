// Create a map centered on a specific location (e.g., San Francisco)
const map = L.map("map").setView([37.7749, -122.4194], 8.3);

// Add a tile layer (e.g., OpenStreetMap) to the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

// Fetch earthquake data from the USGS GeoJSON URL
const url =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"; // Replace with the URL of the GeoJSON dataset
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    // Process the data and create markers for earthquakes
    data.features.forEach((earthquake) => {
      const coordinates = earthquake.geometry.coordinates;
      const magnitude = earthquake.properties.mag;
      const depth = coordinates[2];

      // Calculate marker size based on magnitude (adjust the scaling factor as needed)
      const markerSize = magnitude * 3;

      // Calculate marker color based on depth (adjust the color scale as needed)
      const markerColor = `hsl(240, 100%, ${100 - depth * 6}%)`;

      // Create a marker with popup
      const marker = L.circleMarker([coordinates[1], coordinates[0]], {
        radius: markerSize,
        fillColor: markerColor,
        color: "gray",
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7,
      });

      marker.bindPopup(
        `<strong>Magnitude:</strong> ${magnitude}<br><strong>Depth:</strong> ${depth} km`
      );

      // Add the marker to the map
      marker.addTo(map);
    });

    // Create a legend
    const legend = L.control({ position: "bottomright" });

    legend.onAdd = () => {
      const div = L.DomUtil.create("div", "info legend");
      const depthValues = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90];
      const labels = [];
      const colors = [];

      // Loop through depth values and create a label for each range
      for (let i = 0; i < depthValues.length; i++) {
        const from = depthValues[i];
        const to = depthValues[i + 1];
        const color = `hsl(240, 100%, ${100 - from * 3}%)`;

        labels.push(
          `<i style="background:${color}"></i> ${from}${
            to ? `&ndash;${to}` : "+"
          } km`
        );
      }

      div.innerHTML = labels.join("<br>");
      return div;
    };

    legend.addTo(map);
  })
  .catch((error) => {
    console.error("Error fetching earthquake data:", error);
  });
