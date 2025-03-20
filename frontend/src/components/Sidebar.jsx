import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import { LogOut, ChevronRight } from "lucide-react";
import api from "../utils/api";

const Sidebar = ({ navlinks }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [user, setUser] = useState(useSelector((state) => state.auth.user));
  const [isHovered, setIsHovered] = useState(null);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`api/users/profile`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchUser();
  }, []);

  const userRole =
    user?.role === "Admin"
      ? "admin"
      : user?.role === "Manager"
      ? "manager"
      : user?.role === "Employee"
      ? "employee"
      : "external";

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-700",
      manager: "bg-blue-100 text-blue-700",
      employee: "bg-green-100 text-green-700",
      external: "bg-gray-100 text-gray-700",
    };
    return colors[role] || colors.external;
  };

  return (
    <aside className="fixed w-80 h-screen bg-white border-r border-gray-100 shadow-lg">
      <div className="flex flex-col h-full">
        {/* Profile Section */}
        <div className="p-6 text-center border-b border-gray-100">
          <div className="relative mx-auto mb-4 group">
            <div className="relative w-24 h-24 mx-auto overflow-hidden rounded-full ring-4 ring-offset-2 ring-blue-100">
              <img
                src={
                  user?.img ||
                  "https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=400&h=400&fit=crop"
                }
                alt="Profile"
                className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110"
              />
            </div>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            {user?.fullName || "John Doe"}
          </h2>
          <span
            className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full ${getRoleColor(
              userRole
            )}`}
          >
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2 ml-5">
            {navlinks.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.link}
                  className={`relative flex items-center  w-full px-4 py-3 rounded-lg transition-all duration-200
                    ${
                      location.pathname === item.link
                        ? "bg-blue-500 text-white shadow-md"
                        : "text-gray-600 hover:bg-blue-50"
                    }`}
                  onMouseEnter={() => setIsHovered(index)}
                  onMouseLeave={() => setIsHovered(null)}
                >
                  <span className="flex-1">{item.name}</span>
                  {isHovered === index && (
                    <ChevronRight
                      className={`w-4 h-4 ${
                        location.pathname === item.link
                          ? "text-white"
                          : "text-blue-500"
                      }`}
                    />
                  )}
                </Link>
              </li>
            ))}

            <li key={-1}>
              <Link
                className={`relative text-red-500 flex hover:bg-red-300 items-center w-full px-4 py-3 rounded-lg transition-all duration-200
                    `}
                onMouseEnter={() => setIsHovered(-1)}
                onMouseLeave={() => setIsHovered(null)}
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:-translate-x-1" />
                <span className="flex-1">Logout</span>
                {isHovered === -1 && (
                  <ChevronRight
                    className={`w-4 h-4  text-red-600
                    }`}
                  />
                )}
              </Link>
            </li>
          </ul>
        </nav>

        {/* Logout Button */}
      </div>
    </aside>
  );
};

export default Sidebar;
