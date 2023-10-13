const earthquakeForm = document.getElementById("earthquakeForm");
const countResult = document.getElementById("countResult");
const earthquakeInfo = []; // Create an array to store earthquake info


earthquakeForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;
    const radius = document.getElementById("radius").value;
    const startYear = document.getElementById("startYear").value;
    const endYear = document.getElementById("endYear").value;

    // Construct the date range using start and end years
    const startDate = `${startYear}-01-01T00:00:00`;
    const endDate = `${endYear}-12-31T23:59:59`;

    const apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?latitude=${latitude}&longitude=${longitude}&maxradiuskm=${radius}&starttime=${startDate}&endtime=${endDate}&format=geojson`;

    try {
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

