import { useState } from "react";
import Button from "../../ui/Button";
import RegisterForm from "../../form/RegisterForm";
import LoginForm from "../../form/LoginForm";
import { useAuth } from "../../context/ApiContext";
import Home_img from "../../assets/Home_img.jpeg"

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const { isAuthenticated } = useAuth();

  return (
    <div className="h-screen overflow-hidden bg-(--bg) text-(--text) flex">
      
      <div className="flex-1 flex items-center justify-center p-6 overflow-hidden bg-(--surface)">
        <div className="w-full max-w-md">
          {isAuthenticated ? (
            <>
              <img
                src={Home_img}
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

                <p className="text-(--text) mt-3">
                  {isRegister
                    ? "Create your account to get started."
                    : "Welcome back. Login to continue."}
                </p>
              </div>

              {/* Card */}
              <div className="rounded-3xl border border-white/10 bg-(--bg) p-8 shadow-2xl">
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
