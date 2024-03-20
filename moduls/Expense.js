
const Sequelize = require('sequelize');
const sequelize = require('../utils/database')

const Expense= sequelize.define('expenses',{
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        unique:true,
        allowNull:false
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false

    },
    expense:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    item:{
        type: Sequelize.STRING,
        allowNull:false
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false
    }
})

module.exports = Expense;