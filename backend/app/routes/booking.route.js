
const controller = require("../controllers/booking.controller.js");

var router = require("express").Router();

router.get("/", controller.findAll);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", controller.delete);

router.get("/available", controller.findEmptyRooms);
router.get("/isEmpty", controller.checkRoomAvailability);

module.exports = router;