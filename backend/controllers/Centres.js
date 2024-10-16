const Centres = require("../models/Centres");
const Sports = require("../models/Sports");
const Courts = require("../models/Courts");
const mongoose = require("mongoose");
const Bookings = require("../models/Bookings");
const moment = require("moment");
const getCentres = async (req, res) => {
  try {
    const centres = await Centres.find();
    res.json({ success: true, centres });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// backend/controller/centre.controller.js

// Get all sports for a particular centre
const getCentreSports = async (req, res) => {
  const centreId = req.params.id; // Get the centre ID from request parameters

  try {
    // Find all sports associated with the centre ID
    const sports = await Sports.find({ centre: centreId }).populate({
      path: "courts", // Populate the courts associated with each sport
      model: "Courts", // Reference to the Courts model
    });

    // If no sports are found, return a 404 response
    if (!sports || sports.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No sports found for this centre" });
    }

    // Log the found sports and send the response
    // console.log(sports);
    res.json({ success: true, sports });
  } catch (error) {
    // Handle and log any errors
    console.error("Error fetching sports for the centre:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getAvailableCourts = async (req, res) => {
  const { centreId, sportId } = req.params; // Get centre ID and sport ID from request parameters
  const { date } = req.query; // Get date from query parameters
  console.log(centreId, sportId, date);
  // Validate input
  if (!date) {
    return res
      .status(400)
      .json({ success: false, message: "Date is required" });
  }

  try {
    // Fetch all courts for the specified sport
    const courts = await Courts.find({ sport: sportId });

    // Fetch bookings for the specified sport and date
    const bookings = await Bookings.find({
      centre: centreId,
      sport: sportId,
      date: {
        $gte: new Date(date + "T00:00:00.000Z"), // Start of the day
        $lt: new Date(date + "T23:59:59.999Z"), // End of the day
      },
    }).select("court"); // Select only court IDs from bookings

    // Extract booked court IDs
    const bookedCourtIds = bookings.map((booking) => booking.court.toString());

    // Filter out booked courts from the available courts
    const availableCourts = courts.filter(
      (court) => !bookedCourtIds.includes(court._id.toString())
    );

    // If no courts are available, return a 404 response
    if (!availableCourts || availableCourts.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No available courts found for this sport on the selected date",
      });
    }

    // Send the response with available courts
    res.json({ success: true, availableCourts });
  } catch (error) {
    console.error("Error fetching available courts:", error);
    res.status(500).json({ success: false, message: "Server Error hai" });
  }
};
const getAvailableSlots = async (req, res) => {
  try {
    const { centre, sport, court, date } = req.params;

    // *1. Validate Input Parameters*
    if (!centre || !sport || !court || !date) {
      return res.status(400).json({
        message:
          "Missing required query parameters: centre, sport, court, date.",
      });
    }

    // Validate ObjectId formats
    if (!mongoose.Types.ObjectId.isValid(centre)) {
      return res.status(400).json({ message: "Invalid Centre ID format." });
    }
    if (!mongoose.Types.ObjectId.isValid(sport)) {
      return res.status(400).json({ message: "Invalid Sport ID format." });
    }
    if (!mongoose.Types.ObjectId.isValid(court)) {
      return res.status(400).json({ message: "Invalid Court ID format." });
    }

    // Validate Date
    const bookingDate = new Date(date);
    if (isNaN(bookingDate.getTime())) {
      return res
        .status(400)
        .json({ message: "Invalid date format. Use YYYY-MM-DD." });
    }

    // *2. Verify Relationships*

    // Check if Centre exists
    const foundCentre = await Centres.findById(centre);
    if (!foundCentre) {
      return res.status(404).json({ message: "Centre not found." });
    }

    // Check if Sport exists and belongs to Centre
    const foundSport = await Sports.findOne({ _id: sport, centre: centre });
    if (!foundSport) {
      return res
        .status(404)
        .json({ message: "Sport not found in the specified Centre." });
    }

    // Check if Court exists and belongs to Sport
    const foundCourt = await Courts.findOne({ _id: court, sport: sport });
    if (!foundCourt) {
      return res
        .status(404)
        .json({ message: "Court not found under the specified Sport." });
    }

    // *3. Generate Time Slots*
    const generateTimeSlots = (
      start = "08:00",
      end = "20:00",
      interval = 60
    ) => {
      const slots = [];
      let [startHour, startMinute] = start.split(":").map(Number);
      const [endHour, endMinute] = end.split(":").map(Number);

      while (
        startHour < endHour ||
        (startHour === endHour && startMinute < endMinute)
      ) {
        const slotStart = `${startHour
          .toString()
          .padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
        let nextHour = startHour;
        let nextMinute = startMinute + interval;
        if (nextMinute >= 60) {
          nextMinute -= 60;
          nextHour += 1;
        }
        const slotEnd = `${nextHour.toString().padStart(2, "0")}:${nextMinute
          .toString()
          .padStart(2, "0")}`;
        slots.push({ startTime: slotStart, endTime: slotEnd });
        startHour = nextHour;
        startMinute = nextMinute;
      }

      return slots;
    };

    const timeSlots = generateTimeSlots();

    // *4. Check Existing Bookings*

    // Define start and end of the day for querying
    const startOfDay = new Date(bookingDate);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(bookingDate);
    endOfDay.setHours(23, 59, 59, 999);

    // Fetch bookings for the specified court and date
    const existingBookings = await Bookings.find({
      centre: centre,
      sport: sport,
      court: court,
      date: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    });

    // Extract booked start times
    const bookedStartTimes = existingBookings.map(
      (booking) => booking.startTime
    );

    // *5. Determine Available Slots*
    const availableSlots = timeSlots.filter(
      (slot) => !bookedStartTimes.includes(slot.startTime)
    );

    // *6. Respond with Available Slots*
    return res.status(200).json({
      success: true,
      date: date,
      centre: centre,
      sport: sport,
      court: court,
      availableSlots: availableSlots,
    });
  } catch (error) {
    console.error("Error in getAvailableSlots:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};

const booking = async (req, res) => {
  const { centreId, sportId, courtId, startTime, endTime, date, userId } =
    req.params;
  // Assuming you send date and userId in the request body

  // Validate input
  if (!date || !userId) {
    return res
      .status(400)
      .json({ success: false, message: "Date and user ID are required" });
  }

  try {
    // Create a new booking document
    const newBooking = new Bookings({
      centre: mongoose.Types.ObjectId(centreId),
      sport: mongoose.Types.ObjectId(sportId),
      court: mongoose.Types.ObjectId(courtId),
      date: new Date(date), // Ensure this is the correct format
      startTime,
      endTime,
      user: mongoose.Types.ObjectId(userId), // Assuming you have the user ID in the request body
    });

    // Save the booking
    await newBooking.save();

    res.status(201).json({
      success: true,
      message: "Court booked successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error booking court:", error);
    res.status(500).json({
      success: false,
      message: "Failed to book the court",
      error: error.message,
    });
  }
};
module.exports = {
  getCentres,
  getCentreSports,
  getAvailableCourts,
  getAvailableSlots,
  booking,
};


