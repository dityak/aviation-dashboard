
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());

// ==========================
// 📡 API ROUTES
// ==========================

// Flight Info Endpoint
app.get('/api/flight/:flightNumber', async (req, res) => {
  const flightNumber = req.params.flightNumber;
  console.log("✈️ Fetching flight:", flightNumber);

  try {
    const response = await axios.get('http://api.aviationstack.com/v1/flights', {
      params: {
        access_key: process.env.AVIATIONSTACK_API_KEY,
        flight_iata: flightNumber
      }
    });

    const data = response.data;

    if (!data || !data.data || data.data.length === 0) {
      console.error("⚠️ No flight data found");
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json(data);
  } catch (err) {
    console.error('🔥 Flight API Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch flight info' });
  }
});

// Weather Info Endpoint
app.get('/api/weather/:city', async (req, res) => {
  const rawCity = req.params.city;
  const city = decodeURIComponent(rawCity).trim();
  console.log("🌍 Fetching weather for city:", city);

  try {
    const response = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
      params: {
        q: city,
        appid: process.env.OPENWEATHER_API_KEY,
        units: 'metric'
      }
    });

    res.json(response.data);
  } catch (err) {
    console.error('🌩️ Weather API Error:', err.response?.data || err.message);
    res.status(500).json({ error: 'Failed to fetch weather info' });
  }
});

// ==========================
// 🖼️ Serve React Frontend
// ==========================

app.use(express.static(path.join(__dirname, '../client/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

// ==========================
// 🚀 Start Server
// ==========================

app.listen(PORT, () => {
  console.log(`🚀 Backend running on port ${PORT}`);
});

