
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/gigs';

export const postGigAsync = createAsyncThunk(
  'gigs/postGig',
  async (gigData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_URL}/post`, gigData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const fetchGigsAsync = createAsyncThunk(
  'gigs/fetchGigs',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/`, {
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

export const fetchGigsByManagerIdAsync = createAsyncThunk(
  'gigs/fetchGigsByEID',
  async (EID, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/gigs/${EID}`, {
        withCredentials: true,
      });
      return response.data; // Return the entire paginated object
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || 'An error occurred');
    }
  }
);

const gigsSlice = createSlice({
  name: 'gigs',
  initialState: {
    gigs: [], // Added  gigs array to store fetched gigs
    managerGigs: { docs: [] }, // Initialize managerGigs as an object with docs array, 
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    clearGigState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(postGigAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(postGigAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(postGigAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      .addCase(fetchGigsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigsAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.gigs = action.payload;
      })
      .addCase(fetchGigsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchGigsByManagerIdAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGigsByManagerIdAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.managerGigs = action.payload; // Store the entire paginated object
      })
      .addCase(fetchGigsByManagerIdAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearGigState } = gigsSlice.actions;
export default gigsSlice.reducer;