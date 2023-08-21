import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AuthContextProvider } from "./Redux/AuthContext";
import { ChatContextProvider } from "./Redux/ChatContext";
import { ActiveContextProvider } from "./Redux/ActiveContext";
import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <AuthContextProvider>
    <ActiveContextProvider>
      <ChatContextProvider>
        <StrictMode>
          <App />
        </StrictMode>
      </ChatContextProvider>
    </ActiveContextProvider>
  </AuthContextProvider>
);
