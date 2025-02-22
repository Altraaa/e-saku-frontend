import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip } from "@radix-ui/react-tooltip";
import { motion } from "motion/react";
import { useSidebar } from "@/utils/context/sidebarContext";

const Navbar = ({
  onToggleNotification,
  title,
}: {
  onToggleNotification: () => void;
  title?: string;
}) => {
  const [showNotification, setShowNotification] = useState(false);
  const { toggleSidebar } = useSidebar(); // Menggunakan useSidebar

  return (
    <div className="flex items-center justify-between p-[18px] bg-white shadow-md">
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          className="text-gray-600"
          onClick={toggleSidebar}
        >
          <Menu />
        </Button>
        <h1 className="uppercase text-2xl font-bold">{title}</h1>
      </div>

      <div className="flex items-center space-x-4">
        <Tooltip>
          <Button
            variant="ghost"
            className="text-gray-600"
            onClick={() => {
              setShowNotification(!showNotification);
              onToggleNotification();
            }}
          >
            <Bell />
          </Button>
        </Tooltip>
      </div>

      {/* Notification Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showNotification ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 right-4 w-72 p-4 bg-green-500 text-white rounded-lg shadow-lg"
      >
        <div className="font-semibold">You have new notifications!</div>
      </motion.div>
    </div>
  );
};

export default Navbar;
