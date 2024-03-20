const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const DownloadFile = sequelize.define('downloadFiles', {
    id:{
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },

    fileURL: {
        type: Sequelize.STRING,
        allowNull: false
    }
});


module.exports = DownloadFile;