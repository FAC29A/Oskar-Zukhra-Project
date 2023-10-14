const earthquakeForm = document.getElementById("earthquakeForm");
const countResult = document.getElementById("countResult");
const earthquakeInfo = []; // Create an array to store earthquake info


earthquakeForm.addEventListener("submit", async function (e) {
  e.preventDefault();

  const city = document.getElementById("city").value;
  const radius = document.getElementById("radius").value;
  const startYear = document.getElementById("startYear").value;
  const endYear = document.getElementById("endYear").value;

  // Construct the date range using start and end years
  const startDate = `${startYear}-01-01T00:00:00`;
  const endDate = `${endYear}-12-31T23:59:59`;
    const geoUrl = `https://nominatim.openstreetmap.org/search?addressdetails=1&q=${city}&format=jsonv2&limit=1`;

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
        } else {
            countResult.textContent = "Error fetching data.";
        }
    } catch (error) {
        countResult.textContent = "An error occurred.";
    }
    console.log(earthquakeInfo)
});

