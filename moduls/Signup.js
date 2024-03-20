
const Sequelize = require('sequelize');
const sequelize = require('../utils/database')

const Signup = sequelize.define('SignUpUser',{
    id: {
        type:Sequelize.INTEGER,
        autoIncrement:true,
        primaryKey:true,
        unique:true,
        allowNull:false
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false

    },
    Email:{
        type:Sequelize.STRING,
        allowNull:false 
    },
    password:{
        type: Sequelize.STRING,
        allowNull:false
    },
    ispremiumuser: Sequelize.BOOLEAN,
    totalExpense: {
        type: Sequelize.BIGINT,
        default:0,
      }
})

module.exports = Signup;