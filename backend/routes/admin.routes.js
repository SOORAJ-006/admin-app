const express = require('express');
const router = express.Router();
const {userRegistration , userLogin} = require('../controller/admin.controller.js');

router.post('/register', userRegistration).post('/login' , userLogin);

module.exports = router;