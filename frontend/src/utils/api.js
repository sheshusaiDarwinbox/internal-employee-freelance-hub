import axios from "axios";
import { store } from "../redux/store"; // Import the store
import { logoutUser } from "../redux/slices/authSlice"; // Import the logout action

const api = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API's base URL
});

api.interceptors.response.use(
  (response) => response, // If the response is successful, return the response
  (error) => {
    if (error.response && error.response.status === 401) {
      // Dispatch the logout action if 401 is received (i.e., session expired)
      store.dispatch(logoutUser());
    }
    return Promise.reject(error); // Reject the error, so it can be handled elsewhere
  }
);

export default api; // Export the Axios instance
