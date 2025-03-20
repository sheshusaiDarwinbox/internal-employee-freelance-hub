import { Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import GigPage from "./pages/GigPage";
import DepartmentManagement from "./pages/ManageDepartment";
import MainLayout from "./layouts/MainLayout";
import {
  adminSidbarNavLinks,
  managerSidebarNavLinks,
  userSidebarNavLinks,
} from "./utils/sidebarUtils";
import AllGigs from "./pages/Gigs";

import Profile from "./pages/Profile";
import ChatPage from "./pages/ChatPage";
import ManagePositions from "./pages/ManagePositions";
import ManageUsers from "./pages/ManageUsers";
import GigAssignPage from "./pages/GigAssignPage";

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
const UserProfile = lazy(() => import("../src/pages/UserProfile"));
const UpdateUser = lazy(() => import("../src/pages/UpdateUsers"));
const MyHistory = lazy(() => import("../src/pages/MyHistory"));
const Leaderboard = lazy(() => import("../src/pages/LeaderBoard"));

const styles = `
  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
  }

  #root {
    height: 100vh;
    overflow: hidden;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  * {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

function App() {
  return (
    <>
      <style>{styles}</style>
      <Suspense fallback={<Loading />}>
        <div className="h-screen overflow-auto">
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
              <Route index element={<AllGigs />} />
              <Route path="rewards" element={<Rewards />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="all-gigs" element={<AllGigs />} />
              <Route path="work-history" element={<MyHistory />} />
              <Route path="my-activity" element={<MyActivity />} />
              <Route path="profile" element={<Profile />} />
              <Route path="my-account" element={<MyAccount />} />
              <Route path="chat" element={<ChatPage />} />
            </Route>

            <Route
              path="/admin"
              element={
                <ProtectedRoute role="Admin">
                  <MainLayout
                    linkName="/admin"
                    navlinks={adminSidbarNavLinks}
                  />
                </ProtectedRoute>
              }
            >
              <Route index element={<AllGigs />} />
              <Route path="all-gigs" index element={<AllGigs />} />
              <Route path="departments" element={<DepartmentManagement />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="profile" element={<Profile />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="users" element={<ManageUsers />} />
              <Route path="positions" element={<ManagePositions />} />
              <Route path="users/:userId" element={<UserProfile />} />
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
              <Route index element={<AllGigs />} />
              <Route path="my-gigs" element={<MyGigs />} />
              <Route path="all-gigs" element={<AllGigs />} />
              <Route path="post-gigs" element={<PostGigs />} />
              <Route path="leaderboard" element={<Leaderboard />} />
              <Route path="users" element={<UpdateUser />} />
              <Route path="profile" element={<Profile />} />
              <Route path="chat" element={<ChatPage />} />
              <Route path="gig/:id" element={<GigPage />} />
              <Route path="gig-assign/:GigID" element={<GigAssignPage />} />
              <Route path="users/:userId" element={<UserProfile />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Suspense>
    </>
  );
}

export default App;
