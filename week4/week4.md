# Week 4 Competency Claim and HCD Reflection

## Competency Claim (C4 — APIs and Data Acquisition)

For this assignment, I demonstrated the ability to independently find and use a real public API. I used the Open-Meteo Forecast API to retrieve hourly weather data for Seattle, Washington.

My Python script sends an HTTP GET request to the API endpoint with specific parameters, including latitude, longitude, timezone, and selected hourly variables. The API returns structured JSON data containing arrays for each weather variable.

From this response, I extracted five fields: time, temperature_2m, relative_humidity_2m, precipitation, and wind_speed_10m. I parsed these arrays and saved them into a CSV file with 168 records (7 days of hourly data).

I chose this API because it does not require authentication and provides clean, well-structured JSON data, making it suitable for reliable data extraction. My script demonstrates that I can read API documentation, construct requests with parameters, interpret JSON responses, and transform them into a usable format.

## HCD Reflection

From a human-centered design perspective, weather data supports everyday user decisions such as planning activities, commuting, and preparing for environmental conditions.

The API returns data in JSON format, which is not easily readable for most users. By converting the data into a CSV file, the script makes the information more accessible and usable for non-technical users. The structured format allows users to easily scan, filter, and analyze the data.

This project shows how APIs can be used to bridge the gap between raw machine-readable data and human-readable formats, which is an important aspect of designing useful tools.