const Sequelize = require('sequelize');
const sequelize = require('../Util/databaseSequelize');

const Product = sequelize.define('userProduct', {
    productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false
    },
    sku: {
        type: Sequelize.STRING,
        allowNull: false
    },
    maufacturer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    quantity: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    owner_user_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});
Product.sync().then(() => {
    console.log('Product table created successfully');
}).catch((err) => {
    console.error('Error while creating table: ', err);
});


module.exports = Product;

