// import { Outlet } from "react-router-dom";
// import Nav from "../components/Navbar";
// import Sidebar from "../components/Sidebar";

// const MainLayout = ({ linkName, navlinks }) => {
//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Nav linkName={linkName} />

//       {/* Announcement Banner */}
//       <div className="fixed top-16 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="py-3 text-center">
//             <p className="text-sm font-medium text-white">
//               Your Workplace Hub: Manage Tasks, Track Progress, and Stay
//               Connected!
//             </p>
//           </div>
//         </div>
//       </div>

//       <div className="pt-28">
//         {/* Main Content Area */}
//         <div className=" mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex gap-6">
//             {/* Sidebar */}
//             <div className="w-64 flex-shrink-0">
//               <div className="sticky top-28">
//                 <Sidebar navlinks={navlinks} />
//               </div>
//             </div>

//             {/* Main Content */}
//             <main className="flex-1 min-w-0 pb-8">
//               <div className="bg-white rounded-lg shadow-sm border border-gray-100 min-h-[calc(100vh-8rem)]">
//                 <div className="p-6">
//                   <Outlet />
//                 </div>
//               </div>
//             </main>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default MainLayout;

import { Outlet } from "react-router-dom";
import Nav from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ linkName, navlinks }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Nav linkName={linkName} />

      {/* Announcement Banner */}
      <div className="fixed top-24 py-2 left-0 right-0 bg-gradient-to-r from-blue-500 to-blue-600 shadow-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-2 text-center">
            <marquee>
              <p className="text-s font-medium text-white">
                Your Workplace Hub: Manage Tasks, Track Progress, and Stay
                Connected!
              </p>
            </marquee>
          </div>
        </div>
      </div>

      <div className="pt-40">
        {/* Main Content Area */}
        <div className="">
          <div className="flex ">
            {/* Sidebar */}
            <div className="w-80">
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
