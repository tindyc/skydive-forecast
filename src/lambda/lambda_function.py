import json
import urllib.request

# Dropzones: name, latitude, longitude
DROPZONES = [
    {"name": "Hibaldstow", "lat": 53.4985, "lon": -0.5052},
    {"name": "Langar", "lat": 52.9065, "lon": -0.9637},
    {"name": "Dunkeswell", "lat": 50.8597, "lon": -3.2351},
    {"name": "Hinton", "lat": 52.0270, "lon": -1.1861}, 
    # Add more here 
]

def check_conditions(day, experience="beginner"):
    wind = day["windspeed_10m_max"]  # convert to mph
    rain = day["precipitation_sum"]
    clouds = day["cloudcover_mean"]
    temp = day["temperature_2m_max"]

    if experience == "beginner":
        return (wind < 17 and rain == 0 and clouds < 50 and temp > 5)
    else:  # experienced
        return (wind < 29 and rain < 2 and clouds < 70 and temp > 0)

def describe_weather(clouds, rain):
    if rain > 5:
        return "Heavy Rain"
    elif rain > 0:
        return "Rainy"
    elif clouds < 20:
        return "Sunny"
    elif clouds < 50:
        return "Partly Cloudy"
    elif clouds < 80:
        return "Cloudy"
    else:
        return "Overcast"

def lambda_handler(event, context):
    # ✅ Handle CORS preflight
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type"
            },
            "body": ""
        }

    report = {}

    for dz in DROPZONES:
        url = (
            f"https://api.open-meteo.com/v1/forecast?"
            f"latitude={dz['lat']}&longitude={dz['lon']}"
            "&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max,cloudcover_mean"
            "&forecast_days=10&timezone=auto"
        )

        try:
            with urllib.request.urlopen(url) as response:
                data = json.loads(response.read())
        except Exception as e:
            report[dz["name"]] = {"error": str(e)}
            continue

        if "daily" not in data:
            report[dz["name"]] = {"error": "No forecast in response"}
            continue

        daily = data["daily"]
        dz_report = []
        for i, date in enumerate(daily["time"]):
            clouds = daily["cloudcover_mean"][i]
            rain = daily["precipitation_sum"][i]
            wind_kmh = daily["windspeed_10m_max"][i]
            wind_mph = round(wind_kmh * 0.621371, 1)

            day = {
                "date": date,
                "temperature_2m_max": daily["temperature_2m_max"][i],
                "precipitation_sum": rain,
                "windspeed_10m_max": wind_mph,
                "cloudcover_mean": clouds,
                "description": describe_weather(clouds, rain),
            }
            day["status_beginner"] = "GOOD ✅" if check_conditions(day, "beginner") else "NO Jumping ❌"
            day["status_experienced"] = "GOOD ✅" if check_conditions(day, "experienced") else "NO Jumping ❌"
            dz_report.append(day)

        report[dz["name"]] = dz_report

    # ✅ Return both names + forecasts
    response_body = {
        "dropzones": [dz["name"] for dz in DROPZONES],
        "forecasts": report
    }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(response_body)
    }
