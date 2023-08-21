// React Imports
import React, { useContext } from "react";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";

// Redux Imports
import { ChatContext } from "../../Redux/ChatContext";

// Component Imports
import { Messages } from "./Messages";
import { ChatInputFooter } from "./ChatInputFooter";

import "./styles.css";

export const ChatWindow = (props) => {
  const { data, chatDispatch } = useContext(ChatContext);

  return (
    <>
      {props.hide && (
        <div
          className="backNavigationBtn"
          onClick={() => chatDispatch({ type: "SET_DEFAULT" })}
        >
          <KeyboardBackspaceIcon
            sx={{ marginRight: "16px" }}
            fontSize="small"
          />
          Chats
        </div>
      )}
      <div className="chat">
        {data.chatId !== "null" ? (
          <>
            <Messages hide={props.hide} />
            <ChatInputFooter />
          </>
        ) : (
          <div className="emptyStateConversation">
            Select a chat to start conversation
          </div>
        )}
      </div>
    </>
  );
};
