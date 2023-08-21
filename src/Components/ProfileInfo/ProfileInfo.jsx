// React Imports
import React, { useContext } from "react";

// Material UI Imports
import BoltIcon from "@mui/icons-material/Bolt";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

// Redux Imports
import { AuthContext } from "../../Redux/AuthContext";
import { ActiveContext } from "../../Redux/ActiveContext";

// Firebase Imports
import { signOut } from "firebase/auth";
import { auth, db } from "../../firebase";
import { doc, updateDoc } from "firebase/firestore";

// Component Imports
import { Toggle } from "./Toggle";

import "./styles.css";

export const ProfileInfo = () => {
  const { currentUser } = useContext(AuthContext);
  const { status } = useContext(ActiveContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOnlineStatus = (status) => {
    updateDoc(doc(db, "users", currentUser.uid), {
      online: status,
    });
  };

  return (
    <div className="profileContainer">
      <div className="profileHeader">
        <div className="appIconWrapper">
          <BoltIcon fontSize="large" />
        </div>
        <div className="appNameWrapper">QuickChat</div>
      </div>
      <div className="profileInfoWrapper">
        <img src={currentUser.photoURL} alt="profileImage" />
        <div className="profileUsernameWrapper">
          <div className="profileUsername">{currentUser.displayName}</div>
          <SettingsIcon
            fontSize="small"
            sx={{ cursor: "pointer" }}
            onClick={handleClick}
          />
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
          >
            <MenuItem onClick={() => signOut(auth)}>Logout</MenuItem>
          </Menu>
        </div>
        <div className="profileRole">{`Senior Software Developer`}</div>
        <div className="statusWrapper">
          <Toggle
            status={status.currentUserActive}
            onToggle={(val) => handleOnlineStatus(val)}
          />
          Active
        </div>
      </div>
    </div>
  );
};
