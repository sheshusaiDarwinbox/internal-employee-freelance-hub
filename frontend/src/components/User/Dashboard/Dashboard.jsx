
import { Link, Outlet } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../../redux/slices/authSlice";
import { Card, Navbar } from "flowbite-react";
import Nav from "./Navbar";
import ProfileAvatar from "../../../assets/profile-avatar.png";

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Top Navigation */}
      <Nav className="fixed top-0 left-0 right-0 z-50" />

      {/* Fixed Secondary Navigation */}
      <Navbar className="fixed top-[90px] left-0 right-0 bg-blue-400 shadow px-6 py-6 z-40">
        <marquee>
          <h1 className="text-xl font-semibold text-gray-800">
            Your Workplace Hub: Manage Tasks, Track Progress, and Stay
            Connected!
          </h1>
        </marquee>
      </Navbar>

      <div className="flex pt-[160px]">
        {/* Fixed Sidebar */}
        <div className="fixed w-1/5 h-[calc(100vh-160px)] bg-blue-200 bg-opacity-90 backdrop-blur-lg shadow-md overflow-y-auto">
          <div className="p-8">
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
                  { name: "🚪 Logout", onClick: handleLogout, isLogout: true },
                ].map((item, index) => (
                  <li key={index}>
                    {item.onClick ? (
                      <button
                        onClick={item.onClick}
                        className={`block w-full text-left p-3 rounded-lg transition duration-200 ${
                          item.isLogout
                            ? "text-red-500 hover:bg-red-100"
                            : "text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {item.name}
                      </button>
                    ) : (
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
                    )}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Scrollable Main Content */}
        <div className="ml-[20%] flex-1 p-8 min-h-[calc(100vh-160px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
