const express = require('express');
const router = express.Router();
const typeController = require('../controllers/typeController.js');

router.post('/add', typeController.createType)

router.get('/types', typeController.getAllTypes);

router.post('/delete', typeController.deleteType)

module.exports = router;