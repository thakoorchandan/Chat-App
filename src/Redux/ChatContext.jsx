import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          ...action.payload,
          chatId:
            currentUser.uid > action.payload.userInfo.uid
              ? currentUser.uid + action.payload.userInfo.uid
              : action.payload.userInfo.uid + currentUser.uid,
        };
      case "SET_DEFAULT":
        return INITIAL_STATE;

      default:
        return state;
    }
  };

  const [state, chatDispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, chatDispatch }}>
      {children}
    </ChatContext.Provider>
  );
};
