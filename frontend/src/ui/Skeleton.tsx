type SkeletonProps = {
  className?: string;
};

export default function Skeleton({ className = "" }: SkeletonProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-[#1a2234] ${className}`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-linear-to-r from-transparent via-white/5 to-transparent" />
    </div>
  );
}
