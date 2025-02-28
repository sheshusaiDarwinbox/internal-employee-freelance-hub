import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch user details
export const fetchUserDetails = createAsyncThunk('user/fetchUserDetails', async (userId) => {
  const response = await axios.get(`/api/users/${userId}`);
  return response.data;
});

// Async thunk to create a new user
export const createUserAsync = createAsyncThunk('user/createUser', async (userData) => {
  const response = await axios.post('/api/users/create', userData);
  return response.data;
});

// Async thunk to fetch all users
export const fetchAllUsers = createAsyncThunk('user/fetchAllUsers', async (queryParams = {}) => {
  const params = new URLSearchParams(queryParams);
  const response = await axios.get(`/api/users?${params.toString()}`);
  return response.data;
});

// Async thunk to delete a user by ID
export const deleteUserById = createAsyncThunk('user/deleteUserById', async (userId) => {
  await axios.delete(`/api/users/${userId}`);
  return userId; // Return the deleted user ID for reducer update
});

// Async thunk for login
export const loginAsync = createAsyncThunk('user/login', async (loginData) => {
  const response = await axios.post('/api/auth/login', loginData);
  return response.data;
});

// User slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    currentUser: null, // Change from [] to null
    users: {
      docs: [],
      totalDocs: 0,
      limit: 10,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    },
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.currentUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.users.docs = state.users.docs.filter((user) => user.EID !== action.payload);
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUser = action.payload;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export actions and reducer
export const { logout } = userSlice.actions;
export default userSlice.reducer;