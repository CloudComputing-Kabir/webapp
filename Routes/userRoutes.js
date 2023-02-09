const express = require('express');
const userController = require('../Controller/userController');
const protetion = require('../Middlewear/protection');
const productProtection = require('../Middlewear/productProtection');
const healthCheck = require('../health')


const router = express.Router();
//User Routes:
router.get('/users/getAllUsers', userController.getAllUsers);
router.get('/users/getUsers/:userId', protetion, userController.getUsers);
// router.post('/users/createUser', userController.createUser);
// router.put('/users/updateUser/:userId', protetion, userController.updateUser);
//User Routes:

//Product Routes:
router.get('/v1/getProducts', userController.getProducts);
// router.post('/v1/product/:userId', userController.addProduct);
// router.put('/v1/product/:productId/:userId', userController.updateProduct);
// router.delete('/v1/product/:productId/:userId', userController.deleteProduct);
//Product Routes:


//Sequelize Product:
router.post('/v1/product/:userId', userController.createProduct);
router.put('/v1/product/:prodId/:userId', productProtection, userController.productUpdate);
router.patch('/v1/product/:prodId/:userId', userController.productUpdatePatch);
router.delete('/v1/product/:prodId', productProtection, userController.productDelete);
router.get('/v1/product/getAllProduct', userController.getAllProduct);
router.get('/v1/product/:prodId', productProtection, userController.getSingleProduct);
//Sequelize:

//Sequeslize User:
router.post('/v1/user', userController.userCreate);
router.put('/v1/user/:userId', protetion, userController.userUpdate);
router.get('/v1/user/:userId', protetion, userController.userGetAccount);
//Sequeslize User:




module.exports = router;