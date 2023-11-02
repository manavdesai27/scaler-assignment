// const Booking = require('../models/booking.model');
// const Room = require('../models/room.model');
const { models } = require('../models');
const { Op } = require('sequelize');
// Create a new booking
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: 'Booking content can not be empty'
        });
    }

    // Create a booking
    const booking = new models.Booking({
        email: req.body.userEmail,
        roomId: req.body.roomId,
        checkIn: req.body.checkIn,
        checkOut: req.body.checkOut,
        price: req.body.price
    });

    // Save booking in the database
    booking.save()
        .then(data => {
            res.status(200).send(data);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while creating the Booking.'
            });
        });
};

// Retrieve all bookings from the database.
exports.findAll = (req, res) => {
    models.Booking.findAll({
        include: [{
            model: models.Room,
            include: [{
                model: models.RoomType,
                attributes: ['name', 'price']
            }],
            attributes: ['id', 'roomNumber']
        }]
    })
        .then(bookings => {
            res.status(200).send(bookings);
        }).catch(err => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving bookings.'
            });
        });
};

// Find a single booking with a bookingId
exports.findOne = (req, res) => {
    models.Booking.findByPk(req.params.bookingId)
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: 'Booking not found with id ' + req.params.bookingId
                });
            }
            res.status(200).send(booking);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'Booking not found with id ' + req.params.bookingId
                });
            }
            return res.status(500).send({
                message: 'Error retrieving booking with id ' + req.params.bookingId
            });
        });
};

// Update a booking identified by the bookingId in the request
exports.update = (req, res) => {
    // Validate Request
    if (!req.body) {
        return res.status(400).send({
            message: 'Booking content can not be empty'
        });
    }

    // Find booking and update it with the request body
    models.Booking.update(
        {
            email: req.body.email,
            checkIn: req.body.checkIn,
            checkOut: req.body.checkOut,
            price: req.body.price
        },
        {where: {id: req.params.id}}
    )
        .then(booking => {
            if (!booking) {
                return res.status(404).send({
                    message: 'Booking not found with id ' + req.params.id
                });
            }
            res.status(200).send(booking);
        }).catch(err => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({
                    message: 'Booking not found with id ' + req.params.id
                });
            }
            return res.status(500).send({
                err: err,
                message: 'Error updating booking with id ' + req.params.bookingId
            });
        });
};

// Delete a booking with the specified bookingId in the request
exports.delete = (req, res) => {
    models.Booking.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(booking => {
            console.log(booking);
            if (!booking) {
                return res.status(404).send({
                    message: 'Booking not found with id ' + req.params.id
                });
            }
            res.status(200).send({ message: 'Booking deleted successfully!' });
        }).catch(err => {
            if (err.kind === 'ObjectId' || err.name === 'NotFound') {
                return res.status(404).send({
                    message: 'Booking not found with id ' + req.params.id
                });
            }
            return res.status(500).send({
                message: 'Could not delete booking with id ' + req.params.id
            });
        });
};

// Find all empty rooms between given dates
exports.findEmptyRooms = (req, res) => {
    const { startDate, endDate } = req.query;
    console.log(startDate, endDate);

    models.Booking.findAll({
        where: {
            [Op.or]: [
                { checkIn: { [Op.lte]: startDate }, checkOut: { [Op.gte]: startDate } },
                { checkIn: { [Op.lte]: endDate }, checkOut: { [Op.gte]: endDate } },
                { checkIn: { [Op.gte]: startDate }, checkOut: { [Op.lte]: endDate } },
            ]
        },
        attributes: ['roomId'] // To select specific columns
    })
        .then((bookings) => {
            const bookedRoomIds = bookings.map((booking) => booking.dataValues.roomId);

            models.Room.findAll({
                where: {
                    id: {
                        [Op.notIn]: bookedRoomIds
                    }
                },
                include: [
                    {
                        model: models.RoomType,
                        attributes: ['price', 'name']
                    }
                ]
            })
                .then((rooms) => {
                    res.send(rooms);
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || 'Some error occurred while retrieving rooms.',
                    });
                });
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving bookings.',
            });
        });
};

exports.checkRoomAvailability = (req, res) => {
    const { startDate, endDate, roomId } = req.query;
    console.log(startDate, endDate, roomId);

    models.Booking.findAll({
        where: {
            [Op.and]: [
                {
                    [Op.or]: [
                        { checkIn: { $lte: startDate }, checkOut: { $gte: startDate } },
                        { checkIn: { $lte: endDate }, checkOut: { $gte: endDate } },
                        { checkIn: { $gte: startDate }, checkOut: { $lte: endDate } },
                    ]
                },
                { roomId: roomId },
            ]
        }

    })
        .then((bookings) => {
            // console.log(bookings);
            if (bookings.length) {
                res.send({ available: false });
            } else {
                res.send({ available: true });
            }
        })
        .catch((err) => {
            res.status(500).send({
                message: err.message || 'Some error occurred while retrieving bookings.',
            });
        });
}
