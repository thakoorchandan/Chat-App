// React Imports
import React, { useContext, useEffect, useState } from "react";

// Firebase imports
import { doc, onSnapshot } from "firebase/firestore";
import { ChatContext } from "../../Redux/ChatContext";
import { db } from "../../firebase";

// Component Imports
import { Message } from "./Message";

export const Messages = (props) => {
  const [messages, setMessages] = useState([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data().messages);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  console.log(messages);

  return (
    <div className={`messages`}>
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};
