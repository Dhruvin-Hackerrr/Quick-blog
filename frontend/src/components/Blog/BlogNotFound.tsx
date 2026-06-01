import { FileSearch, ArrowLeft } from "lucide-react";
import Button from "../../ui/Button";
import { useNavigate } from "react-router-dom";

export default function BlogNotFound({ error } : {error?: string}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-(--bg) flex items-center justify-center px-6">
      <div className="relative overflow-hidden max-w-lg w-full rounded-3xl border border-(--border) bg-(--surface) p-10 text-center shadow-2xl">
        {/* BACKGROUND GLOW */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_45%)]" />

        {/* CONTENT */}
        <div className="relative z-10">
          {/* ICON */}
          <div className="mx-auto mb-6 flex h-22 w-22 items-center justify-center rounded-2xl bg-blue-500/10 border border-blue-500/20">
            <FileSearch size={42} className="text-blue-400" strokeWidth={1.8} />
          </div>

          {/* TITLE */}
          <h1 className="text-3xl font-bold tracking-tight mb-3 text-(--text)">
            {error || "Blog Not Found"}
          </h1>

          {/* DESCRIPTION */}
          <p className="text-(--muted) leading-relaxed max-w-md mx-auto mb-8">
            The article you’re trying to access may have been removed, is still
            unpublished, or you don’t have permission to view it.
          </p>

          {/* ACTIONS */}
          <div className="flex items-center justify-center gap-3">
            <Button
              onClick={() => navigate("/blogs")}
              className="h-11 px-5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-blue-500/20 cursor-pointer"
            >
              <ArrowLeft size={18} />
              Back to Blogs
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
