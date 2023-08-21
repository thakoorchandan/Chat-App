// React Imports
import React, { useContext, useEffect, useState } from "react";

// Material UI Imports
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

// Firebase Imports
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

// Redux Imports
import { AuthContext } from "../../Redux/AuthContext";
import { ChatContext } from "../../Redux/ChatContext";
import { ActiveContext } from "../../Redux/ActiveContext";

// Components Impport
import { ProfileInfo } from "../ProfileInfo/ProfileInfo";
import { SearchUser } from "./SearchUser";

import "./styles.css";

export const LeftPanel = () => {
  const [activeChats, setActiveChats] = useState([]);
  const [archivedChats, setArchivedChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState("");
  const [isActiveExpanded, setActiveExpanded] = useState(true);
  const [isArchiveExpanded, setArchiveExpanded] = useState(true);
  const [loading, setLoading] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { chatDispatch } = useContext(ChatContext);
  const { statusDispatch } = useContext(ActiveContext);

  useEffect(() => {
    const getChats = () => {
      setLoading(true);
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        const currActive = [];
        const currArchives = [];
        Object.entries(doc.data())
          .sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            chat[1].archive
              ? currArchives.push(chat[1])
              : currActive.push(chat[1]);
          });
        setActiveChats(currActive);
        setArchivedChats(currArchives);
        setLoading(false);
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  useEffect(() => {
    const getOnlineStatus = () => {
      const unsub = onSnapshot(doc(db, "users", currentUser.uid), (doc) => {
        statusDispatch({
          type: "CHANGE_CURRENT_ACTIVE",
          payload: doc.data().online,
        });
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getOnlineStatus();
  }, []);

  useEffect(() => {
    const getOnlineStatus = () => {
      const unsub = onSnapshot(doc(db, "users", selectedChat), (doc) => {
        statusDispatch({
          type: "CHANGE_TARGET_ACTIVE",
          payload: doc.data().online,
        });
      });

      return () => {
        unsub();
      };
    };

    selectedChat && getOnlineStatus();
  }, [selectedChat]);

  const handleSelect = (u) => {
    chatDispatch({ type: "CHANGE_USER", payload: u });
    setSelectedChat(u.userInfo.uid);
  };

  return (
    <div className="chats">
      <ProfileInfo />
      <SearchUser />
      <div
        className="activeHeaderWrapper"
        onClick={() => setActiveExpanded(!isActiveExpanded)}
      >
        <div className="activeHeader">
          Active Conversations
          <div className="chatCount">{activeChats.length}</div>
        </div>
        <div style={{ display: "flex" }}>
          {!isActiveExpanded ? (
            <KeyboardArrowDownIcon fontSize="small" />
          ) : (
            <KeyboardArrowUpIcon fontSize="small" />
          )}
        </div>
      </div>
      {loading ? (
        <div>
          <Stack spacing={1}>
            <Skeleton variant="rounded" animation="wave" height={60} />
            <Skeleton variant="rounded" animation="wave" height={60} />
          </Stack>
        </div>
      ) : (
        <div>
          {activeChats.map((chat) => (
            <div
              className={`userChat ${
                selectedChat === chat.userInfo.uid && "chatSelected"
              } ${!isActiveExpanded && "hideChats"}`}
              key={chat}
              onClick={() => handleSelect(chat)}
            >
              <img src={chat.userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat.userInfo.displayName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
      <div
        className="activeHeaderWrapper"
        onClick={() => setArchiveExpanded(!isArchiveExpanded)}
      >
        <div className="activeHeader">
          Archived Conversations
          <div className="chatCount">{archivedChats.length}</div>
        </div>
        <div style={{ display: "flex" }}>
          {!isArchiveExpanded ? (
            <KeyboardArrowDownIcon fontSize="small" />
          ) : (
            <KeyboardArrowUpIcon fontSize="small" />
          )}
        </div>
      </div>
      {loading ? (
        <div>
          <Stack spacing={1}>
            <Skeleton variant="rounded" animation="wave" height={60} />
            <Skeleton variant="rounded" animation="wave" height={60} />
          </Stack>
        </div>
      ) : (
        <div>
          {archivedChats.map((chat) => (
            <div
              className={`userChat ${
                selectedChat === chat.userInfo.uid && "chatSelected"
              } ${!isArchiveExpanded && "hideChats"}`}
              key={chat[0]}
              onClick={() => handleSelect(chat)}
            >
              <img src={chat.userInfo.photoURL} alt="" />
              <div className="userChatInfo">
                <span>{chat.userInfo.displayName}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
