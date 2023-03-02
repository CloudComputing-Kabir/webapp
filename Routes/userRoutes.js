const express = require('express');
const userController = require('../Controller/userController');
const protetion = require('../Middlewear/protection');
const productProtection = require('../Middlewear/productProtection');
const healthCheck = require('../health');
const userProtection = require('../Middlewear/userProtection');
const multer = require('multer');

//Functions for Multer storage and filtering process //
const fileStorage = multer.memoryStorage();

const filteredFile = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' || file.mimetype === 'image/jpg') {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
}
//Functions for Multer storage and filtering process //


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
router.post('/v1/product', protetion, userController.createProduct);
router.put('/v1/product/:prodId', productProtection, userController.productUpdate);
router.patch('/v1/product/:prodId', productProtection, userController.productUpdatePatch);
router.delete('/v1/product/:prodId', productProtection, userController.productDelete);
router.get('/v1/product/getAllProduct', userController.getAllProduct);
router.get('/v1/product/:prodId', userController.getSingleProduct);
//Sequelize:

//Sequeslize User:
router.post('/v1/user', userController.userCreate);
router.put('/v1/user/:userId', userProtection, userController.userUpdate);
router.get('/v1/user/:userId', userProtection, userController.userGetAccount);
//Sequeslize User:

//Sequelize Image:
router.post('/v1/product/:productId/image', multer({ storage: fileStorage, fileFilter: filteredFile }).single('s3_bucketPath'), userController.uploadDocument);
router.get('/v1/product/:productId/image', userController.getAllDocuments);
router.get('/v1/product/:productId/image/:imageId', userController.getSingleDocument);
router.delete('/v1/product/:productId/image/:imageId', userController.deleteDocument);
//Sequelize Image:



module.exports = router;