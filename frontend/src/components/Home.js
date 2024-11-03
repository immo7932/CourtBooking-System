// Home.js
import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  TextField,
  Box,
  Backdrop,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import axios from "axios";
import Sidebar from "./Sidebar"; // Import the Sidebar component
const API_URL =
  process.env.NODE_ENV === "development"
    ? process.env.REACT_APP_LOCALURL
    : process.env.REACT_APP_GLOBALURL;



const Home = () => {
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [availableCourts, setAvailableCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const userId = localStorage.getItem("userId");

  // New state variables for loading and Snackbar
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success", // 'success' | 'error' | 'warning' | 'info'
  });

  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/centres/getCentres/`
        );
        setCentres(res.data.centres);
      } catch (err) {
        console.error("Error fetching centres:", err);
      }
    };

    fetchCentres();
  }, []);

  const handleCentreChange = async (event) => {
    const centreId = event.target.value;
    const centre = centres.find((c) => c._id === centreId);
    setSelectedCentre(centre);
    setSelectedSport(null);
    setSelectedDate(null);
    setAvailableCourts([]);
    setAvailableSlots([]);
    setSelectedCourt(null);

    if (centre) {
      try {
        console.log(API_URL)
        const res = await axios.get(
          `${API_URL}/api/centres/${centre._id}/sports`
        );
        setSports(res.data.sports);
      } catch (err) {
        console.error("Error fetching sports:", err);
        setSports([]);
      }
    }
  };

  const handleSportChange = (event) => {
    const sportId = event.target.value;
    const sport = sports.find((s) => s._id === sportId);
    setSelectedSport(sport);
    setSelectedDate(null);
    setAvailableCourts([]);
    setAvailableSlots([]);
    setSelectedCourt(null);
  };

  const fetchAvailableCourts = async () => {
    if (!selectedSport || !selectedDate) return;
    try {
      const res = await axios.get(
        `${API_URL}/api/centres/courts/${selectedCentre._id}/sport/${selectedSport._id}/available?date=${selectedDate}`
      );
      setAvailableCourts(res.data.availableCourts);
    } catch (err) {
      console.error("Error fetching available courts:", err);
      setAvailableCourts([]);
    }
  };

  const fetchAvailableSlots = async (courtId) => {
    if (!courtId || !selectedDate) return;

    try {
      const res = await axios.get(
        `${API_URL}/api/centres/${selectedCentre._id}/${selectedSport._id}/${courtId}/${selectedDate}/timeslots`
      );
      console.log(res.data);
      setAvailableSlots(res.data.availableSlots);
    } catch (err) {
      console.error("Error fetching available slots:", err);
      setAvailableSlots([]);
    }
  };

  useEffect(() => {
    fetchAvailableCourts();
  }, [selectedSport, selectedDate]);

  const handleCourtChange = (event) => {
    const courtId = event.target.value;
    const court = availableCourts.find((c) => c._id === courtId);
    setSelectedCourt(court);
    fetchAvailableSlots(courtId);
  };

  const handleSlotClick = (slot) => {
    setStartTime(slot.startTime);
    setEndTime(slot.endTime);
    setSelectedCourt((prev) => ({ ...prev, timeSlot: slot }));
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedSport || !selectedCentre) {
      return;
    }

    setLoading(true); // Start loading

    const bookingUrl = `${API_URL}/api/centres/book/${selectedCentre._id}/${selectedSport._id}/${selectedCourt._id}/${startTime}/${endTime}:00/${selectedDate}/${userId}`;
    try {
      const res = await axios.post(bookingUrl);
      console.log("Booking response:", res.data);
      setSnackbar({
        open: true,
        message: "Booking successful!",
        severity: "success",
      });
      fetchAvailableSlots(selectedCourt._id);
      // Optionally reset states here if needed
    } catch (err) {
      console.error("Error during booking:", err);
      setSnackbar({
        open: true,
        message: "Booking failed. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  return (
    <Sidebar>
      {" "}
      {/* Wrap your content with the Sidebar */}
      <Container maxWidth="md">
        <Typography variant="h4" component="h2" gutterBottom>
          Book Your Game
        </Typography>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <Box component="form">
            <FormControl fullWidth margin="normal">
              <InputLabel id="centre-select-label">Select Centre</InputLabel>
              <Select
                labelId="centre-select-label"
                id="centre-select"
                value={selectedCentre ? selectedCentre._id : ""}
                onChange={handleCentreChange}
                label="Select Centre"
              >
                {centres.map((centre) => (
                  <MenuItem key={centre._id} value={centre._id}>
                    {centre.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal" disabled={!selectedCentre}>
              <InputLabel id="sport-select-label">Select Sport</InputLabel>
              <Select
                labelId="sport-select-label"
                id="sport-select"
                value={selectedSport ? selectedSport._id : ""}
                onChange={handleSportChange}
                label="Select Sport"
              >
                {sports.map((sport) => (
                  <MenuItem key={sport._id} value={sport._id}>
                    {sport.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {selectedSport && (
              <DatePicker
                label="Select Date"
                value={selectedDate ? dayjs(selectedDate) : null}
                onChange={(newValue) => {
                  setSelectedDate(
                    newValue ? newValue.format("YYYY-MM-DD") : ""
                  );
                }}
                renderInput={(params) => (
                  <TextField {...params} fullWidth margin="normal" />
                )}
                minDate={dayjs()}
              />
            )}

            {availableCourts.length > 0 && (
              <FormControl fullWidth margin="normal">
                <InputLabel id="court-select-label">Select Court</InputLabel>
                <Select
                  labelId="court-select-label"
                  id="court-select"
                  value={selectedCourt ? selectedCourt._id : ""}
                  onChange={handleCourtChange}
                  label="Select Court"
                >
                  {availableCourts.map((court) => (
                    <MenuItem key={court._id} value={court._id}>
                      {court.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}

            {selectedCourt && availableSlots.length > 0 && (
              <>
                <Typography variant="h6" component="h4" gutterBottom>
                  Available Time Slots
                </Typography>
                <Grid container spacing={2}>
                  {availableSlots.map((slot, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                      <Card
                        sx={{
                          backgroundColor: slot.booked ? "#f8d7da" : "#d4edda",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6">
                            {slot.startTime} - {slot.endTime}
                          </Typography>
                          {slot.booked ? (
                            <Typography variant="body2">
                              Booked by: {slot.bookedBy.name}
                            </Typography>
                          ) : (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => handleSlotClick(slot)}
                            >
                              Book this slot
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </>
            )}

            <Box mt={2}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleBooking}
                disabled={
                  !selectedCourt ||
                  !selectedDate ||
                  !selectedSport ||
                  !selectedCentre ||
                  !startTime ||
                  !endTime ||
                  loading // Disable button when loading
                }
              >
                {loading ? "Booking..." : "Book Court"}
              </Button>
            </Box>
          </Box>
        </LocalizationProvider>

        {/* Loader */}
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>

        {/* Snackbar for success/error messages */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={handleSnackbarClose}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Sidebar>
  );
};



export default Home;
