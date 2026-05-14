import { LayoutDashboard, PenSquare, FileText } from "lucide-react";
import { useAuth } from "../context/ApiContext";
import Button from "../ui/Button";
import { useLocation, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menu = [
    {
      name: user ? "Dashboard" : "Home",
      icon: LayoutDashboard,
      path: "/",
    },
    {
      name: "Write",
      icon: PenSquare,
      path: "/post",
    },
    {
      name: "Articles",
      icon: FileText,
      path: "/post/all",
    },
  ];

  return (
    <aside className="w-65 border-r border-white/10 bg-[#11131a] text-white flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-white/10">
        <h1 className="text-2xl font-bold tracking-tight">
          Quick<span className="text-blue-500">Blog</span>
        </h1>
      </div>

      {/* Menu */}
      <div className="flex-1 py-6 px-3">
        <div className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition cursor-pointer
                  ${
                    isActive
                      ? " bg-white/10 text-white"
                      : "border-transparent text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-sm font-medium">{item.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* User */}
      <div className="border-t border-white/10 p-4">
        {isAuthenticated ? (
          <>
            {/* Profile Section */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white">
                {user?.firstName?.[0]?.toUpperCase() ?? ""}
                {user?.lastName?.[0]?.toUpperCase() ?? ""}
              </div>

              <div>
                <p className="text-sm font-medium">
                  {user?.firstName ?? ""} {user?.lastName ?? ""}
                </p>
                <p className="text-xs text-gray-400">{user?.email ?? ""}</p>
              </div>
            </div>

            {/* Sign out button */}
            <Button
              label="Sign out"
              className="mt-6 w-full text-sm text-red-400 hover:text-red-300 p-2 text-center cursor-pointer border"
              onClick={() => logout()}
            />
          </>
        ) : (
          <>
            {/* Guest state */}
            <Button
              label="Sign in"
              className="w-full text-sm text-blue-400 hover:text-blue-300 text-center p-2 cursor-pointer border"
              onClick={() => navigate("/login")}
            />
          </>
        )}
      </div>
    </aside>
  );
}
