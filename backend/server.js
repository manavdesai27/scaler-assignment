const express = require("express");
var bodyParser = require("body-parser");
require('dotenv').config()
const cors = require("cors");
const { Sequelize } = require("sequelize");

const app = express();
app.use(cors());
// app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

const {sequelize, models} = require("./app/models");
const roomRoutes = require("./app/routes/room.route");
const bookingRoutes = require("./app/routes/booking.route");

sequelize.sync().then(() => {
    console.log("Synced DB");
}).catch((err) => {
    console.log(`Failed to sync DB: ${err.message}`);
})

app.get("/", (req, res) => {
    res.json({
        message: "Welcome"
    });
});

app.use("/rooms", roomRoutes);
app.use("/book", bookingRoutes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});