import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import { useAuth } from "../context/ApiContext";
import FullScreenLoader from "../components/ScreenLoader";
import Button from "../ui/Button";

export default function Layout() {
  const { loading } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="h-screen flex bg-(--bg) overflow-hidden">

      {/* SIDEBAR */}
      <Sidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto no-scrollbar">

        {/* HASHNODE-STYLE TOP BAR (mobile only) */}
        <div className="md:hidden h-14 flex items-center gap-3 px-4 border-b border-white/10 bg-(--bg)">

          <Button
            onClick={() => setMobileOpen(true)}
            className="p-2 hover:bg-white/10 rounded-lg cursor-pointer"
          >
            <Menu size={22} />
          </Button>

          <h1 className="text-lg font-bold">
            Quick<span className="text-blue-500">Blog</span>
          </h1>
        </div>

        <Outlet />

        {loading && <FullScreenLoader text="Loading.." />}
      </main>
    </div>
  );
}