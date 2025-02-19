import { toast } from "sonner"; // Menggunakan toast dari sonner
import { Toaster } from "./sonner"; // Toaster dari sonner
import { CheckCircle, XCircle, Info, AlertTriangle } from "lucide-react";

interface CustomToastProps {
  type: "success" | "error" | "warning" | "info";
  title: string;
  message: string;
}

export const CustomToast = ({ type, title, message }: CustomToastProps) => {
  const toastStyles = {
    success: {
      icon: <CheckCircle className="text-green-600" />,
      bgColor: "bg-green-50",
      borderColor: "border-green-500",
      iconBg: "bg-green-200",
    },
    error: {
      icon: <XCircle className="text-red-600" />,
      bgColor: "bg-red-50",
      borderColor: "border-red-500",
      iconBg: "bg-red-200",
    },
    warning: {
      icon: <AlertTriangle className="text-yellow-600" />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-500",
      iconBg: "bg-yellow-200",
    },
    info: {
      icon: <Info className="text-blue-600" />,
      bgColor: "bg-blue-50",
      borderColor: "border-blue-500",
      iconBg: "bg-blue-200",
    },
  };

  const { icon, bgColor, borderColor, iconBg } = toastStyles[type];

  toast(
    <div
      className={`flex w-full items-center gap-3 p-4 rounded-lg border ${bgColor} ${borderColor}`}
    >
      <div
        className={`w-10 h-10 flex items-center justify-center rounded-full ${iconBg}`}
      >
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="font-semibold text-gray-900">{title}</span>
        <span className="text-gray-600 text-sm">{message}</span>
      </div>
    </div>
  );
};

export const ToastProvider = () => {
  return <Toaster position="top-center" />; // Hanya menggunakan Toaster dari sonner
};
