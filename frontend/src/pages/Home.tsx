import { useState } from "react";
import Button from "../ui/Button";
import RegisterForm from "../components/auth/Register";
import LoginForm from "../components/auth/Login";
import { useAuth } from "../context/ApiContext";

export default function HomePage() {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen overflow-hidden bg-[#0d1117] text-white flex">
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

          <button className="mt-10 rounded-2xl border border-white/10 bg-white/5 hover:bg-white/10 transition px-6 py-4">
            Write your Own Blog
          </button>
        </div>
      </div>

      {/* Right */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md">
          {isAuthenticated ? (
            <>
              <img
                src="https://images.pexels.com/photos/839443/pexels-photo-839443.jpeg"
                alt="Blog Photo"
                className="rounded-4xl"
              />
            </>
          ) : (
            <>
              {/* Logo */}
              <div className="mb-10">
                <h1 className="text-4xl font-bold">
                  Quick<span className="text-blue-500">Blog</span>
                </h1>

                <p className="text-gray-400 mt-3">
                  {isRegister
                    ? "Create your account to get started."
                    : "Welcome back. Login to continue."}
                </p>
              </div>

              {/* Card */}
              <div className="rounded-3xl border border-white/10 bg-[#161b22] p-8 shadow-2xl">
                {isRegister ? <RegisterForm /> : <LoginForm />}

                <p className="text-sm text-gray-500 mt-6 text-center">
                  By continuing, you agree to our Terms & Privacy Policy.
                </p>
              </div>

              {/* Toggle Button */}
              <div className="mt-6 text-center">
                <span className="text-sm text-gray-500">
                  {isRegister
                    ? "Already have an account?"
                    : "Don't have an account?"}
                </span>

                <Button
                  label={isRegister ? "Login" : "Create account"}
                  onClick={() => setIsRegister((prev) => !prev)}
                  className="ml-2 text-sm text-blue-500 hover:text-blue-400 transition font-medium cursor-pointer"
                />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
