import toast from "react-hot-toast";
import { TriangleAlert } from "lucide-react";

export const showSuccess = (msg: string) => toast.success(msg);

export const showError = (msg: string) => toast.error(msg);

export const showWarning = (msg: string) =>
  toast(msg, {
    icon: <TriangleAlert size={18} color="orange" />,
  });
