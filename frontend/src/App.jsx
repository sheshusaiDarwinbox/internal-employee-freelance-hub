import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import DepartmentManagement from "./pages/ManageDepartment";
import MainLayout from "./layouts/MainLayout";
import {
  adminSidbarNavLinks,
  managerSidebarNavLinks,
  userSidebarNavLinks,
} from "./utils/sidebarUtils";
import AllTasks from "./pages/AllTasks";

import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";

const Home = lazy(() => import("./pages/Home/Homepage"));
const About = lazy(() => import("./pages/Home/About"));
const Login = lazy(() => import("./pages/Login"));
const Rewards = lazy(() => import("./pages/Rewards"));
const MyTasks = lazy(() => import("./pages/MyTasks"));
const MyActivity = lazy(() => import("./pages/MyActivity"));
const MyAccount = lazy(() => import("./pages/MyAccount"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/Resetpassword"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const Loading = lazy(() => import("./components/Loading"));
const PublicRoute = lazy(() => import("./components/PublicRoute"));
const PublicLayout = lazy(() => import("./layouts/PublicLayout"));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Root routes with Navbar */}

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
              <PublicLayout>
                <Home />
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <About />
              </PublicLayout>
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
              <MainLayout navlinks={userSidebarNavLinks} />
            </ProtectedRoute>
          }
        >
          <Route index element={<AllTasks />} />
          <Route path="rewards" element={<Rewards />} />
          <Route index path="view-all-tasks" element={<AllTasks />} />
          <Route path="my-tasks" element={<MyTasks />} />
          <Route path="my-activity" element={<MyActivity />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <MainLayout navlinks={adminSidbarNavLinks} />
            </ProtectedRoute>
          }
        >
          <Route path="tasks" index element={<AllTasks />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="Manager">
              <MainLayout navlinks={managerSidebarNavLinks} />
            </ProtectedRoute>
          }
        >
          <Route path="view-all-tasks" element={<AllTasks />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;
