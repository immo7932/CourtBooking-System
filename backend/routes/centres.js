const express = require("express");
const {
  getCentres,
  getCentreSports,
  getAvailableCourts,
  getAvailableSlots,
  booking,
} = require("../controllers/Centres.js");
const router = express.Router();

router.get("/getCentres", getCentres);
router.get("/:id/sports", getCentreSports);
router.get("/courts/:centreId/sport/:sportId/available", getAvailableCourts);

router.get("/:centre/:sport/:court/:date/timeslots", getAvailableSlots);
router.post(
  "/book/:centreId/:sportId/:courtId/:startTime/:endTime/:date/:userId",
  booking
);
module.exports = router;
