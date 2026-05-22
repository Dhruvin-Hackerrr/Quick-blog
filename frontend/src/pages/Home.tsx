import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen overflow-hidden bg-(--bg) text-(--text) flex">
      {/* Left */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-10 border-r border-white/10">
        <div className="max-w-xl">
          <h1 className="text-6xl font-bold leading-tight">
            Publish your ideas,
            <br />
            your way.
          </h1>

          <p className="mt-6 text-lg text-gray-400 leading-relaxed">
            AI can generate a thousand articles a minute. But it can't do your
            thinking for you. Hashnode is a community of builders, engineers,
            and tech leaders who blog to sharpen their ideas, share what they've
            learned, and grow alongside people who care about the craft. Your
            blog is your reputation — start building it.
          </p>

          <Button
            label="Start your Blog Journey with us"
            onClick={() => navigate(`/blogs`)}
            className="mt-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-6 py-4 cursor-pointer"
          />
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          <img
            src="https://images.pexels.com/photos/839443/pexels-photo-839443.jpeg"
            alt="Blog Photo"
            className="rounded-4xl"
          />
        </div>
      </div>
    </div>
  );
}
