// components/FullScreenLoader.tsx

import { LoaderCircle } from "lucide-react";

interface FullScreenLoaderProps {
  text?: string;
}

export default function FullScreenLoader({
  text = "Loading...",
}: FullScreenLoaderProps) {
  return (
    <div className="fixed inset-0 z-9999 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
      {/* Animated Icon */}
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-blue-500/30 blur-2xl" />

        <LoaderCircle
          size={64}
          className="relative animate-spin text-blue-500"
          strokeWidth={2.5}
        />
      </div>

      {/* Text */}
      <p className="mt-6 text-lg font-medium tracking-wide text-white">
        {text}
      </p>

      {/* Small Loading Dots */}
      <div className="mt-2 flex gap-1">
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.3s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400 [animation-delay:-0.15s]" />
        <span className="h-2 w-2 animate-bounce rounded-full bg-blue-400" />
      </div>
    </div>
  );
}