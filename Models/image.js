const Sequelize = require('sequelize');
const sequelize = require('../Util/databaseSequelize');

const Image = sequelize.define('images', {
    imageId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
    },

    productId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false
    },

    fileName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    s3_bucketPath: {
        type: Sequelize.TEXT,
        allowNull: false
    },
})

Image.sync()
    .then(() => {
        console.log("Image table created sucessfully");
    })
    .catch((error) => {
        console.log(error);
    })

module.exports = Image;