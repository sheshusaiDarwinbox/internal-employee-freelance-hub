import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:3000/api"; // Update with your backend URL

export const sendForgotPasswordEmail = createAsyncThunk(
  "forgotPassword/sendForgotPasswordEmail",
  async ({ email, redirectUrl }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/forgot-password`,
        { email, redirectUrl },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to send forgot password email"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "forgotPassword/resetPassword",
  async (
    { ID, forgotVerifyString, newPassword, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/forgot-password/${ID}/${forgotVerifyString}`,
        { newPassword, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to reset password"
      );
    }
  }
);

const forgotPasswordSlice = createSlice({
  name: "forgotPassword",
  initialState: {
    isLoading: false,
    error: null,
    successMessage: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendForgotPasswordEmail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(sendForgotPasswordEmail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.msg; // Assuming your backend sends a success message
      })
      .addCase(sendForgotPasswordEmail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.successMessage = action.payload.msg; // Assuming your backend sends a success message
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to reset password"; // Extract message
      });
  },
});

export default forgotPasswordSlice.reducer;
