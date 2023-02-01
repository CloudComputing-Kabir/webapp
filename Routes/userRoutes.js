const express = require('express');
const userController = require('../Controller/userController');

const router = express.Router();

router.get('/users/getUsers', userController.getUsers);
router.post('/users/createUser', userController.createUser);
router.delete('/users/deleteUser', userController.deleteUser);
router.put('/users/updateUser/:userId', userController.updateUser);

module.exports = router;