const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3005;
app.use(cors({
  origin: 'https://your-frontend-name.vercel.app'
}));
app.get("/weather", async (req, res) => {
  const city = req.query.city;
  if (!city) {
    return res.status(400).json({ error: "City is required" });
  }

  const apiKey = process.env.OPENWEATHER_API_KEY;
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  try {
    const response = await axios.get(url);
    const data = response.data;

    const weatherInfo = {
      temperature: data.main.temp,
      condition: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
    };

    res.json(weatherInfo);
  } catch (error) {
    console.error("OpenWeather API Error:", error.response?.data || error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
}
);