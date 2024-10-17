import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const URL = "https://games-theory-frontend.vercel.app";
const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [errorMessage, setErrorMessage] = useState(""); // Error message for API call
  const [validationError, setValidationError] = useState(""); // For form validation errors
  const navigate = useNavigate();

  const validateForm = () => {
    // Check if the name is at least 2 characters long
    if (name.length < 2) {
      return "Name must be at least 2 characters long.";
    }

    // Email validation using a simple regex pattern
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      return "Please enter a valid email address.";
    }

    // Password validation
    if (password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return ""; // No validation errors
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Reset error message before new submission
    setValidationError(""); // Reset validation error

    const validationError = validateForm();
    if (validationError) {
      setValidationError(validationError);
      return; // Do not proceed if validation fails
    }

    try {
      const response = await axios.post(`${URL}/api/auth/createUser/`, {
        name,
        email,
        password,
        role,
      });

      console.log("Registration successful", response.data);

      // Clear the form
      setName("");
      setEmail("");
      setPassword("");
      setRole("customer");

      // Navigate to the login page
      navigate("/login");
    } catch (error) {
      if (error.response) {
        // Server responded with a status other than 200 range
        setErrorMessage(error.response.data.message || "Email already used");
      } else if (error.request) {
        // Request was made but no response received
        setErrorMessage("No response from the server. Please try again.");
      } else {
        // Other errors
        setErrorMessage(error.message);
      }
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Register</h2>

      {/* Display validation error message if any */}
      {validationError && (
        <div style={styles.validationError}>{validationError}</div>
      )}

      {/* Display API error message if any */}
      {errorMessage && <div style={styles.error}>{errorMessage}</div>}

      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.inputGroup}>
          <label style={styles.label}>Role:</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
          >
            <option value="customer">Customer</option>
            <option value="manager">Manager</option>
          </select>
        </div>
        <button type="submit" style={styles.button}>
          Register
        </button>
      </form>
      <p style={styles.footer}>
        Already have an account?{" "}
        <a href="/login" style={styles.link}>
          Login here
        </a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    backgroundColor: "#f4f4f4",
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    marginBottom: "20px",
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "300px",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    backgroundColor: "white",
  },
  inputGroup: {
    marginBottom: "15px",
  },
  label: {
    marginBottom: "5px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    transition: "border-color 0.3s",
  },
  button: {
    padding: "10px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  footer: {
    marginTop: "20px",
    color: "#666",
  },
  link: {
    color: "#007bff",
    textDecoration: "none",
  },
  error: {
    color: "red",
    marginBottom: "15px",
    fontWeight: "bold",
  },
  validationError: {
    color: "orange",
    marginBottom: "15px",
    fontWeight: "bold",
  },
};

export default Register;
