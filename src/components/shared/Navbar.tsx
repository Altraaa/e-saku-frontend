import { useState } from "react";
import { Bell, Menu } from "lucide-react";
import { Button } from "../ui/button";
import { Tooltip } from "@radix-ui/react-tooltip";
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
          className="text-gray-600 flex-shrink-0 p-2 md:p-3"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <h1 className="uppercase text-sm sm:text-lg lg:text-2xl font-bold truncate">
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
    </div>
  );
};

export default Navbar;