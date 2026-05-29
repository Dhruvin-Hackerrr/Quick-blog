import Button from "../ui/Button";
import { useNavigate } from "react-router-dom";
import Home_img from "../assets/Home_img.jpeg";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-(--bg) text-(--text) flex flex-col lg:flex-row overflow-hidden">

      {/* LEFT CONTENT */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 border-b lg:border-b-0 lg:border-r border-white/10">

        <div className="max-w-xl text-center lg:text-left">

          <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold leading-tight">
            Publish your ideas,
            <br />
            your way.
          </h1>

          <p className="mt-5 sm:mt-6 text-sm sm:text-base lg:text-lg text-gray-400 leading-relaxed">
            AI can generate a thousand articles a minute. But it can't do your
            thinking for you. QuickBlog is a community of builders, engineers,
            and tech leaders who blog to sharpen their ideas, share what they've
            learned, and grow alongside people who care about the craft. Your
            blog is your reputation — start building it.
          </p>

          <Button
            label="Start your Blog Journey with us"
            onClick={() => navigate(`/blogs`)}
            variant="primary"
            className="mt-8 lg:mt-10 rounded-(--radius) transition px-5 py-3 lg:px-6 lg:py-4 cursor-pointer"
          />
        </div>
      </div>

      {/* RIGHT IMAGE */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10 overflow-hidden">

        <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg">
          <img
            src={Home_img}
            alt="Blog Photo"
            className="w-full h-auto rounded-3xl sm:rounded-4xl object-cover"
          />
        </div>

      </div>
    </div>
  );
}