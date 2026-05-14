import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type loginFormData } from "../../validations/authSchema";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { loginUser } from "../../api/auth";
import { setAccessToken } from "../../utils/localStorage";
import { useAuth } from "../../context/ApiContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function LoginForm() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

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

      setAccessToken(res.accessToken);
      setUser(res.safeUser);

      navigate("/post");
    } catch (err) {
      console.log("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <Input
        label="Email"
        type="email"
        disabled={loading}
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        disabled={loading}
        placeholder="********"
        error={errors.password?.message}
        {...register("password")}
      />

      <Button
        label={loading ? "Logging in..." : "Login"}
        disabled={loading}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 cursor-pointer"
      />
    </form>
  );
}