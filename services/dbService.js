const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();

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

module.exports = { mydb };
