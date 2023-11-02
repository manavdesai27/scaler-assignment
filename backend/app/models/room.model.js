module.exports = (sequelize, Sequalize) => {
    const Room = sequelize.define('room', {
        id: {
            type: Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        roomNumber: {
            type: Sequalize.INTEGER,
            allowNull: false
        },

        roomTypeId: {
            type: Sequalize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    Room.associate = (models) => {
        Room.belongsTo(models.RoomType, {
            foreignKey: 'roomTypeId',
        });

        Room.hasMany(models.Booking, {
            foreignKey: 'roomId',
            onDelete: "cascade"
        });
    };

    return Room;
}