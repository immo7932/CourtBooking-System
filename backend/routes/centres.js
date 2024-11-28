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
  getAllUsers,
} = require("../controllers/Centres.js");
const verifyAdmin = require("../middlewareAdmin.js");
const verifyUser = require("../middlewareUser.js");
//console.log(middleWare1)
const router = express.Router();

router.get("/getCentres", getCentres);
router.get("/getSports/:centreId", getSportsAtCentre);
router.get("/:id/sports", getCentreSports);
router.get("/courts/:centreId/sport/:sportId/available", getAvailableCourts);
router.get("/:centre/:sport/:court/:date/timeslots", getAvailableSlots);
router.post("/add-court/:selectedSport", verifyAdmin, addCourt);
router.get("/getAllUsers", getAllUsers);
router.post("/add-sport/:centreId/:sportName", verifyAdmin, addSport);
router.post(
  "/book/:centreId/:sportId/:courtId/:startTime/:endTime/:date/:userId",
  verifyUser,
  booking
);
router.post("/add-centres", verifyAdmin, addCentre);

module.exports = router;
