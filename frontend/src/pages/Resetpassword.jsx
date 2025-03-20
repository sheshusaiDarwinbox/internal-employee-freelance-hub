import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
const API_BASE_URL = "http://localhost:3000/api"; // Update with your backend URL

const ResetPassword = () => {
  const navigate = useNavigate();
  const { ID, forgotVerifyString } = useParams();
  console.log(ID + " " + forgotVerifyString);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMeassage] = useState(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setPasswordMatchError(null);
    if (newPassword !== confirmPassword) {
      setPasswordMatchError("Passwords do not match.");
      return;
    }

    setLoading(true);
    axios
      .post(
        `${API_BASE_URL}/forgot-password/${ID}/${forgotVerifyString}`,
        { newPassword, confirmPassword },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(() => {
        setLoading(false);
        setSuccessMeassage("Password Reset sucessfull");
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
        setError("failed to reset password");
      });
  };

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      navigate("/login");
    }
  }, [successMessage]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[30rem]">
        <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">
          Reset Password
        </h2>
        {error && <p className="text-red-500 text-center my-2 mb-4">{error}</p>}
        {passwordMatchError && (
          <p className="text-red-500 text-center my-2 mb-4">
            {passwordMatchError}
          </p>
        )}
        {successMessage && (
          <p className="text-green-500 text-center my-2 mb-4">
            {successMessage}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            className="w-full border-b-2 rounded-md border-gray-300 py-3 px-2 focus:outline-none focus:border-blue-400 transition duration-300"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full border-b-2 rounded-md border-gray-300 py-3 px-2 focus:outline-none focus:border-blue-400 transition duration-300"
          />
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 text-lg rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
