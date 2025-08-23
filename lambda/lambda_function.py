import json
import urllib.request

# ✅ Updated: fetch from public/dropzones.json (single source of truth)
DZ_URL = "https://raw.githubusercontent.com/tindyc/skydive-forecast/main/public/dropzones.json"


def get_dropzones():
    """Fetch the latest dropzones.json from GitHub safely."""
    try:
        with urllib.request.urlopen(DZ_URL) as response:
            text = response.read().decode("utf-8")
            dropzones = json.loads(text)
            print(f"✅ dropzones.json fetched: {len(dropzones)} entries")
            print("Available dropzones:", [dz["name"] for dz in dropzones])
            return dropzones
    except Exception as e:
        print("❌ Failed to fetch dropzones.json:", e)
        return []


def check_conditions(day, experience="beginner"):
    wind = day["windspeed_10m_max"]  # mph
    rain = day["precipitation_sum"]
    clouds = day["cloudcover_mean"]
    temp = day["temperature_2m_max"]

    if experience == "beginner":
        return wind < 17 and rain == 0 and clouds < 50 and temp > 5
    else:
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
    # ✅ Handle CORS preflight
    if event.get("requestContext", {}).get("http", {}).get("method") == "OPTIONS":
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": "",
        }

    # ✅ Get query parameter (dropzone name)
    query_params = event.get("queryStringParameters") or {}
    dz_name = query_params.get("dz")

    if not dz_name:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": "Missing ?dz=DropzoneName parameter"}),
        }

    # ✅ Normalize user input
    dz_name_normalized = dz_name.strip().lower()

    # ✅ Load dropzones
    dropzones = get_dropzones()
    dz = next(
        (d for d in dropzones if d.get("name", "").strip().lower() == dz_name_normalized),
        None,
    )

    if not dz or not dz.get("lat") or not dz.get("lon"):
        return {
            "statusCode": 404,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"Dropzone '{dz_name}' not found"}),
        }

    # ✅ Build weather API URL for this DZ only
    url = (
        f"https://api.open-meteo.com/v1/forecast?"
        f"latitude={dz['lat']}&longitude={dz['lon']}"
        "&daily=temperature_2m_max,precipitation_sum,windspeed_10m_max,cloudcover_mean"
        "&forecast_days=10&timezone=auto"
    )

    try:
        with urllib.request.urlopen(url) as response:
            data = json.loads(response.read())

        if "daily" not in data:
            raise Exception("No daily forecast in response")

        daily = data["daily"]
        dz_report = []
        for i, date in enumerate(daily["time"]):
            clouds = daily["cloudcover_mean"][i]
            rain = daily["precipitation_sum"][i]
            wind_kmh = daily["windspeed_10m_max"][i]
            wind_mph = round(wind_kmh * 0.621371, 1)  # km/h → mph

            day = {
                "date": date,
                "temperature_2m_max": daily["temperature_2m_max"][i],
                "precipitation_sum": rain,
                "windspeed_10m_max": wind_mph,
                "cloudcover_mean": clouds,
                "description": describe_weather(clouds, rain),
            }
            day["status_beginner"] = (
                "GOOD ✅" if check_conditions(day, "beginner") else "NO Jumping ❌"
            )
            day["status_experienced"] = (
                "GOOD ✅"
                if check_conditions(day, "experienced")
                else "NO Jumping ❌"
            )
            dz_report.append(day)

        # ✅ Success response
        return {
            "statusCode": 200,
            "headers": {
                "Content-Type": "application/json; charset=utf-8",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type",
            },
            "body": json.dumps({
                "dropzone": dz["name"],
                "forecast": dz_report
            }),
        }

    except Exception as e:
        print(f"❌ Error fetching forecast for {dz_name}: {e}")
        return {
            "statusCode": 500,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps({"error": f"Failed to fetch forecast: {str(e)}"}),
        }
