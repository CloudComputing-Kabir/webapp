const Sequelize = require('sequelize');
const sequelize = require('../Util/databaseSequelize');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    first_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    last_name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    username: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

User.sync().then(() => {
    console.log('User table created successfully');
}).catch((err) => {
    console.error('Error while creating user table: ', err);
});

module.exports = User