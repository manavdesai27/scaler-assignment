
const controller = require("../controllers/room.controller.js");

var router = require("express").Router();

router.get("/types", controller.getRoomTypes);
router.get("/rooms", controller.getRooms);

module.exports = router;
