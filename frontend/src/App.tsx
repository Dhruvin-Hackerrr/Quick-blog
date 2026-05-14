import { Route, Routes } from "react-router-dom";
import Layout from "./layout/Layout";
import NotFound from "./pages/NotFound";
import HomePage from "./pages/Home";
import PostPage from "./pages/Post/Posts";
import WritePostPage from "./pages/Post/WritePost";

export default function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="/post" element={<PostPage />} />
          <Route path="/post/all" element={<WritePostPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}
