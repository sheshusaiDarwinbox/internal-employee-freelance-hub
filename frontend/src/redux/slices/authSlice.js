import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Base URL for API calls
const API_BASE_URL = "http://localhost:3000/api"; // Update with your backend URL

// Async Thunks for API Calls
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      console.log({ email, password });
      const response = await axios.post(
        `${API_BASE_URL}/auth/login`,
        { EID: email, password },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Login Error:", error.response?.data);
      return rejectWithValue(error.response?.data || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE_URL}/logout`, {}, { withCredentials: true });
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    initialState: {
      // user: JSON.parse(localStorage.getItem("user")) || null,
      user: null,
      isLoading: false,
      error: null,
      successMessage: null,
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        // localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ||
          "Invalid email or password. Please try again.";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        // localStorage.removeItem("user");
      });
  },
});

export default authSlice.reducer;
