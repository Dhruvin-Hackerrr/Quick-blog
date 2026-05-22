export default function Footer() {
  return (
    <div>
      <div className="mt-14 pt-8 pb-10 border-t border-(--border) text-center text-sm text-(--muted)">
        <p className="mb-2">
          Built for Peoples who love writing and sharing ideas.
        </p>

        <p className="text-xs text-(--muted)/70">
          © {new Date().getFullYear()} QuickBlog. All rights reserved.
        </p>

        <div className="flex items-center justify-center gap-4 mt-4 text-xs">
          <span className="hover:text-(--text) cursor-pointer transition">
            Privacy
          </span>
          <span className="hover:text-(--text) cursor-pointer transition">
            Terms
          </span>
          <span className="hover:text-(--text) cursor-pointer transition">
            About
          </span>
        </div>
      </div>
    </div>
  )
}
