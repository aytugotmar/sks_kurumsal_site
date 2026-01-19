const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    shortDescription: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    endDate: {
        type: DataTypes.DATE,
        allowNull: true
    },
    time: {
        type: DataTypes.STRING,
        allowNull: true
    },
    location: {
        type: DataTypes.STRING,
        allowNull: true
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true
    },
    category: {
        type: DataTypes.ENUM('konser', 'tiyatro', 'sergi', 'söyleşi', 'atölye', 'diğer'),
        defaultValue: 'diğer'
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    },
    showInSlider: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    registrationRequired: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    capacity: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
}, {
    tableName: 'events',
    timestamps: true
});

module.exports = { Event };
