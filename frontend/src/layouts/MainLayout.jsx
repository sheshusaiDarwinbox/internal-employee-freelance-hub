// import React from "react";
// import { Outlet } from "react-router-dom";
// import { Navbar } from "flowbite-react";
// import Nav from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// const MainLayout = ({ linkName, navlinks }) => {
//   return (
//     <div className="min-h-screen">
//       <Navbar className="fixed top-[90px] left-0 right-0 bg-blue-200 shadow px-6 py-6 z-10">
//         <marquee>
//           <h1 className="text-xl font-semibold text-gray-800">
//             Your Workplace Hub: Manage Tasks, Track Progress, and Stay
//             Connected!
//           </h1>
//         </marquee>
//       </Navbar>

//       <Nav linkName={linkName} className="fixed top-0 left-0 right-0 z-20" />
//       <div className="flex pt-[160px]">
//         <Sidebar navlinks={navlinks} />
//         <div className="ml-[20%] flex-1 p-8 max-h-[calc(100vh-260px)]">
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

import React from "react";
import { Outlet } from "react-router-dom";
import Nav from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ linkName, navlinks }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav linkName={linkName} />

      {/* Announcement Banner */}
      <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-3 text-center">
            <p className="text-sm font-medium text-white">
              Your Workplace Hub: Manage Tasks, Track Progress, and Stay
              Connected!
            </p>
          </div>
        </div>
      </div>

      <div className="pt-28">
        {/* Main Content Area */}
        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-6">
            {/* Sidebar */}
            <div className="w-64 flex-shrink-0">
              <div className="sticky top-28">
                <Sidebar navlinks={navlinks} />
              </div>
            </div>

            {/* Main Content */}
            <main className="flex-1 min-w-0 pb-8">
              <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[calc(100vh-8rem)]">
                <div className="p-6">
                  <Outlet />
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
