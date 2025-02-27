import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendForgotPasswordEmail } from "../redux/slices/forgotPasswordSlice";
import { useNavigate } from "react-router-dom";
import { memo } from "react";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, successMessage } = useSelector(
    (state) => state.forgotPassword
  );
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const redirectUrl = "http://localhost:5173/reset-password"; //  frontend URL for password reset
    dispatch(sendForgotPasswordEmail({ email, redirectUrl }));
    alert("Reset Mail sent ");
    navigate("/login");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[30rem]">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Forgot Password
        </h2>
        {error && <p className="text-red-500 text-center my-2 mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 text-center my-2 mb-4">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border-b-2 rounded-md border-gray-300 py-3 px-2 focus:outline-none focus:border-blue-400 transition duration-300"
          />
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 text-lg rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Email"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default memo(ForgotPassword);
