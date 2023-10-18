const earthquakeForm = document.getElementById("earthquakeForm");
const countResult = document.getElementById("countResult");
const earthquakeInfo = [];
const loader = document.getElementById("loader");
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
async function fetchEarthquakeData(
  latitude,
  longitude,
  radius,
  startDate,
  endDate
) {
  const apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}&starttime=${startDate}&endtime=${endDate}&format=geojson`;
  const data = await fetchData(apiUrl);
  console.log(data);
  return data.features;
}

// Function to dynamiclly generate and populate the table
function generateTable(data) {
  const table = document.createElement("table");
  const headers = ["#", "Place", "Magnitude", "Date"];

  // Check if there is data to display
  if (data.length > 0) {

    // Create table headers
    const headerRow = document.createElement("tr");
    headers.forEach((headerText, index) => {
      const header = document.createElement("th");
      header.textContent = headerText;
      // Add ID to the "Magnitude" header
      if (index === 2) {
        header.id = "magnitudeHeader";
      }

      headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
  }

  // Create table rows with earthquake information
  data.forEach((earthquake, index) => {
    const row = document.createElement("tr");

    // Add index in the first column
    const indexCell = document.createElement("td");
    indexCell.textContent = index + 1;
    row.appendChild(indexCell);

    // Extract attributes from the earthquake object
    const attributes = ["place", "magnitude", "date"];
    attributes.forEach((attribute) => {
      const cell = document.createElement("td");
      let value = earthquake;
      attribute.split(".").forEach((key) => {
        value = value[key];
      });

      // Format date and time
      if (attribute === "date") {
        const formattedDate = new Date(value).toLocaleString("en-GB", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
        cell.textContent = formattedDate;
      } else {
        // Check if the value is null, if so, display "data not available"
        cell.textContent = value !== null ? value : "data not available";
      }
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

  loader.style.display = "block";

  try {
    const result = await fetchGeoData(city);
    const latitude = result.latitude;
    const longitude = result.longitude;
    console.log(latitude, longitude);
    const startDate = `${startYear}-01-01T00:00:00`;
    const endDate = `${endYear}-12-31T23:59:59`;

    const earthquakes = await fetchEarthquakeData(
      latitude,
      longitude,
      radius,
      startDate,
      endDate
    );

    // Get the total number of earthquakes
    const totalEarthquakes = earthquakes.length;
    const tableElement = document.getElementById("tableElement");

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
    displayEarthquakeMessage(totalEarthquakes, radius, city);

    // If a table has been previously created, remove it
    if (tableCreated) {
      const existingTable = document.getElementById("earthquakeTable");
      if (existingTable) {
        existingTable.remove();
      }
    }

    loader.style.display = "none";

    // Generate and display the earthquake info table on the page
    const table = generateTable(earthquakeInfo);
    table.id = "earthquakeTable";
    tableElement.appendChild(table);
    tableCreated = true;

    // Attach event listeners and setting sorting arrows to the Magnitude header.
    attachSortingEvents()

  } catch (error) {
    loader.style.display = "none";
    countResult.textContent = "An error occurred";
    console.error("Error:", error);
  }
});

// Attach event listeners and setting sorting arrows to the Magnitude header.
function attachSortingEvents() {
  const magnitudeHeader = document.getElementById("magnitudeHeader");

  //Avoid errors when the table is empty and the header row is not displayed
  if (magnitudeHeader) {
    // Store the original text in a data attribute
    magnitudeHeader.setAttribute("data-original-text", "Magnitude");

    // Display both ascending (▲) and descending (▼) sorting symbols
    setSortArrow(magnitudeHeader, 0); // 0 represents no sorting direction

    // Add event listeners to the specific headers for sorting
    magnitudeHeader.addEventListener("click", () => {
      sortTable(2); // Sort by Magnitude
      setSortArrow(magnitudeHeader, sortDirections[2]);
    });
  }
}

// Keep track of sorting direction for each column
const sortDirections = {
  2: 1, // Default for column 2 ("Magnitude"); 1 represents ascending order
};

// Function to set the content for the sorting arrows
function setSortArrow(element, direction) {
  if (element) {
    const originalText = element.getAttribute("data-original-text");
    if (direction === 0) {
      element.textContent = `${originalText} ▲ ▼`; // Display both ▲ and ▼
    } else if (direction === 1) {
      element.textContent = `${originalText} ▲`; // Up arrow
    } else {
      element.textContent = `${originalText} ▼`; // Down arrow
    }
  }
}

// Function to sort the table
function sortTable(column) {
  const table = document.getElementById("earthquakeTable");
  const rows = Array.from(table.rows).slice(1); // Skip the header row

  rows.sort((a, b) => {
    const aValue = a.cells[column].textContent;
    const bValue = b.cells[column].textContent;

    // Determine the sorting order based on the column and direction
    const order = sortDirections[column];

    // Compare as strings
    return aValue.localeCompare(bValue) * order;

  });

  // Toggle the sorting direction for the current column
  sortDirections[column] *= -1;

  // Clear the table and re-append rows in the sorted order
  while (table.rows.length > 1) {
    table.deleteRow(1);
  }

  rows.forEach((row) => {
    table.appendChild(row);
  });
}

// Display a message based on the total number of earthquakes found within a given radius of a city
function displayEarthquakeMessage(totalEarthquakes, radius, city) {
  if (totalEarthquakes > 0) {
    countResult.innerHTML = `
      <p>${totalEarthquakes} earthquakes were found within ${radius}km of ${city}.</p>
    `;
  } else {
    countResult.innerHTML = `
      <p>No earthquakes were found within ${radius}km of ${city}.</p>
      <p>Try increasing the search radius or changing the time period.</p>
    `;
  }
}