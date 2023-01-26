const express = require("express");
const router = express.Router();
const { currentWeather, fiveDayWeather } = require("./weather");
const helpers = require("./helper");
const { MongoClient, ServerApiVersion } = require("mongodb");


// render the index page
router.get("/", async (req, res, next) => {
    res.render("index", { title: "Home" });
});

// --- post route for the form --- //
router.post("/", async (req, res) => {
    try {
        const zipCode = req.body.zip;
        const weatherData = await currentWeather(zipCode);
        const fiveDayWeatherData = await fiveDayWeather(zipCode);
        const { coord, base, weather, main, wind, clouds, sys, timezone, name } = weatherData;
        const { list } = fiveDayWeatherData;
        res.render("index", {
            coord: coord,
            base: base,
            weather: weather,
            main: main,
            wind: wind,
            clouds: clouds,
            sys: sys,
            timezone: timezone,
            name: name,
            list: list,
            unixTimeConvertor: helpers.unixTimeConvertor,
        });
        mydb(coord, base, weather, main, wind, clouds, sys, timezone, name); // call the mydb function
    } catch (err) {
        console.error("Error rendering data:", err);
        res.status(500).send("Error getting weather data.");
    }
});

// render the about page
router.get("/", async (req, res, next) => {
    res.render("about", { title: "About" });
});

// 
router.get("/weather", async (req, res) => {
    const weatherDataCollection = client.db("openweatherapi").collection("weathers");
    const weatherData = await weatherDataCollection.find().toArray();
    res.render("weather", { weatherData: weatherData });
});

const uri = `mongodb+srv://${process.env.MONGO_DB_CONNECTION_STRING}`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
});

// Update the mydb function to accept the variables as arguments
const mydb = async (coord, base, weather, main, wind, clouds, sys, timezone, name) => {
    try {
        await client.connect();
        console.log("Connected to MongoDB Atlas");
        const weatherDataCollection = client.db("openweatherapi").collection("weathers");
        await weatherDataCollection.insertOne({
            coord: coord,
            base: base,
            weather: weather,
            main: main,
            wind: wind,
            clouds: clouds,
            sys: sys,
            timezone: timezone,
            name: name,
        });
    } catch (err) {
        console.error("Error connecting to MongoDB Atlas:", err);
    }
};
mydb();

module.exports = router;
