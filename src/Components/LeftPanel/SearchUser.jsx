// React Imports
import React, { useContext, useState } from "react";

// Material UI Imports
import Menu from "@mui/material/Menu";
import OutlinedInput from "@mui/material/OutlinedInput";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import MenuItem from "@mui/material/MenuItem";

// Redux Imports
import { AuthContext } from "../../Redux/AuthContext";

// Firebase Imports
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

import "./styles.css";

export const SearchUser = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleSearchTextChange = (event) => {
    setAnchorEl(event.currentTarget);
    setUsername(event.target.value);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayNameInsensitive", "==", username.toUpperCase())
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e) => {
    if (e.code === "Enter") {
      handleSearchMenu(e);
    }
  };

  const handleSearchMenu = (ev) => {
    handleSearch();
  };

  const handleSelect = async () => {
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    //const targetCombinedId = user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), {
          online: true,
          messages: [],
        });

        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            email: user.email,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
            email: currentUser.email,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch (err) {}

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <OutlinedInput
          id="outlined-adornment-weight"
          endAdornment={
            <SearchOutlinedIcon
              sx={{ cursor: "pointer" }}
              onClick={handleSearchMenu}
              fontSize="small"
            />
          }
          aria-describedby="outlined-weight-helper-text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => handleSearchTextChange(e)}
          value={username}
          inputProps={{
            "aria-label": "weight",
          }}
        />
        {/* <input
          type="text"
          placeholder="Find a user"
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        /> */}
        {user && (
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={handleSelect}>
              <div className="userChat">
                <img src={user.photoURL} alt="" />
                <div className="userChatInfo">
                  <span>{user.displayName}</span>
                </div>
              </div>
            </MenuItem>
          </Menu>
        )}
      </div>
      {err && <span>User not found!</span>}
      {/* {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )} */}
    </div>
  );
};
