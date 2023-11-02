// Import the Room and RoomType models
const { models } = require("../models");

exports.getRoomTypes = async (req, res) => {
    try {
        // Find all room types
        const roomTypes = await models.RoomType.findAll({
            attributes: ['name']
        });

        // Return the room types
        res.status(200).send(roomTypes);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving room types.',
        });
    }
}

exports.getRooms = async (req, res) => {
    try {
        // Find all rooms
        const rooms = await models.Room.findAll({
            attributes: ['roomNumber']
        });

        // Return the rooms
        res.status(200).send(rooms);
    } catch (err) {
        res.status(500).send({
            message: err.message || 'Some error occurred while retrieving rooms.',
        });
    }
}
