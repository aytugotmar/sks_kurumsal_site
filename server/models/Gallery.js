const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Gallery = sequelize.define('Gallery', {
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
        allowNull: true
    },
    images: {
        type: DataTypes.JSON,
        defaultValue: []
    },
    category: {
        type: DataTypes.STRING,
        allowNull: true
    },
    eventId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'events',
            key: 'id'
        }
    },
    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    tableName: 'galleries',
    timestamps: true
});

module.exports = { Gallery };
