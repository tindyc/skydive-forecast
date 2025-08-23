# 🪂 Skydive Forecast  

Planning a jump in the UK? This app helps skydivers check the latest weather at selected dropzones and see if conditions are safe for beginners or experienced jumpers.  

Because sometimes the biggest leap isn’t out of the plane—it’s trusting the weather. 🌤️  

---

## ✨ Features  

- **UK Dropzones** – currently includes Hibaldstow, Langar, and Dunkeswell (with room to grow).  
- **Beginner vs Experienced** – conditions are assessed differently depending on skill level.  
- **Weather Insights** – clear daily forecasts: temperature, rain, wind (in mph), cloud cover, and a simple description.  
- **Safe/No Jump Indicators** – “GOOD ✅” or “NO Jumping ❌” guidance for each day.  
- **Mobile-friendly UI** – scrollable forecast cards and responsive design for checking on the go.  
- **Educational Tooltips** – explanations of safe jumping conditions, sourced from British Skydiving.  

---

## 🛠 Tech Stack  

I’ve kept things lightweight but practical:  

- **React + TypeScript** – a solid foundation for a clean, component-based UI.  
  - Example: `WeatherCard.tsx` renders forecast cards with icons, conditions, and safety checks.  

- **React Router** – enables dropzone pages and navigation (`App.tsx` has a simple navbar and routes).  
  - Configured with `basename="/skydive-forecast"` so it works when deployed on **GitHub Pages**, where apps are served from a subpath instead of the domain root.  

- **Custom CSS (Dark Theme)** – hand-crafted styles in `App.css` and `WeatherCard.css` for a modern, dark, skydiving-friendly look.  

- **AWS Lambda + API Gateway (Serverless Backend)** – the real workhorse of the app.  
  - The Lambda function fetches **10 days of forecast data** from [Open-Meteo](https://open-meteo.com/) for each dropzone.  
  - Converts **wind speed** from km/h → mph so it makes sense to UK jumpers.  
  - Applies **skydiving-specific safety rules** to decide if each day is a “GOOD ✅” or “NO Jumping ❌” day for **beginners vs experienced** skydivers.  
  - Returns the processed forecast via a simple JSON API, which the React frontend consumes.  
  - By using Lambda + API Gateway, the backend is:  
    - **Scalable** – only runs when needed.  
    - **Low-maintenance** – no servers to babysit.  
    - **Cheap** !!

- **Open-Meteo API** – Free and reliable weather data provider. 

---

## 🤔 Why These Choices?  

- **React + TypeScript**: I wanted strong typing (to avoid silly bugs) and reusable components. It also makes the UI easier to maintain and extend.  
- **React Router**: Makes the app feel like a proper multi-page site without leaving the browser. Using `basename` was essential for GitHub Pages deployment (otherwise routing would break on refresh).  
- **Lambda**: I’m not running a full backend, just need to fetch and filter weather. Serverless is simple, and scales without me worrying.  
- **Custom CSS**: Could’ve used a UI library, but I wanted full control to refresh my CSS skills. The design is minimal, following a less is more style.  

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
Add more dropzones (UK & worldwide 🌍).

Notifications when a “GOOD ✅” day is coming up.

Add altitude-adjusted temperature & wind conditions.

## 🙏 Acknowledgements

British Skydiving for the official safety guidelines.

Open-Meteo for free forecast data.

And everyone who’s built the tools I’m borrowing to get this project off the ground (pun intended).


