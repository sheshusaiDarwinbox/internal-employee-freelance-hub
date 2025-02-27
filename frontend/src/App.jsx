import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import PropTypes from "prop-types";
import DepartmentManagement from "./components/Admin/ManageDepartment/ManageDepartment";

const RootNavbar = lazy(() => import("./components/Navbar"));
const Home = lazy(() => import("./components/Home/Homepage"));
const About = lazy(() => import("./components/Home/About"));
const Login = lazy(() => import("./components/Login"));
const Dashboard = lazy(() => import("./components/User/Dashboard/Dashboard"));
const Rewards = lazy(() => import("./components/User/Rewards/Rewards"));
const ViewAllTasks = lazy(() =>
  import("./components/User/ViewAllTasks/ViewAllTasks")
);
const MyTasks = lazy(() => import("./components/User/MyTasks/MyTasks"));
const MyActivity = lazy(() =>
  import("./components/User/MyActivity/MyActivity")
);
const DashboardHome = lazy(() =>
  import("./components/User/Dashboard/DashboardHome")
);
const AdminDashboardHome = lazy(() =>
  import("./components/Admin/Dashboard/DashboardHome")
);
const Profile = lazy(() => import("./components/User/Profile/Profile"));
const MyAccount = lazy(() => import("./components/User/MyAccount/MyAccount"));
const AdminDashboard = lazy(() =>
  import("./components/Admin/Dashboard/Dashboard")
);
const ForgotPassword = lazy(() => import("./components/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/Resetpassword"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Loading = lazy(() => import("./components/Loading"));
const PublicRoute = lazy(() => import("./components/PublicRoute"));

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
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Root routes with Navbar */}
        {/* <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/about"
          element={
            <Layout>
              <About />
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/reset-password/:ID/:forgotVerifyString"
          element={<ResetPassword />}
        /> */}

        <Route
          path="/"
          element={
            <PublicRoute>
              <Outlet />
            </PublicRoute>
          }
        >
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route
            path="/reset-password/:ID/:forgotVerifyString"
            element={<ResetPassword />}
          />
        </Route>

        {/* User Dashboard with Nested Routes */}

        <Route
          path="/user"
          element={
            <ProtectedRoute role="Employee">
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="view-all-tasks" element={<ViewAllTasks />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="my-activity" element={<MyActivity />} />
          <Route path="my-profile" element={<Profile />} />
          <Route path="my-account" element={<MyAccount />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminDashboardHome />} />
          <Route path="tasks" element={<ViewAllTasks />} />
          <Route path="departments" element={<DepartmentManagement />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
