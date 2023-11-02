module.exports = (sequelize, Sequelize) => {
    const Booking = sequelize.define('booking', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        checkIn: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },

        checkOut: {
            type: Sequelize.DATEONLY,
            allowNull: false
        },

        email: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },

        roomId: {
            type: Sequelize.INTEGER,
            allowNull: false
        },

        price: {
            type: Sequelize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    Booking.associate = models => {
        Booking.belongsTo(models.Room, {
            foreignKey: 'roomId',
        });
    }

    return Booking;
}