import json
import urllib.request

# Raw GitHub URL for dropzones.json
DZ_URL = "https://raw.githubusercontent.com/tindyc/skydive-forecast/main/data/dropzones.json"

def get_dropzones():
    """Fetch the latest dropzones.json from GitHub safely."""
    try:
        with urllib.request.urlopen(DZ_URL) as response:
            text = response.read().decode("utf-8")
            print(f"✅ dropzones.json fetched successfully, {len(text)} bytes")
            return json.loads(text)
    except Exception as e:
        print("❌ Failed to fetch dropzones.json:", e)
        return []  # safe fallback

def check_conditions(day, experience="beginner"):
    wind = day["windspeed_10m_max"]  # already in mph
    rain = day["precipitation_sum"]
    clouds = day["cloudcover_mean"]
    temp = day["temperature_2m_max"]

    if experience == "beginner":
        return wind < 17 and rain == 0 and clouds < 50 and temp > 5
    else:  # experienced skydiver
        return wind < 29 and rain < 2 and clouds < 70 and temp > 0

def describe_weather(clouds, rain):
    """Return a simple text description based on cloud cover and precipitation."""
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
    # Handle CORS preflight
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
    DROPZONES = get_dropzones()

    if not DROPZONES:
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Could not load dropzones"})
        }

    for dz in DROPZONES:
        if not dz.get("lat") or not dz.get("lon"):
            print(f"⚠️ Skipping {dz['name']} - no coordinates")
            continue

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
            print(f"❌ Failed to fetch weather for {dz['name']}: {e}")
            report[dz["name"]] = {"error": f"Failed to fetch weather: {str(e)}"}
            continue

        if "daily" not in data:
            print(f"⚠️ No daily forecast in API response for {dz['name']}")
            report[dz["name"]] = {"error": "No daily forecast in API response"}
            continue

        daily = data["daily"]
        dz_report = []
        for i, date in enumerate(daily["time"]):
            clouds = daily["cloudcover_mean"][i]
            rain = daily["precipitation_sum"][i]
            wind_kmh = daily["windspeed_10m_max"][i]
            wind_mph = round(wind_kmh * 0.621371, 1)  # convert to mph

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

    # ✅ Return clean JSON (dropzones + forecasts)
    response_body = {
        "dropzones": [dz["name"] for dz in DROPZONES if dz.get("lat") and dz.get("lon")],
        "forecasts": report
    }

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type"
        },
        "body": json.dumps(response_body)
    }
match