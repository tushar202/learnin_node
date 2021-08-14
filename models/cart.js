const sequelize=require('../util/database');
const Sequelize=require('sequelize');

const Cart=sequelize.define('cart',{
  id:{
    type:Sequelize.INTEGER,
    primaryKey:true,
    allowNull:false,
    autoIncrement:true
  },

});

module.exports=Cart;