import {
  Alert,
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";
import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";

const Login = () => {
  const [username, setUsername] = useState("assistant_engineer");
  const [password, setPassword] = useState("ae@rda123");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      const requestData = { user_name: username, password: password };
      console.log("test", requestData);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/login",
        requestData
      );

      if (response.data && response.data.access_token) {
        login(response.data.access_token, response.data.user);
        navigate("/");
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error Response: ", err.response);
      setError(
        err.response?.data?.message || "An error occurred during login."
      );
    }
  };

  return (
    <div>
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "#000000", // Background color
            padding: { xs: 2, sm: 4, md: 6 }, // Responsive padding
            borderRadius: 2,
            boxShadow: 3,
            width: { xs: "90%", sm: "70%", md: "50%" }, // Responsive width
            maxWidth: "500px", // Ensures it doesn't get too large on wider screens
          }}
        >
          <Typography component="h1" variant="h5" sx={{ color: "#ffcc00" }}>
            Login
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              InputLabelProps={{
                style: { color: "#ffcc00" },
              }}
              InputProps={{
                style: { color: "#ffffff", borderColor: "#ffcc00" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffcc00",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffcc00",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffcc00",
                  },
                },
              }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{
                style: { color: "#ffcc00" },
              }}
              InputProps={{
                style: { color: "#ffffff" },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#ffcc00",
                  },
                  "&:hover fieldset": {
                    borderColor: "#ffcc00",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#ffcc00",
                  },
                },
              }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                bgcolor: "#ffcc00", // Button background color
                color: "#000000", // Button text color
                "&:hover": {
                  bgcolor: "#e6b800",
                },
              }}
            >
              Sign In
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default Login;
