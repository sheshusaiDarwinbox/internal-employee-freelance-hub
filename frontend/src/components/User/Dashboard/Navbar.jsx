import { Link } from "react-router-dom";
import { Bell, MessageCircle, UserCircle } from "lucide-react"; // Lucide Icons
import logo from "../../../assets/darwinbox-logo.png";

const Navbar = () => {
  return (
    <nav className="bg-gray-50 dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600 p-4">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto">
        
        {/* Logo & Branding */}
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
          <img src={logo} className="h-16" alt="Darwinbox Logo" />
          {/* <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
            Darwinbox
          </span> */}
        </Link>

        {/* Right-side icons & User Info */}
        <div className="flex items-center space-x-4 md:space-x-8 flex-wrap">
          <Link to='/user/' className="text-lg hover:text-blue-600">Home</Link>
          
          {/* Notification Icon */}
          <button className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <Bell className="w-6 h-6 text-blue-700 dark:text-blue-300" />
            {/* Notification Badge */}
            <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Messaging Icon */}
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
            <MessageCircle className="w-6 h-6 text-blue-700 dark:text-blue-300" />
          </button>

          {/* Profile Icon */}
          <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-200">
            <Link to='/user/my-profile'><UserCircle className="w-6 h-6 text-blue-700 dark:text-blue-300" /></Link>
          </button>

          {/* Welcome User Text */}
          <span className="text-gray-900 dark:text-gray-300 font-medium hidden md:inline">
            Welcome, <span className="font-semibold">John Doe</span>
          </span>
        </div>

      </div>
    </nav>
  );
};

export default Navbar;
