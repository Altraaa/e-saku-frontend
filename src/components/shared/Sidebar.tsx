import { useState } from "react";
import { Home, Settings, User, Mail } from "lucide-react";
import { Drawer, DrawerContent } from "../ui/drawer";
import { motion, AnimatePresence } from "framer-motion";

const Sidebar = ({
  open,
  onClose,
  isMobile,
}: {
  open: boolean;
  onClose: () => void;
  isMobile?: boolean;
}) => {
  // Active menu state
  const [activeItem, setActiveItem] = useState("Home");

  // Sidebar menu items
  const menuItems = [
    { icon: Home, label: "Home" },
    { icon: Settings, label: "Settings" },
    { icon: User, label: "Profile" },
    { icon: Mail, label: "Messages" },
  ];

  // Handle menu item click
  const handleItemClick = (label: string) => {
    setActiveItem(label);
    // Add any additional navigation logic here
  };

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
          className="fixed top-0 left-0 h-full bg-white dark:bg-background shadow-lg overflow-hidden z-50"
        >
          <div className="p-4 w-64">
            <div className="text-xl font-bold mb-6 text-foreground">
              Dashboard
            </div>
            <AnimatePresence>
              <motion.ul initial="visible" className="space-y-4">
                {menuItems.map((item, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 1, x: 0 }}
                    exit={{
                      opacity: 0,
                      x: -20,
                      transition: {
                        duration: 0.2,
                        delay: (menuItems.length - index - 1) * 0.05,
                      },
                    }}
                    onClick={() => handleItemClick(item.label)}
                    className={`
                      flex 
                      items-center 
                      space-x-2 
                      cursor-pointer 
                      p-2 
                      rounded-md 
                      transition-colors 
                      duration-200 
                      group
                      ${
                        activeItem === item.label
                          ? "bg-primary/10 text-primary"
                          : "hover:bg-accent hover:text-accent-foreground"
                      }
                    `}
                  >
                    <item.icon
                      className={`
                        w-5 
                        h-5 
                        transition-colors 
                        duration-200 
                        ${
                          activeItem === item.label
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-accent-foreground"
                        }
                      `}
                    />
                    <span>{item.label}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  // Mobile Sidebar Component
  const MobileSidebar = () => (
    <Drawer open={open} onClose={onClose}>
      <DrawerContent>
        <div className="p-4">
          <div className="text-xl font-bold mb-6 text-foreground">
            Dashboard
          </div>
          <AnimatePresence>
            <motion.ul initial="visible" className="space-y-4">
              {menuItems.map((item, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 1, x: 0 }}
                  exit={{
                    opacity: 0,
                    x: -20,
                    transition: {
                      duration: 0.2,
                      delay: (menuItems.length - index - 1) * 0.05,
                    },
                  }}
                  onClick={() => {
                    handleItemClick(item.label);
                    onClose();
                  }}
                  className={`
                    flex 
                    items-center 
                    space-x-2 
                    cursor-pointer 
                    p-2 
                    rounded-md 
                    transition-colors 
                    duration-200 
                    group
                    ${
                      activeItem === item.label
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-accent hover:text-accent-foreground"
                    }
                  `}
                >
                  <item.icon
                    className={`
                      w-5 
                      h-5 
                      transition-colors 
                      duration-200 
                      ${
                        activeItem === item.label
                          ? "text-primary"
                          : "text-muted-foreground group-hover:text-accent-foreground"
                      }
                    `}
                  />
                  <span>{item.label}</span>
                </motion.li>
              ))}
            </motion.ul>
          </AnimatePresence>
        </div>
      </DrawerContent>
    </Drawer>
  );

  // Render appropriate sidebar based on device type
  return isMobile ? <MobileSidebar /> : <DesktopSidebar />;
};

export default Sidebar;
