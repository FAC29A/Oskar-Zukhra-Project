const earthquakeForm = document.getElementById("earthquakeForm");
const countResult = document.getElementById("countResult");
const earthquakeInfo = [];
const loader = document.getElementById("loader");
const form = document.getElementById("form-container");
let tableCreated = false;
const mapContainer = document.getElementById("map-container");
let map;
let marker;

// Function to fetch data from a given URL and return it as JSON
async function fetchData(url) {
  const response = await fetch(url);
  if (response.ok) {
    return await response.json();
  } else {
    throw new Error(
      "Oops, there was a problem fetching the data. Please check your connection and try again."
    );
  }
}

// Function to fetch latitude and longitude based on the city
async function fetchGeoData(city) {
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

      if (index === 1) {
        addIconToHeader(header, "fa-solid fa-map-location-dot", "black", "10px");
      }
      // Add ID to the "Magnitude" and the Date headers
      if (index === 2) {
        header.id = "magnitudeHeader";
      } else if (index === 3) {
        header.id = "dateHeader";
      }

      headerRow.appendChild(header);
    });
    table.appendChild(headerRow);
  }

  // Create table rows with earthquake information
  data.forEach((earthquake, index) => {
    const row = document.createElement("tr");
    row.setAttribute("index", index);
    row.classList.add("clickablePlace");

    // Add tabindex to make rows focusable
    row.setAttribute("tabindex", "0");
    // Add a keydown event listener for handling Enter key press
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        showMapForPlace(earthquake);
      }
    });

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
  form.classList.add("loading");

  try {
    const result = await fetchGeoData(city);
    const latitude = result.latitude;
    const longitude = result.longitude;
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
    form.classList.remove("loading");

    // Generate and display the earthquake info table on the page
    const table = generateTable(earthquakeInfo);
    table.id = "earthquakeTable";
    tableElement.appendChild(table);
    tableCreated = true;

    attachClickEventToPlaceRows();

    // Attach event listeners and setting sorting arrows to the Magnitude header.
    attachSortingEvents();
  } catch (error) {
    loader.style.display = "none";
    countResult.textContent =
      "Sorry, we encountered an issue while processing your request. Please try again later.";
  }
});

// Attach event listeners and setting sorting arrows to the Magnitude header.
function attachSortingEvents() {
  const magnitudeHeader = document.getElementById("magnitudeHeader");
  const dateHeader = document.getElementById("dateHeader");

  //Avoid errors when the table is empty and the header row is not displayed
  if (magnitudeHeader) {
    // Store the original text in a data attribute
    magnitudeHeader.setAttribute("data-original-text", "Magnitude");
    dateHeader.setAttribute("data-original-text", "Date");

    // Display both ascending (▲) and descending (▼) sorting symbols
    setSortArrow(magnitudeHeader, 0); // 0 represents no sorting direction
    setSortArrow(dateHeader, 0);

    // Add event listeners to the specific headers for sorting
    magnitudeHeader.addEventListener("click", () => {
      sortTable(2); // Sort by Magnitude
      setSortArrow(magnitudeHeader, sortDirections[2]);
    });

    dateHeader.addEventListener("click", () => {
      sortTable(3); // Sort by Date
      setSortArrow(dateHeader, sortDirections[3]);
    });
  }
}

// Keep track of sorting direction for each column
const sortDirections = {
  2: 1, // Default for column 2 ("Magnitude"); 1 represents ascending order
  3: 1, // Default for column 3 ("Date")
};

// Function to set the content for the sorting arrows
function setSortArrow(element, direction) {
  element.style.cursor = "pointer";
  if (element) {
    const originalText = element.getAttribute("data-original-text");
    if (direction === 0) {
      element.textContent = `${originalText} ▲▼`; // Display both ▲ and ▼
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

    if (column === 3) {
      // For the "Date" column, parse and compare as dates
      const aDate = parseCustomDate(aValue);
      const bDate = parseCustomDate(bValue);
      return (aDate - bDate) * order;
    } else {
      // For other columns, compare as strings
      return aValue.localeCompare(bValue) * order;
    }
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
  city = city.charAt(0).toUpperCase() + city.slice(1);
  const resultContainer = document.getElementById("result-container");
  resultContainer.style.display = "flex";

  if (totalEarthquakes > 0) {
    countResult.innerHTML = `
    <p>${totalEarthquakes} earthquake${totalEarthquakes > 1 ? "s" : ""} ${totalEarthquakes > 1 ? " were" : " was"} found within ${radius}km of ${city}.</p>
    <p class="message-color"> Click any row to view the location map. </p>
    `;
    collapseForm();
  } else {
    countResult.innerHTML = `
      <p>No earthquakes were found within ${radius}km of ${city}.</p>
      <p>Try increasing the search radius or changing the time period.</p>
    `;
  }
}

function attachClickEventToPlaceRows() {
  const clickablePlaceRows = document.querySelectorAll(".clickablePlace");
  clickablePlaceRows.forEach((row) => {
    row.style.cursor = "pointer";
    row.addEventListener("click", () => {
      // Extract the latitude and longitude from data attributes
      let earthquake = earthquakeInfo[row.getAttribute("index")]

      showMapForPlace(earthquake);
    });
  });
}

// Function to show the map for a specific place
function showMapForPlace(earthquake) {
  const mapContainer = document.getElementById("map-container");
  let coordinates = earthquake.coordinates;
  map = L.map("map").setView([coordinates.latitude, coordinates.longitude], 13);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  marker = L.marker([coordinates.latitude, coordinates.longitude]).addTo(map);
  marker
    .bindPopup(
      `Place: ${earthquake.place} <br>Magnitude: ${earthquake.magnitude}`
    )
    .openPopup();

  mapContainer.style.visibility = "visible";
  map.invalidateSize();
}

const closeMapButton = document.getElementById("close-button");
closeMapButton.addEventListener("click", function () {
  closeMap();
});


function closeMap() {
  mapContainer.style.visibility = "hidden";
  map.remove();
  marker.remove();
}

// Function to parse a date in the "dd/mm/yyyy, hh:mm" format
function parseCustomDate(dateString) {
  const parts = dateString.split(', ');
  if (parts.length === 2) {
    const [datePart, timePart] = parts;
    const [day, month, year] = datePart.split('/').map(Number);
    const [hour, minute] = timePart.split(':').map(Number);
    if (!isNaN(day) && !isNaN(month) && !isNaN(year) && !isNaN(hour) && !isNaN(minute)) {
      return new Date(year, month - 1, day, hour, minute);
    }
  }
  return null; // Return null if parsing fails
}
