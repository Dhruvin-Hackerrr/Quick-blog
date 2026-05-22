import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export default function Input({
  label,
  error,
  className = "",
  leftIcon,
  rightIcon,
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm text-gray-300">{label}</label>}

      <div className="relative">
        {leftIcon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}

        <input
          {...props}
          className={`w-full rounded-xl bg-[#0d1117] border py-3 outline-none focus:border-blue-500 
            ${leftIcon ? "pl-11" : "pl-4"}
            ${rightIcon ? "pr-11" : "pr-4"}
            ${
              error ? "border-red-500 focus:border-red-500" : "border-white/10"
            } 
            ${className}
          `}
        />

        {rightIcon && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
            {rightIcon}
          </div>
        )}
      </div>

      {error && <span className="text-xs text-red-400 pl-2 mt-1">{error}</span>}
    </div>
  );
}
