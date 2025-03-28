// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { Bell, MessageCircle, UserCircle, ChevronDown, X } from "lucide-react";
// import { useSelector } from "react-redux";
// import WebSocketComponent from "./WebSocketConnection";
// import { clsx } from "clsx";
// import api from "../utils/api";
// import { getRelativeTime } from "../utils/timeFormat";

// const Navbar = ({ linkName }) => {
//   const { user } = useSelector((state) => state.auth);
//   const [isNotificationOpen, setIsNotificationOpen] = useState(false);
//   const [notifications, setNotifications] = useState([]);
//   const [page] = useState(1);

//   const fetchNotifications = async () => {
//     try {
//       const response = await api.get(
//         `/api/notifications/getNotifications?page=${page}`,
//         {
//           withCredentials: true,
//         }
//       );
//       if (response.status === 200) {
//         setNotifications(response.data.docs);
//       }
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//     }
//   };

//   useEffect(() => {
//     // Initial fetch
//     fetchNotifications();

//     // Set up polling every minute
//     const pollInterval = setInterval(fetchNotifications, 60000);

//     // Cleanup interval on component unmount
//     return () => clearInterval(pollInterval);
//   }, [page]);

//   // Add an effect to update timestamps every minute
//   useEffect(() => {
//     const timestampInterval = setInterval(() => {
//       setNotifications((currentNotifications) => [...currentNotifications]);
//     }, 60000);

//     return () => clearInterval(timestampInterval);
//   }, []);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const markAsRead = async (NID) => {
//     try {
//       const response = await api.post(
//         "/api/notifications/markAsRead",
//         { NID },
//         {
//           withCredentials: true,
//         }
//       );
//       if (response.status === 200) {
//         setNotifications(
//           notifications.map((notif) =>
//             notif.NID === NID ? { ...notif, read: true } : notif
//           )
//         );
//       }
//     } catch (error) {
//       console.error("Error marking notification as read:", error);
//     }
//   };

//   const markAllAsRead = async () => {
//     try {
//       // Assuming all notifications are marked as read one by one
//       await Promise.all(
//         notifications.filter((n) => !n.read).map((n) => markAsRead(n.NID))
//       );
//     } catch (error) {
//       console.error("Error marking all notifications as read:", error);
//     }
//   };

//   return (
//     <nav className="bg-white border-b border-gray-100 fixed w-full z-30 top-0 shadow-sm">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex justify-between h-16">
//           <div className="flex items-center">
//             <Link to="/" className="flex items-center space-x-3">
//               <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
//                 <span className="text-white text-xl font-bold">TH</span>
//               </div>
//               <span className="text-xl font-semibold text-gray-900">
//                 Talent Hive
//               </span>
//             </Link>
//           </div>

//           <div className="flex items-center space-x-6">
//             <WebSocketComponent />

//             <Link
//               to={linkName}
//               className="text-gray-600 relative font-medium group"
//             >
//               Home
//               <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
//             </Link>

//             <div className="relative">
//               <button
//                 onClick={() => setIsNotificationOpen(!isNotificationOpen)}
//                 className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
//               >
//                 <Bell className="w-6 h-6 text-gray-600" />
//                 {unreadCount > 0 && (
//                   <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
//                     {unreadCount}
//                   </span>
//                 )}
//               </button>

//               {isNotificationOpen && (
//                 <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
//                   <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
//                     <h6 className="font-semibold text-gray-800">
//                       Notifications ({notifications.length})
//                     </h6>
//                     <button
//                       onClick={() => setIsNotificationOpen(false)}
//                       className="text-gray-500 hover:text-gray-700"
//                     >
//                       <X className="w-5 h-5" />
//                     </button>
//                   </div>
//                   <div className="max-h-[400px] overflow-y-auto">
//                     {notifications.map((notification) => (
//                       <div
//                         key={notification.NID}
//                         className={clsx(
//                           "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
//                           !notification.read && "bg-blue-50"
//                         )}
//                         onClick={() => markAsRead(notification.NID)}
//                       >
//                         <div className="flex items-start gap-3">
//                           <div className="flex-1">
//                             <p
//                               className={clsx(
//                                 "text-sm text-gray-800",
//                                 !notification.read && "font-semibold"
//                               )}
//                             >
//                               {notification.description}
//                             </p>
//                             <div className="mt-1 flex items-center gap-2">
//                               <span className="text-xs text-gray-600 font-medium">
//                                 {notification.From}
//                               </span>
//                               <span className="text-xs text-gray-400">•</span>
//                               <span className="text-xs text-gray-500">
//                                 {getRelativeTime(notification.createdAt)}
//                               </span>
//                             </div>
//                           </div>
//                           {!notification.read && (
//                             <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
//                           )}
//                         </div>
//                       </div>
//                     ))}
//                   </div>
//                   {notifications.length > 0 && (
//                     <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
//                       <button
//                         className="text-sm text-blue-600 hover:text-blue-700 font-medium"
//                         onClick={markAllAsRead}
//                       >
//                         Mark all as read
//                       </button>
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>

