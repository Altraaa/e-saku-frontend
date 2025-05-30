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
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md w-full overflow-hidden">
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        <Button
          variant="ghost"
          className="text-gray-600 flex-shrink-0 p-2"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <h1 className="uppercase text-lg sm:text-xl lg:text-2xl font-bold truncate">
          {title}
        </h1>
      </div>

      <div className="flex items-center space-x-2 flex-shrink-0">
        <Tooltip>
          <Button
            variant="ghost"
            className="text-gray-600 p-2"
            onClick={() => {
              setShowNotification(!showNotification);
              onToggleNotification();
            }}
          >
            <Bell className="h-5 w-5" />
          </Button>
        </Tooltip>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showNotification ? 1 : 0 }}
        transition={{ duration: 0.5 }}
        className="fixed bottom-4 right-4 w-64 sm:w-72 p-4 bg-green-500 text-white rounded-lg shadow-lg z-50"
      >
        <div className="font-semibold text-sm sm:text-base">
          You have new notifications!
        </div>
      </motion.div>
    </div>
  );
};

export default Navbar;