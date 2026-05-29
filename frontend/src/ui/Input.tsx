import React from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "size"
> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
};

export default function Input({
  label,
  error,
  className = "",
  leftIcon,
  rightIcon,
  size = "md",
  ...props
}: InputProps) {
  const sizes = {
    sm: "py-2 text-sm",
    md: "py-3 text-base",
    lg: "py-4 text-xl",
  };


  return (
    <div className="flex flex-col gap-1">
      {/* Label */}
      {label && (
        <label className="text-sm text-(--muted)">
          {label}
        </label>
      )}

      {/* Input Wrapper */}
      <div className="relative">

        {/* Left Icon */}
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-(--muted)">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          className={`
            w-full
            bg-(--surface)
            text-(--text)
            placeholder:text-(--muted)
            border
            border-(--border)
            focus:border-(--primary)
            rounded-md
            outline-none
            transition-all
            duration-200

            ${sizes[size]}

            ${leftIcon ? "pl-11" : "pl-4"}
            ${rightIcon ? "pr-11" : "pr-4"}

            ${error ? "border-red-500 focus:border-red-500" : ""}

            ${className}
          `}
        />

        {/* Right Icon */}
        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-(--muted) cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <span className="text-xs text-red-400 pl-2 mt-1">
          {error}
        </span>
      )}
    </div>
  );
}