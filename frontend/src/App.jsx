import { BrowserRouter, Routes, Route } from "react-router-dom";
import RootNavbar from "./components/Navbar";
import Home from "./components/Home/Homepage";
import Login from "./components/Login"; // Importing the Login component
import About from "./components/Home/About";
// import DashboardLayout from "./components/User/Dashboard/DashboardLayout";
import Dashboard from "./components/User/Dashboard/Dashboard";
import Rewards from "./components/User/Rewards/Rewards";
import ViewAllTasks from "./components/User/ViewAllTasks/ViewAllTasks";
import MyTasks from "./components/User/MyTasks/MyTasks";
import MyActivity from "./components/User/MyActivity/MyActivity";
import PropTypes from "prop-types";
import  DashboardHome  from "./components/User/Dashboard/DashboardHome";
import  AdminDashboardHome  from "./components/Admin/Dashboard/DashboardHome";

import Profile from "./components/User/Profile/Profile";
import MyAccount from "./components/User/MyAccount/MyAccount";
import AdminDashboard from "./components/Admin/Dashboard/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/Resetpassword";


/** Layout component for pages that require a Navbar */
const Layout = ({ children }) => (
  <>
    <RootNavbar />
    <div className="mt-20">{children}</div>
  </>
);
Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root routes with Navbar */}
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route
          path="/reset-password/:ID/:forgotVerifyString"
          element={<ResetPassword />}/>

        {/* User Dashboard with Nested Routes */}
        <Route path="/user" element={<Dashboard />}>
          <Route index element={<DashboardHome />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="view-all-tasks" element={<ViewAllTasks />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="my-activity" element={<MyActivity />} />
          <Route path="my-profile" element={<Profile />} />
          <Route path="my-account" element={<MyAccount/>} />
        </Route>

        <Route path="/admin" element={<AdminDashboard/>}>
          <Route index element={<AdminDashboardHome />} />
          <Route path="tasks" element={<ViewAllTasks />} />
         </Route>

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
