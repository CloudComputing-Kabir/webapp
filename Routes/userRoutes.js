const express = require('express');
const userController = require('../Controller/userController');
const protetion = require('../Middlewear/protection');
const healthCheck = require('../health')


const router = express.Router();

router.get('/users/getAllUsers', userController.getAllUsers);
router.get('/users/getUsers/:userId', protetion, userController.getUsers);
router.post('/users/createUser', userController.createUser);
router.delete('/users/deleteUser', protetion, userController.deleteUser);
router.put('/users/updateUser/:userId', protetion, userController.updateUser);
healthCheck(router);


module.exports = router;