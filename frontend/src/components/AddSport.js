// AddSport.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Container,
} from "@mui/material";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";

const AddSport = () => {
 
  const [centres, setCentres] = useState([]);
  const [selectedCentre, setSelectedCentre] = useState("");
  const [sportName, setSportName] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const navigate = useNavigate();

  useEffect(() => {
    // Check if the user is a manager
    const userType = localStorage.getItem("userRole");
    if (userType !== "manager") {
      // Redirect to home or show an error
      navigate("/home");
    } else {
      fetchCentres();
    }
  }, [navigate]);

  const fetchCentres = async () => {
    try {
      const res = await axios.get(
        `${process.env.GLOBALURL}/api/centres/getCentres`
      );
      setCentres(res.data.centres || []);
    } catch (err) {
      showMessage("Error fetching centres", "error");
    }
  };

  const showMessage = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const addSport = async () => {
    if (!selectedCentre || !sportName) {
      showMessage("Please fill in all fields", "warning");
      return;
    }
    try {
      await axios.post(
        `${process.env.GLOBALURL}/api/centres/add-sport/${selectedCentre}/${sportName}`
      );
      setSportName("");
      showMessage("Sport added successfully", "success");
    } catch (err) {
      const errorMessage =
        err.response && err.response.data && err.response.data.message
          ? err.response.data.message
          : "Error adding sport";
      showMessage(errorMessage, "error");
    }
  };

  return (
    <Sidebar>
      <Container maxWidth="md">
        <Typography variant="h4" gutterBottom>
          Add Sport
        </Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>Select Centre</InputLabel>
            <Select
              value={selectedCentre}
              onChange={(e) => setSelectedCentre(e.target.value)}
            >
              {centres.map((centre) => (
                <MenuItem key={centre._id} value={centre._id}>
                  {centre.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Sport Name"
            value={sportName}
            onChange={(e) => setSportName(e.target.value)}
            margin="normal"
            disabled={!selectedCentre}
          />
          <Button
            variant="contained"
            onClick={addSport}
            fullWidth
            sx={{ mt: 2 }}
            disabled={!selectedCentre || !sportName}
          >
            Add Sport
          </Button>
        </Box>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={4000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Sidebar>
  );
};

export default AddSport;
