import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../utils/api";

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
      await axios.get(
        `${API_BASE_URL}/auth/logout`,
        {},
        { withCredentials: true }
      );
      return null;
    } catch (error) {
      return rejectWithValue(error.response?.data || "Logout failed");
    }
  }
);

export const updateProfileImage = createAsyncThunk(
  "auth/updateProfileImg",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`api/users/upload-img`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      console.log("response" + response);
      return response.data;
    } catch (err) {
      console.log("File upload Error", err.response?.data);
      return rejectWithValue(err.response?.data);
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async ({ formData }, { rejectWithValue }) => {
    try {
      const response = await api.post(`api/users/update-profile`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      console.log(response);
      return response.data;
    } catch (err) {
      console.log("update profile err", err.response?.data);
      return rejectWithValue(err.response?.data);
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
      })
      .addCase(updateProfileImage.fulfilled, (state, action) => {
        state.user.img = action.payload.fileUrl;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.user = {
          ...state.user,
          ...action.payload,
        };
      });
  },
});

export default authSlice.reducer;
