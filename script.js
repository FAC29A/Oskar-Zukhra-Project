const earthquakeForm = document.getElementById("earthquakeForm");
const countResult = document.getElementById("countResult");
const earthquakeInfo = [];
let tableCreated = false;

// Function to fetch data from a given URL and return it as JSON
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.json();
    } else {
      throw new Error("Error fetching data.");
    }
  } catch (error) {
    throw error;
  }
}

// Function to fetch latitude and longitude based on the city
async function fetchGeoData(city) {
  console.log(city);
  const geoUrl = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${city}&format=jsonv2&limit=1`;
  const data = await fetchData(geoUrl);
  return {
    latitude: data[0].lat,
    longitude: data[0].lon,
  };
}

// Function to fetch earthquake data
async function fetchEarthquakeData(latitude, longitude, radius, startDate, endDate) {
  const apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}&starttime=${startDate}&endtime=${endDate}&format=geojson`;
  const data = await fetchData(apiUrl);
  console.log(data);
  return data.features;
}

// Function to dynamiclly generate and populate the table
function generateTable(data) {
  const table = document.createElement("table");
  const headers = ["Place", "Magnitude", "Date"];

  // Create table headers
  const headerRow = document.createElement("tr");
  headers.forEach((headerText) => {
    const header = document.createElement("th");
    header.textContent = headerText;
    headerRow.appendChild(header);
  });
  table.appendChild(headerRow);

  // Create table rows with earthquake information
  data.forEach((earthquake) => {
    const row = document.createElement("tr");

    // Extract attributes from the earthquake object
    const attributes = ["place", "magnitude", "date"];
    attributes.forEach((attribute) => {
      const cell = document.createElement("td");
      let value = earthquake;
      attribute.split(".").forEach((key) => {
        value = value[key];
      });
      cell.textContent = value;
      row.appendChild(cell);
    });

    table.appendChild(row);
  });

  return table;
}

// Function to handle form submission
earthquakeForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  const city = document.getElementById("city").value;
  const radius = document.getElementById("radius").value;
  const startYear = document.getElementById("startYear").value;
  const endYear = document.getElementById("endYear").value;

  try {
    const result = await fetchGeoData(city);
    const latitude = result.latitude;
    const longitude = result.longitude;
    console.log(latitude, longitude);
    const startDate = `${startYear}-01-01T00:00:00`;
    const endDate = `${endYear}-12-31T23:59:59`;

    const earthquakes = await fetchEarthquakeData(latitude, longitude, radius, startDate, endDate);

    // Get the total number of earthquakes
    const totalEarthquakes = earthquakes.length;

    // Store earthquake information in the earthquakeInfo array
    earthquakeInfo.length = 0; // Clear the array
    earthquakes.forEach((earthquake) => {
      const info = {
        place: earthquake.properties.place,
        magnitude: earthquake.properties.mag,
        date: new Date(earthquake.properties.time),
        coordinates: {
          latitude: earthquake.geometry.coordinates[1],
          longitude: earthquake.geometry.coordinates[0],
        },
      };
      earthquakeInfo.push(info);
    });
    console.log(earthquakeInfo);

    // Display the total number of earthquakes
    countResult.innerHTML = `
      <p>Total Earthquakes: ${totalEarthquakes} </p>
    `;

    // If a table has been previously created, remove it
    if (tableCreated) {
      const existingTable = document.getElementById("earthquakeTable");
      if (existingTable) {
        existingTable.remove();
      }
    }

    // Generate and display the earthquake info table on the page
    const table = generateTable(earthquakeInfo);
    table.id = "earthquakeTable";
    document.body.appendChild(table);
    tableCreated = true;

  } catch (error) {
    countResult.textContent = "An error occurred.";
    console.error("Error:", error);
  }
});

