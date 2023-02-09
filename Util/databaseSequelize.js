const Sequelize = require('sequelize');
const sequelize = new Sequelize('CloudAssignment1', 'root', '17227860', { dialect: 'mysql', host: 'localhost' });
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });
module.exports = sequelize;