const express = require("express");
const {
  getCentres,
  getCentreSports,
  getAvailableCourts,
  getAvailableSlots,
  booking,
  addCentre,
  addSport,
  getSportsAtCentre,
  addCourt,
} = require("../controllers/Centres.js");
const router = express.Router();

router.get("/getCentres", getCentres);
router.get("/getSports/:centreId", getSportsAtCentre);
router.get("/:id/sports", getCentreSports);
router.get("/courts/:centreId/sport/:sportId/available", getAvailableCourts);
router.get("/:centre/:sport/:court/:date/timeslots", getAvailableSlots);
router.post("/add-court/:selectedSport", addCourt);

router.post("/add-sport/:centreId/:sportName", addSport);
router.post(
  "/book/:centreId/:sportId/:courtId/:startTime/:endTime/:date/:userId",
  booking
);
router.post("/add-centres", addCentre);

module.exports = router;
