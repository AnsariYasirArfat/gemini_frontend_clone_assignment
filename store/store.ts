import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authSlice";
import chatRoomReducer from "./reducers/chatRoomSlice";

export const makeStore = () => {
  return configureStore({
    reducer: { auth: authReducer ,chatRoom: chatRoomReducer,},
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
