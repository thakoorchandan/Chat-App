// React Imports
import React from "react";
import { useNavigate } from "react-router-dom";

// Material UI Imports
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Input from "@mui/material/Input";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LoadingButton from "@mui/lab/LoadingButton";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

// Firebase Imports
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";

import "./styles.css";

export default function Signup() {
  const [user, setUser] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [displayPicture, setDisplayPicture] = React.useState(null);
  const [showPassword, setShowPassword] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const navigate = useNavigate();

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleWrapperClick = () => {
    !displayPicture && document.getElementById(`profile_fileupload`).click();
  };

  const handleInputChange = (ev) => {
    const { name, value, files } = ev.target;
    const currData = user;
    if (name === "picture") {
      currData[`${name}`] = files[0];
    } else {
      currData[`${name}`] = value;
    }
    setUser(currData);
  };

  const handleFileChange = (ev) => {
    const { files } = ev.target;
    setDisplayPicture(files[0]);
  };

  const handleSubmit = () => {
    setLoading(true);
    const createUserPromise = new Promise((resolve) =>
      resolve(createUserWithEmailAndPassword(auth, user.email, user.password))
    );
    createUserPromise
      .then((createRes) => {
        const storageRef = ref(
          storage,
          `${user.firstName}_${user.lastName}_${new Date().getTime()}`
        );
        return uploadBytesResumable(storageRef, displayPicture).then(() => [
          storageRef,
          createRes,
        ]);
      })
      .then((res) => {
        const [storageRef, createRes] = res;
        return getDownloadURL(storageRef).then((res) => [res, user, createRes]);
      })
      .then(async (res) => {
        const [downloadURL, user, createRes] = res;
        await updateProfile(createRes.user, {
          displayName: `${user.firstName} ${user.lastName}`,
          photoURL: downloadURL,
        });
        await setDoc(doc(db, "users", createRes.user.uid), {
          uid: createRes.user.uid,
          displayName: `${user.firstName} ${user.lastName}`,
          displayNameInsensitive: `${user.firstName.toUpperCase()} ${user.lastName.toUpperCase()}`,
          email: user.email,
          photoURL: downloadURL,
          online: true,
        });

        await setDoc(doc(db, "userChats", createRes.user.uid), {});

        navigate("/");
      })
      .catch(() => setLoading(false));
  };

  return (
    <div className="authContainer">
      <div className="authWrapper">
        <div className="authHeader">Join QuickChat</div>
        <div className="firstNameClass">
          <TextField
            id="firstName"
            name="firstName"
            label="First Name"
            variant="standard"
            fullWidth
            onChange={handleInputChange}
          />
        </div>
        <div className="lastNameClass">
          <TextField
            id="lastName"
            name="lastName"
            label="Last Name"
            variant="standard"
            fullWidth
            onChange={handleInputChange}
          />
        </div>

        <div className="emailClass">
          <TextField
            id="email"
            name="email"
            label="Email"
            variant="standard"
            fullWidth
            onChange={handleInputChange}
          />
        </div>
        <FormControl sx={{ m: 1, marginBottom: "16px" }} variant="standard">
          <InputLabel htmlFor="password">Password</InputLabel>
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            onChange={handleInputChange}
          />
        </FormControl>
        <div className="uploadClass " onClick={handleWrapperClick}>
          {displayPicture ? (
            <div>{displayPicture.name}</div>
          ) : (
            <>
              <AccountCircleIcon />
              <label>Add Profile Picture ?</label>
              <input
                className="inputfile"
                id={"profile_fileupload"}
                type="file"
                name={"picture"}
                onChange={handleFileChange}
                accept="image/png, image/gif, image/jpeg"
                hidden
              />
            </>
          )}
        </div>
        <div>
          <LoadingButton
            variant="outlined"
            loading={loading}
            loadingPosition="start"
            sx={{
              padding: "10px 20px",
              marginTop: "16px",
              marginBottom: "16px",
            }}
            onClick={() => handleSubmit()}
          >
            Sign Up
          </LoadingButton>
        </div>
        <div>
          Already have an account? <a href="/login">Login</a> here
        </div>
      </div>
    </div>
  );
}
