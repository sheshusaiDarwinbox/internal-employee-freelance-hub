import React from "react";
import { Outlet } from "react-router-dom";
import { Navbar } from "flowbite-react";
import Nav from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = ({ linkName, navlinks }) => {
  return (
    <div className="min-h-screen">
      <Navbar className="fixed top-[90px] left-0 right-0 bg-blue-200 shadow px-6 py-6 z-10">
        <marquee>
          <h1 className="text-xl font-semibold text-gray-800">
            Your Workplace Hub: Manage Tasks, Track Progress, and Stay
            Connected!
          </h1>
        </marquee>
      </Navbar>

      <Nav linkName={linkName} className="fixed top-0 left-0 right-0 z-20" />
      <div className="flex pt-[160px]">
        <Sidebar navlinks={navlinks} />
        <div className="ml-[20%] flex-1 p-8 max-h-[calc(100vh-260px)]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
