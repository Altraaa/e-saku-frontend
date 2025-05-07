import { useState, useEffect } from "react";
import {
  Home,
  Settings,
  User,
  FileText,
  History,
  LogOut,
  Users,
  CircleHelp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import skensalogo from "@/assets/skensa.png";
import { Link, useLocation } from "react-router-dom";
import { useSidebar } from "@/utils/context/sidebarContext";
import { Sheet, SheetContent } from "../ui/sheet";
import { useLogout } from "@/config/Api/useAuth";
import ConfirmationModal from "../ui/confirmation";

const Sidebar = ({ isMobile }: { isMobile?: boolean }) => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const { isOpen, toggleSidebar } = useSidebar();

  const { logout } = useLogout();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

  const confirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
  };

  useEffect(() => {
    if (activeItem !== location.pathname) {
      setActiveItem(location.pathname);
    }
  }, [location.pathname]);

  const handleCloseSidebar = (e: React.MouseEvent) => {
    if (isMobile && isOpen) {
      e.stopPropagation();
      toggleSidebar();
    }
  };

  const platformItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "Student", icon: Users, path: "/student" },
    { label: "E-saku Form", icon: FileText, path: "/esakuform" },
    { label: "History", icon: History, path: "/history" },
  ];

  const accountItems = [
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "Profile", icon: User, path: "/profile" },
    { label: "Help", icon: CircleHelp, path: "/help" },
  ];

  const SidebarContent = (
    <motion.div
      initial={{ x: -256 }}
      animate={{
        x: 0,
        transition: { type: "spring", stiffness: 250, damping: 25 },
      }}
      exit={{
        x: -256,
        transition: { type: "spring", stiffness: 200, damping: 20 },
      }}
      className="fixed top-0 left-0 h-screen bg-white dark:bg-background shadow-lg z-50 flex flex-col overflow-hidden"
    >
      <div className="flex items-center p-4 space-x-3 bg-gray-100">
        <img src={skensalogo} alt="Logo" className="w-10 h-10 rounded-md" />
        <div>
          <div className="text-md font-bold text-gray-800">E-Saku Siswa</div>
          <div className="text-xs text-gray-500">SMK Negeri 1 Denpasar</div>
        </div>
      </div>
      <div className="border-t-2 border-green-500" />
      <div className="flex-1 overflow-y-auto px-5 py-3 w-64 hide-scrollbar">
        <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
          Platform
        </div>
        <ul className="space-y-1">
          {platformItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  activeItem === item.path
                    ? "bg-green-100 text-green-600 font-medium"
                    : "hover:bg-gray-100 hover:text-black"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeItem === item.path
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="my-4 border-t border-gray-300" />
        <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
          Account
        </div>
        <ul className="space-y-1">
          {accountItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  activeItem === item.path
                    ? "bg-green-100 text-green-600 font-medium"
                    : "hover:bg-gray-100 hover:text-black"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 ${
                    activeItem === item.path
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-5 py-3">
        <div
          onClick={() => setLogoutModalOpen(true)}
          className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-red-600" />
          <span>Logout</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={handleCloseSidebar}
        />
      )}
      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        onConfirm={confirmLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out?"
        confirmText="Yes"
        type="logout"
      />
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
          <SheetContent>{SidebarContent}</SheetContent>
        </Sheet>
      ) : (
        <AnimatePresence>{isOpen && SidebarContent}</AnimatePresence>
      )}
    </>
  );
};

export default Sidebar;
