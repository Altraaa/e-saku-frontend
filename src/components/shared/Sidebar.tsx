import { useState } from "react";
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
import { Drawer, DrawerContent } from "../ui/drawer";
import { motion, AnimatePresence } from "framer-motion";
import skensalogo from "@/assets/skensa.png";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({
  open,
  onClose,
  isMobile,
}: {
  open: boolean;
  onClose: () => void;
  isMobile?: boolean;
}) => {
  const location = useLocation(); // Hook untuk mendapatkan lokasi (rute aktif)
  const [activeItem, setActiveItem] = useState(location.pathname); // Set active item berdasarkan rute saat ini

  // Sidebar menu items
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

  // Desktop Sidebar Component
  const DesktopSidebar = () => (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: 256,
            opacity: 1,
            transition: {
              type: "tween",
              duration: 0.3,
            },
          }}
          exit={{
            width: 0,
            opacity: 0,
            transition: {
              type: "tween",
              duration: 0.3,
            },
          }}
          className="fixed top-0 left-0 h-full bg-white dark:bg-background shadow-lg z-50 flex flex-col"
        >
          <div className="flex items-center px-4 py-3 space-x-3 bg-gray-100">
            <img src={skensalogo} alt="Logo" className="w-10 h-10 rounded-md" />
            <div>
              <div className="text-md font-bold text-gray-800">
                E-Saku Siswa
              </div>
              <div className="text-xs text-gray-500">SMK Negeri 1 Denpasar</div>
            </div>
          </div>

          {/* **Garis Hijau Pemisah** */}
          <div className="border-t-2 border-green-500" />
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-5 py-3 w-64 hide-scrollbar">
            {/* Platform Section */}
            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Platform
            </div>
            <ul className="space-y-1">
              {platformItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 group ${
                      activeItem === item.path
                        ? "bg-green-100 text-green-600 font-medium"
                        : "hover:bg-gray-100 hover:text-black"
                    }`}
                    onClick={() => setActiveItem(item.path)}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all duration-200 ${
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

            {/* Line Separator */}
            <div className="my-4 border-t border-gray-300" />

            {/* Account Section */}
            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Account
            </div>
            <ul className="space-y-1">
              {accountItems.map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 group ${
                      activeItem === item.path
                        ? "bg-green-100 text-green-600 font-medium"
                        : "hover:bg-gray-100 hover:text-black"
                    }`}
                    onClick={() => setActiveItem(item.path)}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all duration-200 ${
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

          {/* Log Out Button (Selalu di Bawah, Tidak Mengambang) */}
          <div className="px-5 py-3">
            <motion.div
              onClick={() => setActiveItem("Log Out")}
              className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span>Logout</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <div className="flex flex-col h-full">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto scrollbar-hide p-5">
            {/* Platform Section */}
            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Platform
            </div>
            <AnimatePresence>
              <motion.ul initial="visible" className="space-y-1">
                {platformItems.map((item, index) => (
                  <motion.li
                    key={index}
                    onClick={() => {
                      setActiveItem(item.path); // Update active item
                      onClose(); // Close the sidebar
                    }}
                    className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 group ${
                      activeItem === item.path
                        ? "bg-green-100 text-green-600 font-medium"
                        : "hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all duration-200 ${
                        activeItem === item.path
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>

            {/* Line Separator */}
            <div className="my-4 border-t border-gray-300" />

            {/* Account Section */}
            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Account
            </div>
            <AnimatePresence>
              <motion.ul initial="visible" className="space-y-1">
                {accountItems.map((item, index) => (
                  <motion.li
                    key={index}
                    onClick={() => {
                      setActiveItem(item.path); // Update active item
                      onClose(); // Close the sidebar
                    }}
                    className={`flex items-center space-x-3 cursor-pointer px-3 py-2 rounded-lg transition-all duration-200 group ${
                      activeItem === item.path
                        ? "bg-green-100 text-green-600 font-medium"
                        : "hover:bg-gray-100 hover:text-black"
                    }`}
                  >
                    <item.icon
                      className={`w-5 h-5 transition-all duration-200 ${
                        activeItem === item.path
                          ? "text-green-600"
                          : "text-gray-500"
                      }`}
                    />
                    <span>{item.label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>

          {/* Log Out Button */}
          <motion.div
            onClick={() => setActiveItem("Log Out")}
            className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg bg-white hover:bg-gray-100 hover:text-black transition-all duration-200 absolute bottom-4 left-5 right-5 shadow-md"
          >
            <LogOut className="w-5 h-5 text-gray-500 group-hover:text-black" />
            <span>Log Out</span>
          </motion.div>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};

export default Sidebar;
