import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { Card } from "flowbite-react";
import ProfileAvatar from "../assets/profile-avatar.png";

const Sidebar = ({ navlinks }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const userRole =
    user?.role === "Admin"
      ? "admin"
      : user.role === "Manager"
      ? "manager"
      : user.role === "Employee"
      ? "employee"
      : "external";

  return (
    <div className="fixed w-1/5 h-[calc(100vh-160px)] bg-gradient-to-b from-blue-50 to-white bg-opacity-90 backdrop-blur-lg shadow-lg overflow-y-auto">
      <div className="p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="relative group">
            <img
              src={ProfileAvatar}
              alt="Profile Avatar"
              className="h-40 rounded-full border-4 border-white shadow-md transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-0 group-hover:opacity-50 transition duration-50"></div>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-4">
            {user?.name || "John Doe"}
          </h2>
          <h2 className="text-lg font-medium text-blue-500 capitalize">
            {userRole}
          </h2>
        </div>

        {/* <Card className="shadow-lg border border-gray-100 bg-white/80 backdrop-blur">
          <ul className="space-y-1">
            {[
              ...navlinks,
              { name: "🚪 Logout", onClick: handleLogout, isLogout: true },
            ].map((item, index) => (
              <li key={index}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 transform hover:scale-102 active:scale-98 ${
                      item.isLogout
                        ? "text-red-500 hover:bg-red-50 active:bg-red-100"
                        : "text-gray-700 hover:bg-blue-50 active:bg-blue-100"
                    }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    className={`block p-3 rounded-lg transition-all duration-200 
                      ${
                        location.pathname === item.link
                          ? "bg-blue-400 text-white shadow-md transform scale-102"
                          : "text-gray-700 hover:bg-blue-50 active:bg-blue-100 hover:scale-102 active:scale-98"
                      }
                    `}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card> */}

        <Card className="shadow-lg border border-gray-100 bg-white/80 backdrop-blur">
          <ul className="space-y-1">
            {[
              ...navlinks,
              { name: "🚪 Logout", onClick: handleLogout, isLogout: true },
            ].map((item, index) => (
              <li key={index}>
                {item.onClick ? (
                  <button
                    onClick={item.onClick}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 
              ${
                item.isLogout
                  ? "text-red-500 hover:bg-red-50 active:bg-red-100 transform active:scale-95 hover:scale-[1.02]"
                  : "text-gray-700 hover:bg-blue-50 active:bg-blue-100 transform active:scale-95 hover:scale-[1.02]"
              }`}
                  >
                    {item.name}
                  </button>
                ) : (
                  <Link
                    to={item.link}
                    className={`block p-3 rounded-lg transition-all duration-200 transform 
              ${
                location.pathname === item.link
                  ? "bg-blue-400 text-white shadow-md scale-[1.02]"
                  : "text-gray-700 hover:bg-blue-50 active:bg-blue-100 hover:scale-[1.02] active:scale-95"
              }`}
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};

export default Sidebar;
