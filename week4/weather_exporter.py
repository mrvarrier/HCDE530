import os
import csv
import requests
from dotenv import load_dotenv

# Load environment variables from the .env file.
# This keeps API-related configuration outside of the Python code.
load_dotenv()

# API endpoint URL loaded from .env.
# This endpoint returns weather forecast data from the Open-Meteo API in JSON format.
API_URL = os.environ.get("OPEN_METEO_API_URL")

# Check that the API URL exists before making the request.
if not API_URL:
    raise ValueError("OPEN_METEO_API_URL is missing from the .env file.")

# Parameters used in the API request:
# latitude: Seattle's latitude
# longitude: Seattle's longitude
# hourly: the specific hourly weather fields requested from the API
# timezone: converts the forecast times to Seattle local time
# forecast_days: requests 7 days of forecast data
params = {
    "latitude": 47.6062,
    "longitude": -122.3321,
    "hourly": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
    "timezone": "America/Los_Angeles",
    "forecast_days": 7
}

# Send a GET request to the Open-Meteo API endpoint.
# The API returns a JSON response containing weather forecast data.
response = requests.get(API_URL, params=params)

# Stop the script if the request fails.
response.raise_for_status()

# Convert the JSON response into a Python dictionary.
data = response.json()

# The "hourly" key contains hourly forecast data.
# Each value inside "hourly" is a list where each index represents one hour.
hourly_data = data["hourly"]

# Extract each field from the JSON response:
# time: the date and hour of each forecast record
# temperature_2m: air temperature 2 meters above ground, measured in Celsius
# relative_humidity_2m: humidity 2 meters above ground, measured as a percentage
# precipitation: expected precipitation amount, measured in millimeters
# wind_speed_10m: wind speed 10 meters above ground, measured in km/h
times = hourly_data["time"]
temperatures = hourly_data["temperature_2m"]
humidities = hourly_data["relative_humidity_2m"]
precipitations = hourly_data["precipitation"]
wind_speeds = hourly_data["wind_speed_10m"]

# Save the extracted data into a readable CSV file.
with open("seattle_weather.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    # Write the CSV header row.
    writer.writerow([
        "time",
        "temperature_2m_celsius",
        "relative_humidity_2m_percent",
        "precipitation_mm",
        "wind_speed_10m_kmh"
    ])

    # Write one row for each hourly weather record.
    # 7 days of hourly data gives 168 records, which is more than the required 50.
    for i in range(len(times)):
        writer.writerow([
            times[i],
            temperatures[i],
            humidities[i],
            precipitations[i],
            wind_speeds[i]
        ])

print("CSV file created successfully: seattle_weather.csv")
print(f"Total records saved: {len(times)}")