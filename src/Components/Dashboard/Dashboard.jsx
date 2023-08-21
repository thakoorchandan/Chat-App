// React Imports
import { useEffect, useState, useContext, useRef } from "react";

// Component Imports
import { ChatWindow } from "../ChatWindow/ChatWindow";
import { RIghtPanel } from "../RightPanel/RightPanel";
import { LeftPanel } from "../LeftPanel/LeftPanel";

// Redux Imports
import { ChatContext } from "../../Redux/ChatContext";

import "./styles.css";

export const Dashboard = () => {
  const [hide, setHide] = useState(false);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    if (window.outerWidth < 750) {
      setHideState(true);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const hideStateRef = useRef(hide);
  const setHideState = (data) => {
    hideStateRef.current = data;
    setHide(data);
  };

  const handleResize = (e) => {
    if (e.target.outerWidth < 750 && !hideStateRef.current) {
      setHideState(true);
    } else if (hideStateRef.current && e.target.outerWidth > 749) {
      setHideState(false);
    }
  };

  return (
    <div className="dashboardContainer">
      <div
        className={`leftPanelWrapper ${
          data.chatId !== "null" && hide && "hide"
        }`}
      >
        <LeftPanel />
      </div>
      <div
        className={`mainChatWrapper ${
          data.chatId === "null" && hide && "hide"
        }`}
      >
        <ChatWindow hide={hide} />
      </div>
      <div className="rightPanelWrapper">
        <RIghtPanel />
      </div>
    </div>
  );
};
