'use client';

import { useState } from "react";
import { TextField, Button, Card, CardContent, Typography } from "@mui/material";
import '../globals.css';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) {
      setError("Both fields are required.");
      return;
    }
    console.log("Logging in with", { email, password });
  };

  return (
    <div className="login-container">
      <Card className="login-card">
        <CardContent>
          <Typography variant="h5" align="center" gutterBottom className="login-title">
            Login
          </Typography>
          {error && <Typography className="error-msg" color="error">{error}</Typography>}
          <form onSubmit={handleSubmit} className="login-form">

            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="login-input"
            />

            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="login-input"
            />

            <Button type="submit" variant="contained" className="login-button" fullWidth>
              Login
            </Button>

            <p>Would you like to Sign up?</p>

          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
