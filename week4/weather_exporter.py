import requests
import csv

# Open-Meteo Forecast API endpoint.
# This endpoint returns weather forecast data in JSON format.
API_URL = "https://api.open-meteo.com/v1/forecast"

# Parameters sent to the API.
# latitude/longitude: Seattle, Washington
# hourly: the weather variables we want returned for each hour
# timezone: makes the timestamps match Seattle local time
# forecast_days: asks for 7 days of hourly forecast data
params = {
    "latitude": 47.6062,
    "longitude": -122.3321,
    "hourly": "temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m",
    "timezone": "America/Los_Angeles",
    "forecast_days": 7
}

response = requests.get(API_URL, params=params)

# Raise an error if the API request failed.
response.raise_for_status()

# Convert the JSON response into a Python dictionary.
data = response.json()

# The "hourly" key contains the hourly weather data.
hourly_data = data["hourly"]

# Each key below is a list.
# time: date and hour of the forecast
# temperature_2m: temperature 2 meters above ground in Celsius
# relative_humidity_2m: humidity percentage 2 meters above ground
# precipitation: predicted precipitation amount in millimeters
# wind_speed_10m: wind speed 10 meters above ground
times = hourly_data["time"]
temperatures = hourly_data["temperature_2m"]
humidities = hourly_data["relative_humidity_2m"]
precipitations = hourly_data["precipitation"]
wind_speeds = hourly_data["wind_speed_10m"]

# Save the parsed data into a CSV file.
with open("seattle_weather.csv", mode="w", newline="", encoding="utf-8") as file:
    writer = csv.writer(file)

    # CSV header row
    writer.writerow([
        "time",
        "temperature_2m_celsius",
        "relative_humidity_2m_percent",
        "precipitation_mm",
        "wind_speed_10m_kmh"
    ])

    # Write each hourly record as one row in the CSV.
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