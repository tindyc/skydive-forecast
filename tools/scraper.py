from playwright.sync_api import sync_playwright
import json
import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env file (if present)
load_dotenv()

URL = "https://britishskydiving.org/find-drop-zone/"
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

DZ_JSON = os.path.join(BASE_DIR, "public", "dropzones.json")

GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
if not GOOGLE_API_KEY:
    raise RuntimeError("❌ GOOGLE_API_KEY not set. Please add it to your .env or environment.")


def scrape_dropzones():
    """Scrape DZ names from British Skydiving using Playwright."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(URL)

        # Wait for map markers to load
        page.wait_for_selector("div[title]")

        elements = page.query_selector_all("div[title]")
        names = []

        for el in elements:
            title = el.get_attribute("title")
            if title and ("Skydive" in title or "Parachute" in title):
                names.append(title.strip())

        browser.close()
        return sorted(set(names))


def geocode_place(name):
    """Fetch coordinates for a DZ name using Google Geocoding API."""
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={name}+UK&key={GOOGLE_API_KEY}"
    resp = requests.get(url).json()
    if resp.get("status") == "OK":
        loc = resp["results"][0]["geometry"]["location"]
        return loc["lat"], loc["lng"]
    print(f"⚠️ Could not geocode {name}: {resp.get('status')}")
    return None, None


def load_known_dropzones():
    """Load existing DZs from JSON file, or return empty list if missing."""
    if os.path.exists(DZ_JSON):
        with open(DZ_JSON, "r") as f:
            return json.load(f)
    return []


def save_dropzones(dropzones):
    """Save DZs to public/dropzones.json (used by frontend + Lambda)."""
    os.makedirs(os.path.dirname(DZ_JSON), exist_ok=True)
    with open(DZ_JSON, "w") as f:
        json.dump(dropzones, f, indent=2)
    print(f"💾 Saved {len(dropzones)} dropzones to {DZ_JSON}")


def main():
    scraped_names = scrape_dropzones()
    known_dzs = load_known_dropzones()
    known_names = {dz["name"] for dz in known_dzs}

    new_dzs = []
    updated_dzs = []

    for name in scraped_names:
        existing_dz = next((dz for dz in known_dzs if dz["name"] == name), None)

        if existing_dz:
            if existing_dz["lat"] is None or existing_dz["lon"] is None:
                lat, lon = geocode_place(name)
                existing_dz["lat"], existing_dz["lon"] = lat, lon
                updated_dzs.append(existing_dz)
        else:
            lat, lon = geocode_place(name)
            new_dz = {"name": name, "lat": lat, "lon": lon}
            known_dzs.append(new_dz)
            new_dzs.append(new_dz)

    if new_dzs or updated_dzs:
        if new_dzs:
            print("\n🚨 New dropzones added:")
            for dz in new_dzs:
                print(f" - {dz['name']}: ({dz['lat']}, {dz['lon']})")
        if updated_dzs:
            print("\n🔄 Existing dropzones updated with coordinates:")
            for dz in updated_dzs:
                print(f" - {dz['name']}: ({dz['lat']}, {dz['lon']})")

        save_dropzones(known_dzs)
    else:
        print("\n👍 No updates needed, everything is up to date.")


if __name__ == "__main__":
    main()
