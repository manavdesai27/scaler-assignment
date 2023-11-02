module.exports = (sequelize, Sequalize) => {
    const RoomType = sequelize.define('roomType', {
        id: {
            type: Sequalize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        name: {
            type: Sequalize.STRING,
            allowNull: false
        },

        price: {
            type: Sequalize.INTEGER,
            allowNull: false
        },

        capacity: {
            type: Sequalize.INTEGER,
            allowNull: false
        }
    }, {
        timestamps: false
    });

    RoomType.associate = (models) => {
        RoomType.hasMany(models.Room, {
            foreignKey: 'roomTypeId',
            onDelete: "cascade"
        });
    };

    return RoomType;
}