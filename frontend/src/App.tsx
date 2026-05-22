import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home";
import { Toaster } from "react-hot-toast";
import WriteBlogPage from "./pages/Blog/WriteBlog";
import ProtectedRoute from "./routes/ProtectedRoute";
import BlogsPage from "./pages/Blog/Blogs";
import SingleBlogPage from "./pages/Blog/SIngleBlogPage";
import AuthorDashboard from "./pages/DashBoard";
import AuthPage from "./pages/auth/AuthPage";
import { Role } from "./types/authtype";

export default function App() {
  
  return (
    <div>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRole={[Role.AUTHOR]}>
                <AuthorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/blogs" element={<BlogsPage />} />
          <Route path="/blog/:id" element={<SingleBlogPage />} />
          <Route
            path="/blog/publish"
            element={
              <ProtectedRoute allowedRole={[Role.AUTHOR]}>
                <WriteBlogPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/blog/publish/:id"
            element={
              <ProtectedRoute allowedRole={[Role.AUTHOR]}>
                <WriteBlogPage />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
