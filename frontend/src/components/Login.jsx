import { useState } from "react";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-16 rounded-lg shadow-lg w-[30rem]">
        <h2 className="text-3xl font-semibold text-center mb-8">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            name="email"
            placeholder="Email/Emp ID"
            value={formData.email}
            onChange={handleChange}
            className="w-full border-b-2 bg-gray-50 border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg px-4 py-4 text-lg"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border-b-2 bg-gray-50 border-gray-300 focus:outline-none focus:border-blue-500 rounded-lg px-4 py-4 text-lg"
            required
          />
          <div className="text-center">
          <button type="submit" className="w-1/2 bg-blue-600 text-white py-4 text-lg rounded-lg hover:bg-blue-700 transition duration-300">
            Login
          </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
