import { useState } from "react";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Tooltip } from "@radix-ui/react-tooltip";
import { motion } from "motion/react";

const Navbar = ({
  onToggleNotification,
  onSidebarToggle,
}: {
  onToggleNotification: () => void;
  onSidebarToggle: () => void;
}) => {
  const [showNotification, setShowNotification] = useState(false);

  // Consolidated toggle handler
  const handleSidebarToggle = () => {
    onSidebarToggle(); // Call the parent's sidebar toggle function
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white shadow-md">
      <div className="flex items-center space-x-4">
        {/* Sidebar Toggle Button */}
        <Button
          variant="ghost"
          className="text-gray-600"
          onClick={handleSidebarToggle} // Use the consolidated handler
        >
          <Menu />
        </Button>

        <Button variant="ghost" className="text-gray-600" onClick={() => {}}>
          <Search />
        </Button>
        <Input placeholder="Search..." className="hidden sm:block w-1/3" />
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
