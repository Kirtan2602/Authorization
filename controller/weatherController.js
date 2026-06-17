export const getWeather = async (req, res) => {
  try {
    const { cities } = req.query;

    if (!cities) {
      return res.status(400).json({ message: "Cities required" });
    }

    const apiKey = process.env.WEATHER_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ message: "Weather API key missing" });
    }

    const cityList = cities
      .split(",")
      .map((city) => city.trim())
      .filter(Boolean);

    if (!cityList.length) {
      return res.status(400).json({ message: "At least one city is required" });
    }

    const params = new URLSearchParams({
      key: apiKey,
      locations: cityList.join("|"),
      unitGroup: "metric",
      contentType: "json",
    });

    const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timelinemulti?${params}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        message: "Error fetching weather",
        error: data.message || data,
      });
    }

    const locations = Array.isArray(data.locations)
      ? data.locations
      : Object.values(data.locations || {});

    const result = locations.map((item) => ({
      city: item.resolvedAddress || item.address || "N/A",
      temp: item.currentConditions?.temp ?? item.days?.[0]?.temp ?? "N/A",
      weather: item.currentConditions?.conditions ?? item.days?.[0]?.conditions ?? "N/A",
      humidity: item.currentConditions?.humidity ?? item.days?.[0]?.humidity ?? "N/A",
      windSpeed: item.currentConditions?.windspeed ?? item.days?.[0]?.windspeed ?? "N/A",
    }));

    res.json(result);

  } catch (error) {
    res.status(500).json({
      message: "Error fetching weather",
      error: error.message,
    });
  }
};
