import { useEffect, useState } from "react";
import { fetchBlogs } from "../../api/blog";
import Input from "../../ui/Input";
import { useNavigate } from "react-router-dom";
import { Calendar, MessageCircleMore, User } from "lucide-react";
import { formattedDate } from "../../utils/formatDate";
import { extractText } from "../../utils/extractText";
import { CategoryMeta } from "../../../../shared/category";
import Button from "../../ui/Button";
import FullScreenLoader from "../../components/ScreenLoader";
import Footer from "../../layout/Footer";

export default function BlogList() {
  const [search, setSearch] = useState("");
  const [blogs, setBlogs] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 5;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllBlogs = async () => {
      try {
        const res = (await fetchBlogs(page, limit)).data.data;
        setBlogs(res.blogsData);
        setTotalPages(Math.ceil(res.totalDocuments / limit));
      } catch (error) {
        console.log(error);
      }
    };

    fetchAllBlogs();
  }, [page, limit]);

  if (!blogs) {
    return <FullScreenLoader text="Fetching Blogs for you..." />;
  }

  const filteredBlogs = blogs.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col bg-(--bg) text-(--text)">
      <div className="flex-1">
        <div className="max-w-4xl mx-auto px-6 py-10">
          {/* Heading */}
          <h1 className="text-3xl font-bold mb-2">
            Discover Insights & Stories
          </h1>

          <p className="text-(--muted) mb-6">
            Explore articles, tutorials, and thoughts shared by developers and
            writers.
          </p>

          {/* Search */}
          <Input
            type="text"
            placeholder="Search blogs..."
            className="w-full p-2 rounded-lg bg-(--surface) border border-(--border) text-(--text) focus:ring-(--primary) mb-6"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Blog List */}
          <div>
            {filteredBlogs.map((blog) => (
              <div
                key={blog.postId}
                onClick={() => navigate(`/blog/${blog.postId}`)}
                className="cursor-pointer border-b border-b-(--border) py-6 hover:border-(--primary) transition px-2"
              >
                {/* Meta row */}
                <div className="flex flex-wrap items-center gap-5 text-sm text-(--text) mb-4 justify-between">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                      <User size={14} />
                      {blog?.author?.firstName} {blog?.author?.lastName}
                    </div>

                    {(() => {
                      const meta = CategoryMeta[blog.category];
                      const Icon = meta.icon;

                      return (
                        <div
                          className="flex items-center gap-2 px-2 py-1 rounded-md border text-xs"
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
                          <span>{blog.category.replaceAll("_", " ")}</span>
                        </div>
                      );
                    })()}
                    {blog.createdAt !== blog.updatedAt && (
                      <div className="flex text-(--muted) justify-center items-center italic">
                        Updated on : {formattedDate(new Date(blog.updatedAt))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formattedDate(new Date(blog.createdAt))}
                  </div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-(--text) mb-1 transition">
                  {blog.title}
                </h2>

                {/* Preview */}
                <p className="text-(--muted) line-clamp-2 mb-3">
                  {extractText(blog.body)}
                </p>

                {/* Footer */}
                <div className="flex items-center gap-2 text-[color-mix(in_srgb,var(--text),transparent_40%)] text-sm">
                  <MessageCircleMore size={14} />
                  {blog.comments.length} comments
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-2 mt-10">
            <Button
              label="Prev"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="px-3 py-1 rounded-md border border-(--border) text-sm disabled:opacity-40 cursor-pointer"
            />

            {Array.from({ length: totalPages }).map((_, i) => {
              const pageNumber = i + 1;

              return (
                <Button
                  label={pageNumber.toString()}
                  key={pageNumber}
                  onClick={() => setPage(pageNumber)}
                  className={`px-3 py-1 rounded-md text-sm border transition cursor-pointer ${
                    page === pageNumber
                      ? "bg-(--primary) text-white border-(--primary)"
                      : "border-(--border) hover:bg-white/5"
                  }`}
                />
              );
            })}

            <Button
              label="Next"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="px-3 py-1 rounded-md border border-(--border) text-sm disabled:opacity-40 cursor-pointer"
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
