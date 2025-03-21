const {
    createClass,
    updateClass,
    deleteClass,
    getClass,
    getAllClasses
} = require('../controller/class.controller');

const express = require('express');
const router = express.Router();

router.post('/', createClass)
.put('/:id', updateClass)
.delete('/:id', deleteClass)
.get('/:id', getClass)
.get('/', getAllClasses);

module.exports = router;