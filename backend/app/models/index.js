const bookingModel = require("./booking.model");
const roomModel = require("./room.model");
const roomTypeModel = require("./roomType.model");

const {Sequelize} = require("sequelize");

// const sequelize = new Sequelize(
//     "hotel",
//     process.env.DB_USER,
//     process.env.DB_PASS,
//     {
//         dialect: 'postgres',
//     },
// );

const sequelize = new Sequelize(process.env.DB_URL);

const models = {
    Booking: bookingModel(sequelize, Sequelize),
    Room: roomModel(sequelize, Sequelize),
    RoomType: roomTypeModel(sequelize, Sequelize)
};

Object.keys(models).forEach((key) => {
    if (models[key].hasOwnProperty('associate')) {
        models[key].associate(models);
    }
});

exports.sequelize = sequelize;
exports.models = models;