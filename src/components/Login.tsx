import React, { useState } from "react";
import {Container,Paper,Typography,TextField,Button,Box,Alert,} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";
import { loginApi } from "../services/api";
import { loginPayload } from "../utils/payload";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const payload = loginPayload(email, password);
      const loginData = await loginApi(payload);
      if (!loginData.access_token) {
        setError("Invalid credentials");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", loginData.access_token);
      const decoded: any = jwtDecode(loginData.access_token);
      localStorage.setItem("role", decoded.role);
      localStorage.setItem("email", decoded.email);
      setError("");
      window.location.href = "/employees";
    } catch (err) {
      console.error(err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Container
      maxWidth="sm"
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#0f0f0f",
      }}
    >
      <Paper
        elevation={10}
        sx={{
          padding: 5,
          width: "100%",
          borderRadius: 4,
          backgroundColor: "#1e1e1e",
          color: "white",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: 3,
            color: "white",
          }}
        >
          Employee Login
        </Typography>

        <Box component="form" onSubmit={handleLogin}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              input: {
                color: "white",
              },
              label: {
                color: "#bdbdbd",
              },
            }}
          />

          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{
              input: {
                color: "white",
              },
              label: {
                color: "#bdbdbd",
              },
            }}
          />

          {error && (
            <Alert
              severity="error"
              sx={{
                marginTop: 2,
              }}
            >
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            startIcon={<LoginIcon />}
            disabled={loading}
            sx={{
              marginTop: 3,
              padding: 1.5,
              fontWeight: "bold",
              borderRadius: 2,
              backgroundColor: "#1976d2",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
