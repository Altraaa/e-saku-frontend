import { useEffect, useState } from "react";
import {
  Home,
  DiamondMinusIcon,
  Settings,
  User,
  FileText,
  History,
  LogOut,
  Users,
  CircleHelp,
  MessageSquareWarning,
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
  const activeItem = location.pathname;
  const { isOpen, toggleSidebar, closeSidebar } = useSidebar();

  const { mutate: logout } = useLogout();
  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  const isMobileScreen = windowWidth < 768;

  const confirmLogout = () => {
    logout();
    setLogoutModalOpen(false);
  };

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCloseSidebar = (e: React.MouseEvent) => {
    if ((isMobile || isMobileScreen) && isOpen) {
      e.stopPropagation();
      toggleSidebar();
    }
  };

  const handleMenuItemClick = () => {
    if (isMobile || isMobileScreen) {
      closeSidebar();
    }
  };

  const platformItems = [
    { label: "Dashboard", icon: Home, path: "/" },
    { label: "Student", icon: Users, path: "/student" },
    { label: "E-saku Form", icon: FileText, path: "/esakuform" },
    { label: "History", icon: History, path: "/history" },
    { label: "Rules", icon: DiamondMinusIcon, path: "/rules" },
    { label: "Report", icon: MessageSquareWarning, path: "/report" },
  ];

  const accountItems = [
    { label: "Settings", icon: Settings, path: "/settings" },
    { label: "Help", icon: CircleHelp, path: "/help" },
  ];

  const teacherProfile = [
    { label: "Profile", icon: User, path: "/profileteacher" },
  ];

  const studentProfile = [
    { label: "Profile", icon: User, path: "/profile" },
  ];

  const isActivePath = (currentPath: string, itemPath: string): boolean => {
    const matchPatterns: Record<string, RegExp[]> = {
      "/student": [
        /^\/student$/,
        /^\/student\/class(\/.*)?$/,
        /^\/studentbio(\/.*)?$/,
      ],
      "/": [/^\/$/],
      "/esakuform": [/^\/esakuform$/],
      "/history": [/^\/history$/],
      "/rules": [/^\/rules$/],
    };

    const patterns = matchPatterns[itemPath];
    if (!patterns) return currentPath === itemPath;

    return patterns.some((regex) => regex.test(currentPath));
  };

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
        <img
          src={skensalogo}
          alt="Logo"
          className="w-10 h-10 rounded-md flex-shrink-0"
        />
        <div className="min-w-0 flex-1">
          <div className="text-md font-bold text-gray-800 truncate">
            E-Saku Siswa
          </div>
          <div className="text-xs text-gray-500 truncate">
            SMK Negeri 1 Denpasar
          </div>
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
                onClick={handleMenuItemClick}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  isActivePath(activeItem, item.path)
                    ? "bg-green-100 text-green-600 font-medium"
                    : "hover:bg-gray-100 hover:text-black"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    isActivePath(activeItem, item.path)
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="my-4 border-t border-gray-300" />
        <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
          Tools
        </div>
        <ul className="space-y-1">
          {accountItems.map((item, index) => (
            <li key={index}>
              <Link
                to={item.path}
                onClick={handleMenuItemClick}
                className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                  activeItem === item.path
                    ? "bg-green-100 text-green-600 font-medium"
                    : "hover:bg-gray-100 hover:text-black"
                }`}
              >
                <item.icon
                  className={`w-5 h-5 flex-shrink-0 ${
                    activeItem === item.path
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                />
                <span className="truncate">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        {/* Conditionally Render Teacher or Student Profile */}
        {localStorage.getItem("teacher_id") && (
          <>
            <div className="my-4 border-t border-gray-300" />
            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Account
            </div>
            <ul className="space-y-1 mt-4">
              {teacherProfile.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={handleMenuItemClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      activeItem === item.path
                        ? "bg-green-100 text-green-600 font-medium"
                        : "hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        activeItem === item.path
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}

        {localStorage.getItem("student_id") && (
          <>
            <div className="my-4 border-t border-gray-300" />
            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Account
            </div>
            <ul className="space-y-1">
              {studentProfile.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    onClick={handleMenuItemClick}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      activeItem === item.path
                        ? "bg-green-100 text-green-600 font-medium"
                        : "hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 flex-shrink-0 ${
                        activeItem === item.path
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <div className="px-5 py-3">
        <div
          onClick={() => setLogoutModalOpen(true)}
          className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-200"
        >
          <LogOut className="w-5 h-5 text-red-600 flex-shrink-0" />
          <span className="truncate">Logout</span>
        </div>
      </div>
    </motion.div>
  );

  return (
    <>
      {(isMobile || isMobileScreen) && isOpen && (
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

      {(isMobile || isMobileScreen) ? (
        <Sheet open={isOpen} onOpenChange={toggleSidebar}>
          <SheetContent side="left" className="p-0 w-64">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      ) : (
        <AnimatePresence>{isOpen && SidebarContent}</AnimatePresence>
      )}
    </>
  );
};

export default Sidebar;
