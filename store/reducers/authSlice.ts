import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isAuthenticated: boolean;
  phone: string | null;
  country: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  phone: null,
  country: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<{ phone: string; country: string }>) => {
      state.isAuthenticated = true;
      state.phone = action.payload.phone;
      state.country = action.payload.country;
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.phone = null;
      state.country = null;
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
