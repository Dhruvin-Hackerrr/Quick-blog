import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema} from "../validations/authSchema";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { loginUser } from "../api/auth";
import { setAccessToken } from "../utils/localStorage";
import { useAuth } from "../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { showError, showSuccess } from "../utils/toast.js";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import { Role, type loginFormData } from "../types/authtype.js";

export default function LoginForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<loginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: loginFormData) => {
    setLoading(true);

    try {
      const res = (await loginUser(data)).data.data;
      showSuccess("Logged In Successfully!");

      setAccessToken(res.accessToken);
      setUser(res.safeUser);
      
      if(res.safeUser.role === Role.AUTHOR) return navigate("/dashboard")
      navigate("/blogs");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";

      showError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className="space-y-5 overflow-hidden"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Input
        label="Email"
        type="email"
        leftIcon={<Mail size={18} />}
        disabled={loading}
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        leftIcon={<Lock size={18} />}
        rightIcon={
          <div onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        }
        disabled={loading}
        placeholder="Enter your Password"
        error={errors.password?.message}
        {...register("password")}
      />

      <div className="relative w-full pt-1">
        {/* Icon */}
        <LogIn
          size={18}
          className="absolute left-1/2 top-1/2 -translate-x-14 translate-y-[-25%] text-white z-10 pointer-events-none"
        />

        {/* Button */}
        <Button
          label={loading ? "Logging in..." : "Login"}
          type="submit"
          disabled={loading}
          className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all duration-200 cursor-pointer"
        />
      </div>
    </form>
  );
}
