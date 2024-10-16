import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, Button } from "react-bootstrap";
import axios from "axios";

const Home = () => {
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState(null);
  const [sports, setSports] = useState([]);
  const [selectedSport, setSelectedSport] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [availableCourts, setAvailableCourts] = useState([]);
  const [selectedCourt, setSelectedCourt] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchCentres = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8080/api/centres/getCentres/"
        );
        setCentres(res.data.centres);
      } catch (err) {
        console.error("Error fetching centres:", err);
        setCentres([
          {
            id: 1,
            name: "Centre 1",
            description: "Description of Centre 1",
            games: ["Basketball", "Badminton"],
          },
          {
            id: 2,
            name: "Centre 2",
            description: "Description of Centre 2",
            games: ["Tennis", "Swimming"],
          },
          {
            id: 3,
            name: "Centre 3",
            description: "Description of Centre 3",
            games: ["Football", "Squash"],
          },
        ]);
      }
    };

    fetchCentres();
  }, []);

  const handleCentreClick = async (centre) => {
    setSelectedCentre(centre);
    setSelectedSport(null);
    setSelectedDate("");
    setAvailableCourts([]);
    setAvailableSlots([]);

    try {
      const res = await axios.get(
        `http://localhost:8080/api/centres/${centre._id}/sports`
      );
      setSports(res.data.sports);
    } catch (err) {
      console.error("Error fetching sports:", err);
      setSports([]);
    }
  };

  const handleSportClick = (sport) => {
    setSelectedSport(sport);
    setSelectedDate("");
    setAvailableCourts([]);
    setAvailableSlots([]);
  };

  const fetchAvailableCourts = async () => {
    if (!selectedSport || !selectedDate) return;
    try {
      const res = await axios.get(
        `http://localhost:8080/api/centres/courts/${selectedCentre._id}/sport/${selectedSport._id}/available?date=${selectedDate}`
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
        //:centre/:sport/:court/:date/timeslots
        `http://localhost:8080/api/centres/${selectedCentre._id}/${selectedSport._id}/${selectedCourt._id}/${selectedDate}/timeslots`
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

  const handleCourtClick = (court) => {
    setSelectedCourt(court);
    fetchAvailableSlots(court._id);
  };

  const handleSlotClick = (slot) => {
    setStartTime(slot.startTime); // Store start time
    setEndTime(slot.endTime); // Store end time
    setSelectedCourt((prev) => ({ ...prev, timeSlot: slot })); // Store selected time slot in court
  };

  const handleBooking = async () => {
    if (!selectedCourt || !selectedDate || !selectedSport || !selectedCentre) {
      return; // Ensure all necessary data is available
    }

    const bookingUrl = `http://localhost:8080/api/centres/book/${
      selectedCentre._id
    }/${selectedSport._id}/${selectedCourt._id}/${startTime}/${
      endTime + ":00"
    }/${selectedDate}/${userId}`;
    try {
      const res = await axios.post(bookingUrl);
      alert("Booking successful!");
      console.log("Booking response:", res.data);
      fetchAvailableSlots(selectedCourt._id);
    } catch (err) {
      console.error("Error during booking:", err);
      alert("Booking failed. Please try again.");
    }
  };

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
         
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link href="/home">Home</Nav.Link>
              {!userId && <Nav.Link href="/login">Login</Nav.Link>}
              {!userId && <Nav.Link href="/register">Register</Nav.Link>}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container className="mt-5">
        <h2>Book Your Game</h2>
        <form className="booking-form">
          <div className="form-group">
            <label htmlFor="centreSelect">Select Centre</label>
            <ul className="scrollable-list" id="centreSelect">
              {centres.map((centre) => (
                <li
                  key={centre.id}
                  onClick={() => handleCentreClick(centre)}
                  className="list-item"
                >
                  {centre.name}
                </li>
              ))}
            </ul>
          </div>

          <div className="form-group">
            <label htmlFor="sportSelect">Select Sport</label>
            {selectedCentre && (
              <ul className="scrollable-list" id="sportSelect">
                {sports.length > 0 ? (
                  sports.map((sport) => (
                    <li
                      key={sport._id}
                      onClick={() => handleSportClick(sport)}
                      className="list-item"
                    >
                      {sport.name}
                    </li>
                  ))
                ) : (
                  <p>No games available</p>
                )}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="dateSelect">Select Date</label>
            {selectedSport && (
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                id="dateSelect"
                className="small-input"
                style={{ marginBottom: "10px" }}
              />
            )}
            {selectedDate && (
              <div className="mt-2 selected-date">
                <p>
                  Selected Date: {new Date(selectedDate).toLocaleDateString()}
                </p>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="courtSelect">Select Court</label>
            {availableCourts.length > 0 && (
              <ul className="scrollable-list" id="courtSelect">
                {availableCourts.map((court) => (
                  <li
                    key={court._id}
                    onClick={() => handleCourtClick(court)}
                    className="list-item"
                  >
                    {court.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="timeSlotSelect">Select Time Slot</label>
            {selectedCourt && availableSlots.length > 0 && (
              <ul className="scrollable-list" id="timeSlotSelect">
                {availableSlots.map((slot, index) => (
                  <li
                    key={index}
                    onClick={() => handleSlotClick(slot)}
                    className="list-item"
                  >
                    {slot.startTime} - {slot.endTime}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Button
            variant="primary"
            type="button"
            onClick={handleBooking}
            disabled={
              !selectedCourt ||
              !selectedDate ||
              !selectedSport ||
              !selectedCentre ||
              !startTime || // Ensure start time is selected
              !endTime // Ensure end time is selected
            }
            className="book-button"
          >
            Book Court
          </Button>
        </form>

        <style jsx>{`
          .booking-form {
            max-width: 500px; /* Set max width of the form */
            margin: 0 auto; /* Center the form */
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9; /* Light background for the form */
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1); /* Add a subtle shadow */
          }

          .scrollable-list {
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px;
            margin-bottom: 20px;
            list-style-type: none;
            padding-left: 0;
            background-color: #fff; /* White background for lists */
          }

          .scrollable-list li {
            padding: 8px;
            cursor: pointer;
            transition: background-color 0.3s;
          }

          .scrollable-list li:hover {
            background-color: #f0f0f0; /* Change background color on hover */
          }

          .form-group {
            margin-bottom: 20px;
          }

          .small-input {
            width: 150px; /* Set the desired width */
          }

          h2 {
            text-align: center; /* Center the heading */
            margin-bottom: 30px; /* Space below the heading */
          }

          .list-item {
            transition: background-color 0.3s; /* Smooth background transition */
          }

          .selected-date {
            font-weight: bold; /* Make selected date bold */
            color: #333; /* Dark color for visibility */
          }

          .book-button {
            width: 100%; /* Full-width button */
            padding: 10px; /* Padding for button */
            font-size: 16px; /* Larger font for button text */
          }

          .book-button:disabled {
            background-color: #ccc; /* Disabled button color */
            cursor: not-allowed; /* Change cursor when disabled */
          }
        `}</style>
      </Container>
    </>
  );
};

export default Home;