//             <Link
//               to={`${linkName}/chat`}
//               className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//             >
//               <MessageCircle className="w-6 h-6 text-gray-600" />
//             </Link>

//             <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
//               <Link
//                 to={`${linkName}/profile`}
//                 className="flex items-center space-x-2 group"
//               >
//                 <div className="p-1 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
//                   <UserCircle className="w-7 h-7 text-gray-700" />
//                 </div>
//                 <div className="hidden md:block">
//                   <p className="text-sm font-medium text-gray-700">
//                     {user.fullName || "User"}
//                   </p>
//                   <p className="text-xs text-gray-500">View Profile</p>
//                 </div>
//                 <ChevronDown className="w-4 h-4 text-gray-400" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageCircle, UserCircle, ChevronDown, X } from "lucide-react";
import { useSelector } from "react-redux";
import { clsx } from "clsx";
import api from "../utils/api";
import { getRelativeTime } from "../utils/timeFormat";
import logo from "../assets/darwinbox-logo.png";

const Navbar = ({ linkName }) => {
  const { user } = useSelector((state) => state.auth);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [page] = useState(1);

  const fetchNotifications = async () => {
    try {
      const response = await api.get(
        `/api/notifications/getNotifications?page=${page}`,
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setNotifications(response.data.docs);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchNotifications();

    // Set up polling every minute
    const pollInterval = setInterval(fetchNotifications, 60000);

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  }, [page]);

  // Add an effect to update timestamps every minute
  useEffect(() => {
    const timestampInterval = setInterval(() => {
      setNotifications((currentNotifications) => [...currentNotifications]);
    }, 60000);

    return () => clearInterval(timestampInterval);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = async (NID) => {
    try {
      const response = await api.post(
        "/api/notifications/markAsRead",
        { NID },
        {
          withCredentials: true,
        }
      );
      if (response.status === 200) {
        setNotifications(
          notifications.map((notif) =>
            notif.NID === NID ? { ...notif, read: true } : notif
          )
        );
      }
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Assuming all notifications are marked as read one by one
      await Promise.all(
        notifications.filter((n) => !n.read).map((n) => markAsRead(n.NID))
      );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full z-30 top-0 shadow-sm">
      <div className="w-[90%] mx-auto px-14 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <img src={logo} className="h-16" alt=" Logo" />
              <span className="text-xl font-semibold text-gray-900">
                Talent Hive
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <Link
              to={linkName}
              className="text-gray-600 relative font-medium group"
            >
              Home
              <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-700 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            <div className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-6 h-6 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center transform translate-x-1 -translate-y-1">
                    {unreadCount}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <h6 className="font-semibold text-gray-800">
                      Notifications ({notifications.length})
                    </h6>
                    <button
                      onClick={() => setIsNotificationOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="max-h-[400px] overflow-y-auto">
                    {notifications.map((notification) => (
                      <div
                        key={notification.NID}
                        className={clsx(
                          "px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors",
                          !notification.read && "bg-blue-50"
                        )}
                        onClick={() => markAsRead(notification.NID)}
                      >
                        <div className="flex items-start gap-3">
                          <div className="flex-1">
                            <p
                              className={clsx(
                                "text-sm text-gray-800",
                                !notification.read && "font-semibold"
                              )}
                            >
                              {notification.description}
                            </p>
                            <div className="mt-1 flex items-center gap-2">
                              <span className="text-xs text-gray-600 font-medium">
                                {notification.From}
                              </span>
                              <span className="text-xs text-gray-400">•</span>
                              <span className="text-xs text-gray-500">
                                {getRelativeTime(notification.createdAt)}
                              </span>
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-blue-500 mt-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
                      <button
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        onClick={markAllAsRead}
                      >
                        Mark all as read
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <Link
              to={`${linkName}/chat`}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <MessageCircle className="w-6 h-6 text-gray-600" />
            </Link>

            <div className="flex items-center space-x-3 pl-6 border-l border-gray-200">
              <Link
                to={`${linkName}/profile`}
                className="flex items-center space-x-2 group"
              >
                <div className="p-1 rounded-full bg-gray-100 group-hover:bg-gray-200 transition-colors">
                  <UserCircle className="w-7 h-7 text-gray-700" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">
                    {user.fullName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">View Profile</p>
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
