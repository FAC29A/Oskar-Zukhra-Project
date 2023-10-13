const earthquakeForm = document.getElementById("earthquakeForm");
const countResult = document.getElementById("countResult");

earthquakeForm.addEventListener("submit", async function (e) {
    e.preventDefault();

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
            const earthquakes = data.features;

            // Initialize counts for different magnitude ranges
            let totalEarthquakes = 0;
            let smallMagnitudeCount = 0;
            let mediumMagnitudeCount = 0;
            let largeMagnitudeCount = 0;

            earthquakes.forEach((earthquake) => {
                const magnitude = earthquake.properties.mag;
                totalEarthquakes++;

                if (magnitude < 4) {
                    smallMagnitudeCount++;
                } else if (magnitude >= 4 && magnitude < 6) {
                    mediumMagnitudeCount++;
                } else {
                    largeMagnitudeCount++;
                }
            });

            // Display counts
            countResult.innerHTML = `
                        Total Earthquakes: ${totalEarthquakes}<br>
                        Earthquakes with Magnitude < 4: ${smallMagnitudeCount}<br>
                        Earthquakes with Magnitude 4-6: ${mediumMagnitudeCount}<br>
                        Earthquakes with Magnitude >= 6: ${largeMagnitudeCount}
                    `;
        } else {
            countResult.textContent = "Error fetching data.";
        }
    } catch (error) {
        countResult.textContent = "An error occurred.";
    }
});