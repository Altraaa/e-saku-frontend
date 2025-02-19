import { toast } from "sonner"; // Menggunakan toast dari sonner
import { Toaster } from "./sonner"; // Toaster dari sonner
import { CheckCircle, XCircle, Info, LogIn, LogOut } from "lucide-react";
import { JSX } from "react";

// interface CustomToastProps {
//   type: "create" | "update" | "delete" | "login" | "logout";
//   message?: string;
// }

// eslint-disable-next-line react-refresh/only-export-components
export const showToast = (
  type: "create" | "update" | "delete" | "login" | "logout",
  message?: string
) => {
  let icon: JSX.Element;
  let toastMessage: string;
  let bgColor: string;
  let borderColor: string;

  switch (type) {
    case "create":
      icon = <CheckCircle className="text-green-500" />;
      toastMessage = message || "Item created successfully!";
      bgColor = "bg-green-50";
      borderColor = "border-green-500";
      break;
    case "update":
      icon = <Info className="text-blue-500" />;
      toastMessage = message || "Item updated successfully!";
      bgColor = "bg-blue-50";
      borderColor = "border-blue-500";
      break;
    case "delete":
      icon = <XCircle className="text-red-500" />;
      toastMessage = message || "Item deleted successfully!";
      bgColor = "bg-red-50";
      borderColor = "border-red-500";
      break;
    case "login":
      icon = <LogIn className="text-green-500" />;
      toastMessage = "You have successfully logged in!";
      bgColor = "bg-green-50";
      borderColor = "border-green-500";
      break;
    case "logout":
      icon = <LogOut className="text-red-500" />;
      toastMessage = "You have successfully logged out!";
      bgColor = "bg-red-50";
      borderColor = "border-red-500";
      break;
    default:
      icon = <Info className="text-gray-500" />;
      toastMessage = "Operation successful!";
      bgColor = "bg-gray-50";
      borderColor = "border-gray-500";
  }

  // Panggil toast dari sonner
  toast(
    <div
      className={`flex w-full justify-center items-center p-4 border rounded-md ${bgColor} ${borderColor}`}
    >
      {icon}
      <span className="ml-2 text-sm font-medium">{toastMessage}</span>
    </div>
  );
};

export const ToastProvider = () => {
  return <Toaster position="top-center" />;
};
