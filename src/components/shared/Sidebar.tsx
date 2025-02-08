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
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);

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
    <AnimatePresence mode="wait">
      {open && (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: 256,
            opacity: 1,
            transition: {
              type: "spring",
              stiffness: 200,
              damping: 25,
            },
          }}
          exit={{
            width: 0,
            opacity: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 35,
            },
          }}
          className="fixed top-0 left-0 h-full bg-white dark:bg-background shadow-lg z-50 flex flex-col overflow-hidden"
        >
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 1,
              transition: {
                delay: 0.1,
                duration: 0.3
              }
            }}
            className="flex items-center p-4 space-x-3 bg-gray-100"
          >
            <img src={skensalogo} alt="Logo" className="w-10 h-10 rounded-md" />
            <div>
              <div className="text-md font-bold text-gray-800">
                E-Saku Siswa
              </div>
              <div className="text-xs text-gray-500">SMK Negeri 1 Denpasar</div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scaleX: 0 }}
            animate={{ 
              scaleX: 1,
              transition: {
                delay: 0.2,
                duration: 0.3
              }
            }}
            className="border-t-2 border-green-500"
          />

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: {
                delay: 0.3,
                duration: 0.3
              }
            }}
            className="flex-1 overflow-y-auto px-5 py-3 w-64 hide-scrollbar"
          >
            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Platform
            </div>
            <ul className="space-y-1">
              {platformItems.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    transition: {
                      delay: 0.4 + (index * 0.1),
                      duration: 0.2
                    }
                  }}
                >
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
                </motion.li>
              ))}
            </ul>

            <div className="my-4 border-t border-gray-300" />

            <div className="text-xs font-semibold mb-3 text-muted-foreground uppercase">
              Account
            </div>
            <ul className="space-y-1">
              {accountItems.map((item, index) => (
                <motion.li 
                  key={index}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    transition: {
                      delay: 0.6 + (index * 0.1),
                      duration: 0.2
                    }
                  }}
                >
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
                </motion.li>
              ))}
            </ul>
          </motion.div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ 
              y: 0, 
              opacity: 1,
              transition: {
                delay: 0.8,
                duration: 0.3
              }
            }}
            className="px-5 py-3"
          >
            <motion.div
              onClick={() => setActiveItem("Log Out")}
              className="cursor-pointer flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-100 transition-all duration-200"
            >
              <LogOut className="w-5 h-5 text-red-600" />
              <span>Logout</span>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile Sidebar Component remains the same
  const MobileSidebar = () => (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        {/* ... (rest of the mobile sidebar code remains the same) ... */}
      </DrawerContent>
    </Drawer>
  );

  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};

export default Sidebar;