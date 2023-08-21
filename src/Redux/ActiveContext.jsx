import { createContext, useReducer } from "react";

export const ActiveContext = createContext();

export const ActiveContextProvider = ({ children }) => {
  const INITIAL_STATE = {
    currentUserActive: false,
    targetUserActive: false,
  };

  const activeReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_CURRENT_ACTIVE":
        return {
          ...state,
          currentUserActive: action.payload,
        };
      case "CHANGE_TARGET_ACTIVE":
        return {
          ...state,
          targetUserActive: action.payload,
        };

      default:
        return state;
    }
  };

  const [state, statusDispatch] = useReducer(activeReducer, INITIAL_STATE);

  return (
    <ActiveContext.Provider value={{ status: state, statusDispatch }}>
      {children}
    </ActiveContext.Provider>
  );
};
