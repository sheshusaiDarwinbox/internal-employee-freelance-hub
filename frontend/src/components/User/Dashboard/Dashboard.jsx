import { Navbar } from "flowbite-react";
import ProfileAvatar from "../../../assets/profile-avatar.png";
import Nav from "./Navbar";
import { Card } from "flowbite-react";
import { Link, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (err) {
      console.error("Logout failed", err);
    }
  };
  return (
    <>
      {/* Navigation Bar (Main) */}
      <Nav />

      {/* Marquee Navbar - Placed Below Nav */}
      <Navbar className="bg-blue-400 shadow px-6 py-6 mt-[90px]">
        <marquee>
          <h1 className="text-xl font-semibold text-gray-800">
            Your Workplace Hub: Manage Tasks, Track Progress, and Stay
            Connected!
          </h1>
        </marquee>
      </Navbar>

      <div className="flex flex-col min-h-screen bg-gray-100 md:flex-row">
        {/* Sidebar */}
        <div className="w-full md:w-1/5 p-8 bg-blue-200 bg-opacity-90 backdrop-blur-lg shadow-md pt-20">
          <div className="flex flex-col items-center">
            <img src={ProfileAvatar} alt="Profile Avatar" className="h-40" />
            <h2 className="text-2xl font-semibold text-gray-700">John Doe</h2>
            <h2 className="text-lg font-semibold text-gray-700">Employee</h2>
          </div>
          <Card className="mt-6 shadow-sm border border-gray-200">
            <ul className="space-y-2">
              {[
                { name: "🏆 Rewards", link: "/user/rewards" },
                { name: "📋 My Tasks", link: "/user/my-tasks" },
                { name: "📝 View All Tasks", link: "/user/view-all-tasks" },
                { name: "📊 My Activity", link: "/user/my-activity" },
                { name: "👤 My Profile", link: "/user/my-profile" },
                { name: "🏦 My Account", link: "/user/my-account" },
                { name: "🚪 Logout", onclick: handleLogout, isLogout: true },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.link}
                    className={`block p-3 rounded-lg transition duration-200 ${
                      item.isLogout
                        ? "text-red-500 hover:bg-red-100"
                        : "text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Main Content (Dynamic Route Changes Here) */}
        <div className="w-full md:w-4/5 p-8">
          <Outlet />{" "}
          {/* This will render nested route components dynamically */}
        </div>
      </div>
    </>
  );
};

export default Dashboard;
