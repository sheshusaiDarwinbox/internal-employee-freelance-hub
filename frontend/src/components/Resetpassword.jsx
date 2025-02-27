import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../redux/slices/forgotPasswordSlice";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ID, forgotVerifyString } = useParams();
  const { isLoading, error, successMessage } = useSelector(
    (state) => state.forgotPassword
  );
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
    dispatch(
      resetPassword({ ID, forgotVerifyString, newPassword, confirmPassword })
    );
  };

  useEffect(() => {
    if (successMessage) {
      alert(successMessage);
      navigate("/login");
    }
  }, [successMessage, navigate]);

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