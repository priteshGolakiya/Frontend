import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  user: null,
  error: null,
  token: Cookies.get("token") || null,
  isAuthenticated: !!Cookies.get("token"),
  isLoading: true,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },
    setToken: (state, action) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      Cookies.set("token", action.payload);
    },
    clearUserDetails: (state) => {
      state.user = null;
      state.error = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      Cookies.remove("token");
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setUserDetails,
  setToken,
  clearUserDetails,
  setError,
  setLoading,
} = userSlice.actions;



export default userSlice.reducer;
