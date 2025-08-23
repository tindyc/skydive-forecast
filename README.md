# 🪂 Skydive Forecast  
[Production Site](https://tindyc.github.io/skydive-forecast/) 

Planning a jump in the UK? This app helps skydivers check the latest weather at selected dropzones and see if conditions are safe for beginners or experienced jumpers.  

Because sometimes the biggest leap isn’t out of the plane—it’s trusting the weather. 🌤️  

---

## ✨ Features  

## ✨ Features  

- **UK Dropzones** – now includes *all official [British Skydiving](https://britishskydiving.org/find-drop-zone/)* dropzones (scraped automatically).  

- **🔍 Smart Dropzone Search** – find your DZ quickly with a styled search bar:  
  - Autocomplete suggestions appear as you type.  
  - Navigate with **⬆️ / ⬇️ keys** and press **Enter** to jump directly.  
  - Mobile-friendly and centered design for easy use on any screen.  

- **Beginner vs Experienced** – conditions assessed differently depending on skill level.  

- **Weather Insights** – daily forecasts include:  
  - 🌡 Temperature  
  - 🌧 Rain chance  
  - 💨 Wind speed (mph)  
  - ☁️ Cloud cover  
  - ✍️ A simple description of conditions  

- **Safe/No Jump Indicators** – “GOOD ✅” or “NO Jumping ❌” guidance for each day.  

- **Mobile-friendly UI** – scrollable forecast cards and responsive layout.  

- **Educational Tooltips** – explain safe skydiving conditions, sourced from [British Skydiving](https://britishskydiving.org/).  

---

## 🛠 Tech Stack  

- **React + TypeScript** – component-based frontend.  
- **React Router** – slug-based navigation (e.g. `/dropzone/skydive-langar`).  
- **AWS Lambda + API Gateway** – serverless backend that fetches and processes forecasts.  
- **Python Scraper** – scrapes dropzones from British Skydiving and geocodes them with Google Maps API.  
- **GitHub Actions Workflow** – automates scraper → commit → Lambda deploy → frontend build & deploy.  
- **Open-Meteo API** – free forecast data provider.  

---

## 🚀 Phase 2 — Upgrades & Optimizations  

This project has evolved significantly from **Phase 1** to **Phase 2**:

### 🔹 Automated Dropzones  
- Added a **Python scraper (`tools/scraper.py`)** that fetches every dropzone name from [British Skydiving](https://britishskydiving.org/find-drop-zone/).  
- Uses **Google Geocoding API** to attach lat/lon coordinates.  
- Updates `public/dropzones.json`.

### 🔹 CI/CD with GitHub Actions  
- New workflow (`.github/workflows/update-dropzones.yml`) automates:  
  - Running the scraper.  
  - Committing updated `dropzones.json` to `main`.  
  - Deploying updated Lambda code.  
  - Building & publishing the frontend to GitHub Pages.  
- Triggered manually (`workflow_dispatch`) → keeps costs within free tier.  

### 🔹 Optimized Lambda  
- **Phase 1**: Lambda fetched forecasts for *all dropzones at once* → very slow.  
- **Phase 2**: Lambda now:  
  - Loads the latest `dropzones.json` directly from GitHub.  
  - Fetches **only the requested dropzone’s forecast** via `?dz=DropzoneName`.  
  - Applies safety rules (wind, cloud cover, rain, temperature) for **beginner vs experienced** jumpers.  
- ✅ Smaller payloads, much faster responses.  
- ✅ Backend always in sync with the scraper’s output — no need to redeploy Lambda for new DZs.  

---

## 🏗️ Architecture  

![Architecture Diagram](src/assets/img/architecture.png)

### Flow
1. **Scraper (Python + Playwright + Google API)**  
   - Scrapes dropzones → geocodes → saves to `public/dropzones.json`.  
   - GitHub Actions commits updates automatically.  

2. **Frontend (React, GitHub Pages)**  
   - Loads dropzones from `dropzones.json`.  
   - Generates clean slugs (`/dropzone/skydive-langar`).  

3. **API Gateway + Lambda (Python)**  
   - Receives `?dz=Skydive Langar`.  
   - Looks up lat/lon from `dropzones.json`.  
   - Fetches forecast from Open-Meteo.  
   - Converts wind to mph, applies safety rules.  
   - Returns structured JSON.  

4. **Frontend**  
   - Displays forecasts in interactive `WeatherCard`s with beginner/experienced jump indicators.  

---

## 🚀 Getting Started  

1. **Clone the repo**  
   ```
   git clone https://github.com/yourname/skydive-forecast.git
   cd skydive-forecast
   ```
2. **Install dependencies**
````
npm install
````

3. ***Start the app locally***
```
npm run dev
```

4. ***Deploy ( GitHub Pages)***
In App.tsx, make sure the router is wrapped with:
```
<Router basename="/skydive-forecast">
````
Then build and publish with:
```
npm run build
npm run deploy
```

## Future Ideas
1. Add more dropzones (UK & worldwide 🌍). 
* All of England's dropzones now added by scraping from British Skydiving in Phrase2.

2. Notifications/alerts when a “GOOD ✅” day is coming up.

3. Altitude-adjusted forecasts – calculate conditions at jump altitude (not just ground).

4. Data analytics & graphs:

* Use Pandas to process the fetched weather data.

* Show averages, min, max of wind speed, temperature, and cloud cover.

* Highlight how many “GOOD ✅” days are expected in the next 10 days.

* Add trend charts (line graphs of wind speeds, temperatures, rain probability).

5. Visual dashboards:

* Bar charts for “jumpable vs no-jump days” per dropzone.

* Pie charts comparing beginner vs experienced safe days.

* Rolling averages to show seasonal patterns (e.g., best months to jump).

6. User experience features:

* Allow users to favourite dropzones and view combined stats.

* Compare two dropzones side by side (e.g., Hibaldstow vs Langar).

* Export reports (PDF or CSV) with conditions summary.

7. Machine learning ideas:

* Predict the best jump days using past data + forecast trends.

* Show “confidence scores” for forecasts.

## 🙏 Acknowledgements

British Skydiving for the official safety guidelines and list of UK Dropzones.

Open-Meteo for free forecast data.

And everyone who’s built the tools and packages I’m borrowing to get this project off the ground.

