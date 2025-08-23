from playwright.sync_api import sync_playwright
import json
import os

URL = "https://britishskydiving.org/find-drop-zone/"
DZ_JSON = "dropzones.json"

def scrape_dropzones():
    """Scrape DZ names from British Skydiving using Playwright."""
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(URL)

        # Wait for map markers to load (Google Maps adds div[title] for each DZ)
        page.wait_for_selector("div[title]")

        elements = page.query_selector_all("div[title]")
        names = []

        for el in elements:
            title = el.get_attribute("title")
            if title and ("Skydive" in title or "Parachute" in title):
                names.append(title.strip())

        browser.close()
        return sorted(set(names))

def load_known_dropzones():
    """Load known DZs from JSON or return empty list if missing."""
    if os.path.exists(DZ_JSON):
        with open(DZ_JSON, "r") as f:
            return json.load(f)
    return []

def save_dropzones(dropzones):
    """Save updated dropzones to JSON file."""
    with open(DZ_JSON, "w") as f:
        json.dump(dropzones, f, indent=2)

def main():
    scraped_names = scrape_dropzones()
    known_dzs = load_known_dropzones()
    known_names = {dz["name"] for dz in known_dzs}

    print(f"✅ Scraped {len(scraped_names)} dropzones from website")
    print(f"📂 You currently track {len(known_dzs)} dropzones in {DZ_JSON}")

    new_dzs = []
    for name in scraped_names:
        if name not in known_names:
            # Add new DZ with empty coords
            new_dz = {"name": name, "lat": None, "lon": None}
            known_dzs.append(new_dz)
            new_dzs.append(new_dz)

    if new_dzs:
        print("\n🚨 New dropzones added to dropzones.json (lat/lon = null):")
        for dz in new_dzs:
            print(f" - {dz['name']}")
        save_dropzones(known_dzs)
    else:
        print("\n👍 No new dropzones, you’re up to date.")

if __name__ == "__main__":
    main()
