import { ShieldX, PenLine, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../ui/Button";

export default function UnauthorizedPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f1117] text-white px-6">
      <div className="max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full" />
            <ShieldX size={72} className="text-red-500 relative" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold">Access Restricted</h1>

        {/* Message */}
        <p className="mt-3 text-gray-400 text-sm leading-relaxed">
          This page is available only for{" "}
          <span className="text-white font-medium">Authors</span>.
          <br />
          You are currently logged in as a{" "}
          <span className="text-blue-400 font-medium">Reader</span>, so you
          don’t have permission to access this content.
        </p>

        {/* Illustration section */}
        <div className="mt-6 flex items-center justify-center gap-4 text-gray-500">
          <div className="flex flex-col items-center">
            <BookOpen size={26} />
            <span className="text-xs mt-1">Reader</span>
          </div>

          <div className="h-px w-10 bg-gray-700" />

          <div className="flex flex-col items-center text-red-400">
            <PenLine size={26} />
            <span className="text-xs mt-1">Author Only</span>
          </div>
        </div>

        {/* Actions */}
        <Button
          label="Browse Articles"
          className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition cursor-pointer mt-8"
          onClick={() => navigate("/blog")}
        />

        {/* Footer hint */}
        <p className="mt-6 text-xs text-gray-500">
          Tip: Become an author to publish and manage your blogs.
        </p>
      </div>
    </div>
  );
}
