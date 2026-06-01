import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  PenSquare,
  FileText,
  House,
  Menu,
  LogOut,
  LogIn,
  type LucideIcon,
} from "lucide-react";
import { useAuth } from "../context/ApiContext";
import Button from "../ui/Button";
import { useLocation, useNavigate } from "react-router-dom";
import { showError } from "../utils/toast";
import { Role } from "../types/authtype";

type MenuItem = {
  name: string;
  icon: LucideIcon;
  path: string;
  requiresAuth?: boolean;
};

export default function Sidebar({
  mobileOpen,
  setMobileOpen,
}: {
  mobileOpen: boolean;
  setMobileOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const { isAuthenticated, user, logout, loading, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const menu = [
    ...(role === Role.AUTHOR
      ? [{ name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" }]
      : [{ name: "Home", icon: House, path: "/" }]),
    {
      name: "Write",
      icon: PenSquare,
      path: "/blog/publish",
      requiresAuth: true,
    },
    { name: "Articles", icon: FileText, path: "/blogs" },
  ];

  const handleNav = (item: MenuItem) => {
    if (item.requiresAuth && !isAuthenticated) {
      navigate("/login");
      showError("Please Login to continue");
      setMobileOpen(false);
      return;
    }

    navigate(item.path);

    // ✅ CLOSE MOBILE SIDEBAR ON NAVIGATION
    setMobileOpen(false);
  };

  return (
    <>
      {/* BACKDROP */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/40 md:hidden z-40"
        />
      )}

      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-full

          bg-[#11131a] text-white border-r border-white/10
          flex flex-col transition-all duration-300

          w-72 ${isMobile ? "w-72" : collapsed ? "md:w-20" : "md:w-64"}

          transform md:translate-x-0
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        {/* HEADER */}
        <div className="h-16 flex items-center px-4 border-b border-white/10">
          {/* LEFT SIDE (logo always safe in flex flow) */}
          <div className="flex-1 flex items-center">
            {!collapsed && (
              <h1 className="text-xl font-bold">
                Quick<span className="text-blue-500">Blog</span>
              </h1>
            )}
          </div>

          {/* RIGHT SIDE (icons group always aligned) */}
          <div className="flex items-center gap-2">
            {/* MOBILE CLOSE */}
            <Button
              onClick={() => setMobileOpen(false)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <Menu size={22} />
            </Button>

            {/* DESKTOP COLLAPSE */}
            <Button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden md:flex w-10 h-10 items-center justify-center rounded-lg hover:bg-white/10 cursor-pointer"
            >
              <Menu size={22} />
            </Button>
          </div>
        </div>

        {/* MENU */}
        <div className="flex-1 py-4 px-2 space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <div key={item.name} className="relative group">
                <div key={item.name} className="relative group">
                  <Button
                    disabled={loading}
                    onClick={() => handleNav(item)}
                    className={`
    w-full flex items-center gap-3 px-3 py-3 rounded-xl transition cursor-pointer
    ${collapsed ? "justify-center" : "justify-start"}
    ${
      isActive
        ? "bg-white/10 text-white"
        : "text-gray-300 hover:bg-white/5 hover:text-white"
    }
  `}
                  >
                    <Icon size={20} />
                    {!collapsed && (
                      <span className="text-sm font-medium">{item.name}</span>
                    )}
                  </Button>

                  {/* 🔥 TOOLTIP (ONLY WHEN COLLAPSED + DESKTOP) */}
                  {collapsed && (
                    <div
                      className="
      hidden md:block
      absolute left-full ml-3 top-1/2 -translate-y-1/2
      bg-black text-white text-xs px-2 py-1 rounded-md
      whitespace-nowrap z-50
      opacity-0 group-hover:opacity-100
      transition
    "
                    >
                      {item.name}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* USER SECTION (RESTORED ORIGINAL STYLE) */}
        <div className="p-3">
          {(!collapsed || isMobile) && isAuthenticated && (
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-full bg-gray-600 flex items-center justify-center">
                {user?.firstName?.[0]}
                {user?.lastName?.[0]}
              </div>

              <div className="text-xs">
                <p>
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-gray-400">{user?.email}</p>
              </div>
            </div>
          )}

          {!isAuthenticated ? (
            <div className="relative group">
              <Button
                onClick={() => navigate("/login")}
                variant="primary"
                className="w-full mx-auto flex items-center justify-center py-2 cursor-pointer"
              >
                <span className="text-sm">
                  {collapsed ? <LogIn /> : "Sign in"}
                </span>
              </Button>

              {/* TOOLTIP (collapsed only, desktop) */}
              {collapsed && (
                <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition">
                  Sign in
                </div>
              )}
            </div>
          ) : (
            <div className="relative group">
              <Button
                onClick={() => logout()}
                variant="danger"
                className="w-full flex items-center justify-center py-2 cursor-pointer"
              >
                <span className="text-sm">
                  {collapsed ? <LogOut /> : "Sign out"}
                </span>
              </Button>

              {/* TOOLTIP (collapsed only, desktop) */}
              {collapsed && (
                <div className="hidden md:block absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50 opacity-0 group-hover:opacity-100 transition">
                  Sign out
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
