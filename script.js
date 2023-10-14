const earthquakeForm = document.getElementById("earthquakeForm");
const countResult = document.getElementById("countResult");
const earthquakeInfo = []; // Create an array to store earthquake info

earthquakeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  earthquakeInfo.length = 0; // Remove previous data if any
  const city = document.getElementById("city").value;
  const radius = document.getElementById("radius").value;
  const startYear = document.getElementById("startYear").value;
  const endYear = document.getElementById("endYear").value;

  // Construct the date range using start and end years
  const startDate = `${startYear}-01-01T00:00:00`;
  const endDate = `${endYear}-12-31T23:59:59`;
    const geoUrl = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${city}&format=jsonv2&limit=1`;

  const existingTable = document.getElementById("earthquakeTable");
  if (existingTable) {
    existingTable.remove();
  }

  // Fetch Geo Data
  console.log(city);

  function getLatitude() {
    return fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {
        // Access the lat parameter from the first result in the response
        const lat = data[0].lat;
        return lat;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  function getLongitude() {
    return fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {
        // Access the lat parameter from the first result in the response
        const lon = data[0].lon;
        return lon;
      })
      .catch((error) => {
        console.error(error);
        throw error;
      });
  }

  getLatitude()
    .then((lat) => {
      console.log("Latitude:", lat);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  getLongitude()
    .then((lon) => {
      console.log("Longitude:", lon);
    })
    .catch((error) => {
      console.error("Error:", error);
    });

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

  // Fetch Earthquake Data

    try {
        // Await  fetching latitude and longitude from geoAPI
        const latitude = await getLatitude();
        const longitude = await getLongitude();
        // Fetching earthquake data using apiUrl
        const apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}&starttime=${startDate}&endtime=${endDate}&format=geojson`;
        const response = await fetch(apiUrl);
        if (response.ok) {
            const data = await response.json();
            console.log(data)
            const earthquakes = data.features; // Array of earthquake data

            // Get the total number of earthquakes
            const totalEarthquakes = earthquakes.length;

            // Store earthquake information in the earthquakeInfo array
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

            // Display the total number of earthquakes
            countResult.innerHTML = `
                <p>Total Earthquakes: ${totalEarthquakes} </p>
            `;
      const table = generateTable(earthquakeInfo);
      table.id = "earthquakeTable";
      document.body.appendChild(table);
    } else {
      countResult.textContent = "Error fetching data.";
    }
  } catch (error) {
    countResult.textContent = "An error occurred.";
  }
  console.log(earthquakeInfo);
});
