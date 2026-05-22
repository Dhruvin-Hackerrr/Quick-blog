import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  registerSchema
} from "../validations/authSchema";
import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "../context/ApiContext";
import { useState } from "react";
import { showError, showSuccess } from "../utils/toast";
import {
  User,
  Mail,
  Lock,
  Shield,
  EyeOff,
  Eye,
  ChevronDown,
} from "lucide-react";
import { Role, type registerFormData } from "../types/authtype";

export default function RegisterForm() {
  const { userRegister } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<registerFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: registerFormData) => {
    setLoading(true);

    try {
      await userRegister(data);
      showSuccess("User Register Successfully!");
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Something went wrong";

      showError(message);
      console.log("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      {/* First + Last Name */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          disabled={loading}
          placeholder="John"
          leftIcon={<User size={18} />}
          error={errors.firstName?.message}
          className="pl-10"
          {...register("firstName")}
        />

        <Input
          label="Last Name"
          type="text"
          disabled={loading}
          placeholder="Doe"
          leftIcon={<User size={18} />}
          error={errors.lastName?.message}
          className="pl-10"
          {...register("lastName")}
        />
      </div>

      {/* Email */}
      <Input
        label="Email"
        type="email"
        disabled={loading}
        placeholder="you@example.com"
        leftIcon={<Mail size={18} />}
        error={errors.email?.message}
        className="pl-10"
        {...register("email")}
      />

      {/* Password */}
      <Input
        label="Password"
        type={showPassword ? "text" : "password"}
        disabled={loading}
        placeholder="Enter Password"
        leftIcon={<Lock size={18} />}
        rightIcon={
          <div onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        }
        error={errors.password?.message}
        className="pl-10"
        {...register("password")}
      />

      {/* Confirm Password */}
      <Input
        label="Confirm Password"
        type={showPassword ? "text" : "password"}
        disabled={loading}
        placeholder="Confirm Password"
        leftIcon={<Lock size={18} />}
        rightIcon={
          <div onClick={() => setShowPassword((prev) => !prev)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        }
        error={errors.confirmPassword?.message}
        className="pl-10"
        {...register("confirmPassword")}
      />

      {/* Role */}
      <div className="w-full">
        <label className="block mb-2 text-sm font-semibold text-gray-300">
          Select Role
        </label>
        <div className="relative">
          <Shield
            className="fa-solid fa-briefcase absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          ></Shield>

          <select
            id="role"
            name="role"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-[#0d1117] border border-white/10 px-10 text-gray-300 appearance-none"
            {...register("role")}
          >
            <option value={Role.AUTHOR}>Author</option>
            <option value={Role.READER}>Reader</option>
          </select>

          <ChevronDown
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>
      </div>

      {/* Button */}
      <Button
        label={loading ? "Creating account..." : "Create Account"}
        type="submit"
        disabled={loading}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 cursor-pointer"
      />
    </form>
  );
}
