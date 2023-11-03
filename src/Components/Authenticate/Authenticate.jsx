// React Imports
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

// Material UI Imports
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import LoadingButton from "@mui/lab/LoadingButton";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

// Firebase Imports
import { auth } from "../../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

import "./styles.css";

const Authenticate = () => {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleShowPassword = () => setShowPassword((show) => !show);

  const handleInputChange = (ev) => {
    const { name, value } = ev.target;
    const currData = credentials;
    currData[`${name}`] = value;
    setCredentials(currData);
  };

  const handleLogin = () => {
    const { email, password } = credentials;
    setIsLoading(true);
    signInWithEmailAndPassword(auth, email, password)
      .then(() => navigate("/"))
      .catch((err) => {
        setIsLoading(false);
        setError(err);
      });
  };

  return (
    <div className="authContainer">
      <div className="authHeader">QuickChat Login</div>
      <div className="authWrapper">
        <div className="emailClass">
          <TextField
            label="Email"
            variant="standard"
            name="email"
            id="email"
            onChange={handleInputChange}
            fullWidth
          />
        </div>
        <FormControl sx={{ m: 1 }} variant="standard">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            name="password"
            onChange={handleInputChange}
          />
        </FormControl>
        <div>
          <LoadingButton
            variant="outlined"
            isLoading={isLoading}
            loadingPosition="start"
            sx={{
              padding: "10px 20px",
              marginTop: "16px",
              marginBottom: "12px",
            }}
            onClick={() => handleLogin()}
          >
            Login
          </LoadingButton>
        </div>
        {error && <div className="loginError">{error.code.split("/")[1]}</div>}
        <div>
          Create a new account by <a href="/signup">Signing up</a> here
        </div>
      </div>
    </div>
  );
};

export default Authenticate;
