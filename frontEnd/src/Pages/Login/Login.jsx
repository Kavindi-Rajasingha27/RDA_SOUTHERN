// // src/Pages/Login/Login.js
// import React, { useState } from "react";
// import {
//   Button,
//   TextField,
//   Container,
//   Typography,
//   Box,
//   Alert,
// } from "@mui/material";
// import { useNavigate } from "react-router-dom";
// import { useAuth } from "../../AuthContext/AuthContext";
// import axios from "axios";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const { login } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     setError("");

//     try {
//       const response = await axios.post(
//         "https://api.waverista.com/public/api/login",
//         {
//           username,
//           password,
//         }
//       );

//       if (response.data && response.data.token) {
//         login(response.data.token);
//         navigate("employee");
//       } else {
//         setError("Login failed. Please check your credentials.");
//       }
//     } catch (err) {
//       setError(
//         err.response?.data?.message || "An error occurred during login."
//       );
//     }
//   };

//   return (
//     <Container maxWidth="xs">
//       <Box
//         sx={{
//           marginTop: 8,
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//         }}
//       >
//         <Typography component="h1" variant="h5">
//           Login
//         </Typography>
//         {error && (
//           <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
//             {error}
//           </Alert>
//         )}
//         <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             id="username"
//             label="Username"
//             name="username"
//             autoComplete="username"
//             autoFocus
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />
//           <TextField
//             margin="normal"
//             required
//             fullWidth
//             name="password"
//             label="Password"
//             type="password"
//             id="password"
//             autoComplete="current-password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <Button
//             type="submit"
//             fullWidth
//             variant="contained"
//             sx={{ mt: 3, mb: 2 }}
//           >
//             Sign In
//           </Button>
//         </Box>
//       </Box>
//     </Container>
//   );
// };

// export default Login;

import React, { useState } from "react";
import {
  Button,
  TextField,
  Container,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../AuthContext/AuthContext";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
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
        "https://api.waverista.com/public/api/login",
        requestData
      );

      if (response.data && response.data.access_token) {
        login(response.data.access_token);
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
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
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
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;
