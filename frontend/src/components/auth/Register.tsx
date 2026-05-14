import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type registerFormData } from "../../validations/authSchema";
import Input from "../../ui/Input";
import Button from "../../ui/Button";
import { useAuth } from "../../context/ApiContext";
import { useState } from "react";

export default function RegisterForm() {
  const { userRegister } = useAuth();
  const [loading, setLoading] = useState(false);

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
      console.log(data)
      await userRegister(data);
    } catch (err) {
      console.log("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="First Name"
          type="text"
          disabled={loading}
          placeholder="John"
          error={errors.firstName?.message}
          {...register("firstName")}
        />

        <Input
          label="Last Name"
          type="text"
          disabled={loading}
          placeholder="Doe"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

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

      <Input
        label="Confirm Password"
        type="password"
        disabled={loading}
        placeholder="********"
        error={errors.confirmPassword?.message}
        {...register("confirmPassword")}
      />

      <div>
        <label className="text-sm text-gray-300 block mb-2">Role</label>

        <select
          className="w-full h-12 rounded-xl bg-[#0d1117] border border-white/10 px-4 text-gray-300"
          disabled={loading}
          {...register("role")}
        >
          <option value="READER">Reader</option>
          <option value="AUTHOR">Author</option>
        </select>
      </div>

      <Button
        label={loading ? "Creating account..." : "Create Account"}
        disabled={loading}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-500 cursor-pointer"
      />
    </form>
  );
}