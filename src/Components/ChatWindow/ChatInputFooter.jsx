// React Imports
import React, { useContext, useState } from "react";
import InputEmoji from "react-input-emoji";
import AttachFileIcon from "@mui/icons-material/AttachFileOutlined";
import SendIcon from "@mui/icons-material/Send";

// Redux Imports
import { AuthContext } from "../../Redux/AuthContext";
import { ChatContext } from "../../Redux/ChatContext";

// Firebase Imports
import {
  arrayUnion,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { db, storage } from "../../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

export const ChatInputFooter = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const storageRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storageRef, img);
      setImg(null);

      uploadTask.then(
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else {
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.userInfo.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
  };

  const handleFile = () => {
    document.getElementById("file").click();
  };

  return (
    <div className="inputContainer">
      {img && <div>File: {img.name}</div>}
      <div className="input">
        <AttachFileIcon
          onClick={() => handleFile()}
          sx={{ cursor: "pointer" }}
        />
        <InputEmoji
          value={text}
          onChange={(e) => setText(e)}
          cleanOnEnter
          placeholder="Enter message here"
          onEnter={() => handleSend()}
          borderRadius="4px"
        />
        <div className="send">
          <input
            type="file"
            style={{ display: "none" }}
            id="file"
            accept="image/png, image/gif, image/jpeg"
            onChange={(e) => setImg(e.target.files[0])}
          />
          {/* <label htmlFor="file">
          <img src={img} alt="" />
        </label> */}
          <button
            disabled={!text && !img}
            className={`sendBtn ${!text && !img && "disabledBtn"}`}
            onClick={() => handleSend()}
          >
            <div>Send</div>
            <SendIcon sx={{ marginLeft: "2px" }} fontSize="small" />
          </button>
        </div>
      </div>
    </div>
  );
};
