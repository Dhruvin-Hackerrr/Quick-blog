import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({
  label,
  error,
  className = "",
  ...props
}: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm text-gray-300">{label}</label>
      )}

      <input
        {...props}
        className={`mt-2 w-full h-12 rounded-xl bg-[#0d1117] border px-4 outline-none focus:border-blue-500 ${
          error ? "border-red-500 focus:border-red-500" : "border-white/10"
        } ${className}`}
      />

      {error && (
        <span className="text-xs text-red-400 pl-2 mt-1">{error}</span>
      )}
    </div>
  );
}