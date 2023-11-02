const controller = require('../controllers/email.controller');

var router = require("express").Router();
router.post("/", controller.sendEmail);

module.exports = router;