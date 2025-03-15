// import { useState } from "react";
// import { Link } from "react-router-dom";
// import { Dropdown } from "flowbite-react";
// import { Bell, MessageCircle, UserCircle } from "lucide-react";
// import logo from "../assets/darwinbox-logo.png";
// import { useSelector } from "react-redux";
// import WebSocketComponent from "./WebSocketConnection";

// const Navbar = ({ linkName }) => {
//   const { user } = useSelector((state) => state.auth);
//   const [notifications, setNotifications] = useState([
//     {
//       NID: "1",
//       EID: "EMP001",
//       description: 'Your task "UI Design" has been approved',
//       From: "Manager",
//       timestamp: "2 hours ago",
//       read: false,
//     },
//     {
//       NID: "2",
//       EID: "EMP001",
//       description: "New task available in Engineering department",
//       From: "System",
//       timestamp: "1 day ago",
//       read: true,
//     },
//   ]);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const markAsRead = (NID) => {
//     setNotifications(
//       notifications.map((notif) =>
//         notif.NID === NID ? { ...notif, read: true } : notif
//       )
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications(notifications.map((n) => ({ ...n, read: true })));
//   };

//   return (
//     <nav className="bg-white border-b border-gray-200 fixed w-full z-30 top-0 px-4">
//       <div className="w-full mx-auto p-4 flex justify-between items-center">
//         <Link
//           to="/"
//           className="flex items-center space-x-3 rtl:space-x-reverse"
//         >
//           <img src={logo} className="h-16" alt="Darwinbox Logo" />
//           <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
//             Talent Hive
//           </span>
//         </Link>

//         <div className="flex items-center space-x-4 md:space-x-8 flex-wrap">
//           <WebSocketComponent />
//           <Link to={linkName} className="text-lg hover:text-blue-600">
//             Home
//           </Link>

//           <Dropdown
//             label={
//               <div className="relative p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//                 <Bell className="w-6 h-6 text-blue-700 dark:text-blue-300" />
//                 {unreadCount > 0 && (
//                   <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-600 text-white text-xs rounded-full flex items-center justify-center">
//                     {unreadCount}
//                   </span>
//                 )}
//               </div>
//             }
//             arrowIcon={false}
//             inline={true}
//             className="w-80"
//           >
//             <div className="py-2">
//               <h6 className="px-4 py-2 font-medium text-sm text-gray-700 border-b">
//                 Notifications ({notifications.length})
//               </h6>
//               <div className="max-h-96 overflow-y-auto">
//                 {notifications.map((notification) => (
//                   <div
//                     key={notification.NID}
//                     className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
//                       !notification.read ? "bg-blue-50" : ""
//                     }`}
//                     onClick={() => markAsRead(notification.NID)}
//                   >
//                     <div className="flex items-start gap-3">
//                       <div className="flex-1">
//                         <p
//                           className={`text-sm ${
//                             !notification.read ? "font-semibold" : ""
//                           }`}
//                         >
//                           {notification.description}
//                         </p>
//                         <div className="mt-1 flex items-center gap-2">
//                           <span className="text-xs text-gray-500">
//                             From: {notification.From}
//                           </span>
//                           <span className="text-xs text-gray-400">
//                             {notification.timestamp}
//                           </span>
//                         </div>
//                       </div>
//                       {!notification.read && (
//                         <div className="h-2 w-2 rounded-full bg-blue-500" />
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//               {notifications.length > 0 && (
//                 <div className="px-4 py-2 border-t">
//                   <button
//                     className="text-sm text-blue-600 hover:text-blue-700"
//                     onClick={markAllAsRead}
//                   >
//                     Mark all as read
//                   </button>
//                 </div>
//               )}
//             </div>
//           </Dropdown>

//           <Link to={`${linkName}/chat`}>
//             <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700">
//               <MessageCircle className="w-6 h-6 text-blue-700 dark:text-blue-300" />
//             </button>
//           </Link>

//           <button className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 border-b border-gray-200">
//             <Link to={`${linkName}/profile`}>
//               <UserCircle className="w-6 h-6 text-blue-700 dark:text-blue-300" />
//             </Link>
//           </button>

//           <span className="text-slate-900 dark:text-gray-300 font-medium hidden md:inline">
//             Welcome,{" "}
//             <span className="font-semibold">{user.fullName || "user"}</span>
//           </span>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;

import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, MessageCircle, UserCircle, ChevronDown, X } from "lucide-react";
import { useSelector } from "react-redux";
import WebSocketComponent from "./WebSocketConnection";
import { clsx } from "clsx";

const Navbar = ({ linkName }) => {
  const { user } = useSelector((state) => state.auth);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      NID: "1",
      EID: "EMP001",
      description: 'Your task "UI Design" has been approved',
      From: "Manager",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      NID: "2",
      EID: "EMP001",
      description: "New task available in Engineering department",
      From: "System",
      timestamp: "1 day ago",
      read: true,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (NID) => {
    setNotifications(
      notifications.map((notif) =>
        notif.NID === NID ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full z-30 top-0 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">TH</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">
                Talent Hive
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            <WebSocketComponent />

            <Link
              to={linkName}
              className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Home
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
                                {notification.timestamp}
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
