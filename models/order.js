const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const Order=sequelize.define('order',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },

});

module.exports=Order;