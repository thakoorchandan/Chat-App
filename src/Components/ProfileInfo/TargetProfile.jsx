// React Imports
import React, { useContext } from "react";

// Material UI Imports
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import Button from "@mui/material/Button";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

// Redux Imports
import { AuthContext } from "../../Redux/AuthContext";
import { ChatContext } from "../../Redux/ChatContext";

// Firebase Imports
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";

import "./styles.css";

const TargetProfile = () => {
  const { data } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);
  const [archived, setArchived] = React.useState(data.archive);

  React.useEffect(() => {
    setArchived(data.archive);
  }, [data.archive]);

  const handleArchive = () => {
    updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".archive"]: !archived,
    }).then((res) => {
      setArchived(!archived);
    });
  };

  return (
    <div className="profileContainer">
      <div className="profileInfoWrapper targetInfoWrapper">
        {data.chatId !== "null" ? (
          <>
            <img src={data.userInfo.photoURL} alt="profileImage" />
            <div className="profileUsernameWrapper targetProfileNameWrapper">
              <MailOutlineIcon fontSize="small" />
              <div className="profileRole targerProfileInfo">
                {data.userInfo.email}
              </div>
            </div>
            <div className="profileUsernameWrapper targetProfileNameWrapper">
              <AccountCircleOutlinedIcon fontSize="small" />
              <div className="profileRole targerProfileInfo">
                {data.userInfo.displayName}
              </div>
            </div>
            <div className="archiveWrapper">
              <Button
                variant="outlined"
                onClick={() => handleArchive()}
                sx={{
                  // padding: "6px 30px",
                  color: "#0f4cff",
                  fontSize: "small",
                  textTransform: "none",
                  borderColor: "#0f4cff",
                }}
                endIcon={
                  <Inventory2OutlinedIcon
                    fontSize="small"
                    sx={{ marginLeft: "4px" }}
                  />
                }
              >
                {archived ? "Unarchive" : "Archive"}
              </Button>
            </div>
          </>
        ) : (
          <div>Select chat to see info</div>
        )}{" "}
      </div>
    </div>
  );
};
export default React.memo(TargetProfile);
