import { useDispatch, useSelector } from "react-redux";
import { loginUser} from "../redux/slices/authSlice";
import { useState, useEffect } from "react";
import { useNavigate ,Link } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error} = useSelector(
    (state) => state.auth
  );
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");


  const handleLoginSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email: formEmail, password: formPassword }));
  };



  useEffect(() => {
    if (user) {
      if (user.role === "Admin") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    }
  }, [user, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-lg w-[30rem]">
        
          <>
            <h2 className="text-3xl font-semibold text-center mb-6 text-gray-700">Login</h2>
            {error && <p className="text-red-500 text-center my-2 mb-4">{error}</p>}
            {user && <p className="text-green-500 text-center">Welcome, {user.email}</p>}
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <input
                type="text"
                placeholder="Email/Emp ID"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                required
                className="w-full border-b-2 rounded-md border-gray-300 py-3 px-2 focus:outline-none focus:border-blue-400 transition duration-300"
              />
              <input
                type="password"
                placeholder="Password"
                value={formPassword}
                onChange={(e) => setFormPassword(e.target.value)}
                required
                className="w-full border-b-2 rounded-md border-gray-300 py-3 px-2 focus:outline-none focus:border-blue-400 transition duration-300"
              />

              <div className="flex justify-between text-sm text-blue-600 cursor-pointer">
              <Link to="/forgot-password">Forgot Password?</Link>
              </div>
              <div className="text-center">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 text-lg rounded-lg hover:bg-blue-700 transition duration-300 shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </button>
              </div>
            </form>
          </>
        
         
      </div>
    </div>
  );
};

export default Login;
