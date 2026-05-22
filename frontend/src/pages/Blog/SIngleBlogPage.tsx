import { UserRound } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchBlogById } from "../../api/blog";
import { useParams } from "react-router-dom";
import { formattedDate } from "../../utils/formatDate";
import BlogView from "../../components/Blog/BlogView";
import { useAuth } from "../../context/ApiContext";
import { showError } from "../../utils/toast";
import Button from "../../ui/Button";
import { CategoryMeta } from "../../../../shared/category";
import FullScreenLoader from "../../components/ScreenLoader";
import Footer from "../../layout/Footer";

export default function SingleBlogPage() {
  const { user, isAuthenticated } = useAuth();
  const { id } = useParams();
  const [content, setContent] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddComment = async () => {
    if (!comment.trim()) return;

    try {
      setLoading(true);

      if (!user || !isAuthenticated) {
        return showError("Please Login to leave a comment");
      }

      setComment("");
    } catch (err) {
      showError(err.message);
      console.log(err);
    } finally {
      setLoading(false);
      setComment("");
    }
  };

  useEffect(() => {
    const fetchOneBlog = async () => {
      try {
        const res = (await fetchBlogById(id)).data.data;
        setContent(res);
      } catch (error) {
        console.log(error);
      }
    };

    fetchOneBlog();
  }, [id]);

  if (!content) {
    return (
      <FullScreenLoader text="This Blogs might stays within your mind..."/>
    );
  }

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) flex flex-col">
      <div className="w-3xl mx-auto px-6 py-10 flex-1">
        {/* Title */}
        <h1 className="text-4xl font-bold leading-snug mb-6">
          {content.title}
        </h1>

        {/* Author section */}
        <div className="flex items-center justify-between mb-10 border-t border-(--border) pt-6">
          {/* Author */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
              <UserRound size={22} />
            </div>

            <div>
              <p className="text-base font-semibold text-(--text)">John Doe</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>

            {(() => {
              const meta = CategoryMeta[content.category];
              const Icon = meta.icon;

              return (
                <div
                  className="flex items-center gap-2 px-2 py-1 rounded-md border mx-2 text-xs"
                  style={{
                    backgroundColor: meta.bg,
                    borderColor: meta.border,
                    color: meta.color, // applies to text + icon automatically
                  }}
                >
                  <Icon
                    size={14}
                    style={{
                      color: meta.color,
                      backgroundColor: meta.bg,
                    }}
                  />
                  <span>{content.category.replaceAll("_", " ")}</span>
                </div>
              );
            })()}
          </div>

          {/* Date */}
          <div className="text-sm text-(--muted)">
            {formattedDate(new Date(content.createdAt))}
          </div>
        </div>

        {/* Blog content */}
        <div className="prose prose-invert max-w-none mb-10">
          <BlogView content={content.body} />
        </div>

        {/* Comments heading */}
        <h2 className="text-2xl font-semibold mt-10 mb-4 border-t border-(--border) pt-6">
          {content.comments?.length} Comments
        </h2>

        {/* Write Comment - Hashnode style */}
        <div className="border-t border-(--border) pt-6 mb-8">
          <div className="flex gap-3 items-start">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center shrink-0">
              <UserRound size={18} />
            </div>

            {/* Input + actions */}
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full bg-gray-900/40 border border-(--border) rounded-md px-3 py-2 text-sm text-(--text) placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
                rows={3}
              />

              <div className="flex justify-end mt-2">
                <Button
                  label={loading ? "Posting..." : "Leave a comment"}
                  disabled={!comment.trim() || loading}
                  onClick={handleAddComment}
                  className="px-4 py-1.5 text-sm rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-40 transition cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Comments list */}
        <div className="divide-y divide-(--border)">
          {content.comments?.map((cmt) => (
            <div key={cmt.commentId} className="py-5">
              {/* User + time */}
              <div className="flex items-center gap-2 text-sm text-(--muted) mb-2">
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs">
                  {cmt.user.firstName?.[0]}
                  {cmt.user.lastName?.[0]}
                </div>

                <span className="text-white font-medium">
                  {cmt.user.firstName} {cmt.user.lastName}
                </span>

                <span className="text-gray-500">•</span>

                <span>{formattedDate(new Date(cmt.createdAt))}</span>
              </div>

              {/* Comment text */}
              <p className="text-gray-300 leading-relaxed pl-9">
                {cmt.message}
              </p>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
