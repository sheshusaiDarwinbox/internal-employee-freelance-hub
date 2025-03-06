import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import DepartmentManagement from "./pages/ManageDepartment";
import MainLayout from "./layouts/MainLayout";
import {
  adminSidbarNavLinks,
  managerSidebarNavLinks,
  userSidebarNavLinks,
} from "./utils/sidebarUtils";
import Gigs from "./pages/Gigs";

import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import JobsManagement from "./pages/ManageJobs";
import ManagePositions from "./pages/ManagePositions";
import Leaderboard from "./pages/Leaderboard";

const Home = lazy(() => import("./pages/Home/Homepage"));
const About = lazy(() => import("./pages/Home/About"));
const Login = lazy(() => import("./pages/Login"));
const Rewards = lazy(() => import("./pages/Rewards"));
const MyGigs = lazy(() => import("./pages/MyGigs"));
const PostGigs = lazy(() => import("./pages/PostGigs"));
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

        <Route
          path="/user"
          element={
            <ProtectedRoute role="Employee">
              <MainLayout linkName="/user" navlinks={userSidebarNavLinks} />
            </ProtectedRoute>
          }
        >
          <Route index element={<Gigs />} />
          <Route path="rewards" element={<Rewards />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route index path="gigs" element={<Gigs />} />
          <Route path="work-history" element={<MyGigs />} />
          <Route path="my-activity" element={<MyActivity />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-account" element={<MyAccount />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="Admin">
              <MainLayout linkName="/admin" navlinks={adminSidbarNavLinks} />
            </ProtectedRoute>
          }
        >
          <Route path="gigs" index element={<Gigs />} />
          <Route path="departments" element={<DepartmentManagement />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<ChatPage />} />
          <Route path="jobs" element={<JobsManagement />} />
          <Route path="positions" element={<ManagePositions />} />
        </Route>

        <Route
          path="/manager"
          element={
            <ProtectedRoute role="Manager">
              <MainLayout
                linkName="/manager"
                navlinks={managerSidebarNavLinks}
              />
            </ProtectedRoute>
          }
        >
          <Route path="my-gigs" element={<MyGigs />} />
          <Route path="gigs" element={<Gigs />} />
          <Route path="post-gigs" element={<PostGigs />} />
          <Route path="profile" element={<Profile />} />
          <Route path="chat" element={<ChatPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

export default App;