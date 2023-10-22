# Quake Finder

## Introduction

Welcome to the Quake Finder project! Quake Finder is an application designed to help users locate and retrieve information about earthquakes in their chosen areas. With this app, users can explore and access data from two different APIs, providing a global view of earthquake activity. The primary goal is to enable users to find earthquakes in their desired location based on parameters like city names,radius and specific time frames. The user is able to then see the tabulated data as well as click on a table row to see location marker on a map.

[Quake Finder deployment on GitHub Pages](https://fac29a.github.io/Oskar-Zukhra-Project/)

### Creators:

- [Oskar](https://github.com/oskarprzybylski23)
- [Zukhra](https://github.com/Zu18)

## APIs

- [USGS Earthquake Catalog API](https://earthquake.usgs.gov/fdsnws/event/1/)
- [Nominatim API](https://nominatim.org/release-docs/develop/api/Overview/)

## User Stories

### Core features

As a user, you will get:

1. **Access to Global Earthquake Data:** Quake Finder utilizes two distinct APIs. The first API, provided by the USGS, enables users to retrieve information about earthquakes worldwide based on latitude, longitude, period, radius, and other parameters. The second API is used to convert city names into latitude and longitude coordinates. Together, they offer a comprehensive view of earthquake activity.

2. **Interactive Search and Filtering:** Users have the ability to interact with the app. They can input parameters such as city names, start dates, end dates, and select a radius. Upon submitting the form, the app will generate a table containing information about all earthquakes in the specified area and time period. The table includes details about the location, date/time, and magnitude of each earthquake. Additionally, users can sort the table in both ascending and descending order based on magnitude and date by clicking on the header of the relevant column.

3. **Responsive Design:** Quake Finder has been designed with a responsive, mobile-first approach, ensuring proper functionality on a range of devices and screen sizes.


### Stretch features

We provide our users with some extra features:

1. **Loading Indicators:** To cater to impatient users, loading indicators or messages have been implemented to keep users informed while data is being fetched from the APIs.

2. **Error Handling:** In the event of issues with data retrieval or app functionality, clear error messages and feedback are provided to guide and inform users.

### Extra features

We added extra features that go beyond the project requirements.

1. **Location Map:** a library has been used to implement visual representation of earthquake location. User can click on a chosen data row to see a pop-up map with a location marker.
2. **Help Section:** user can learn how to use the page and is given additional information by opening a help section in a pop-up window.
3. **Earthquake Loading Animation:** as a visual, in addition to a standard loader, form element shakes according to a randomised animation function to give a visual impression of an earthquake while data is loading.

## How to Use Quake Finder

1. Clone this repository to your local machine.
2. Open the index.html file in a web browser to view the website.
3. Fill out the form with your desired parameters, such as city, start date, end date, and radius.
4. Click the "Search" button to retrieve earthquake data based on your input.
5. Browse and interact with the earthquake data presented in the table.
6. You can sort the table by clicking on the header of the "Magnitude" column to toggle between ascending and descending order.
7. Explore the earthquake data and stay informed about seismic activity in your specified area.

Enjoy your experience with Quake Finder and feel free to contribute to the project!




