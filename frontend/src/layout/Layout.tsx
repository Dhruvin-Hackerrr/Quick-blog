import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/ApiContext";
import FullScreenLoader from "../components/ScreenLoader";

export default function DashboardLayout() {
  const {loading} = useAuth()
  return (
    <div className="h-screen overflow-hidden bg-(--bg) flex">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-y-scroll no-scrollbar w-full">
        <Outlet />
        {loading && <FullScreenLoader text="Loading.." />}
      </main>
    </div>
  );
}