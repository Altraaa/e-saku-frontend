import React, { useState, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  // State to track mobile view
  const [isMobile, setIsMobile] = useState(false);

  // State for sidebar open/close
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Effect to handle responsive design
  useEffect(() => {
    // Check screen width and set mobile state
    const checkMobileView = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);

      // On mobile, close sidebar by default
      if (mobile) {
        setSidebarOpen(false);
      } else {
        // On desktop, ensure sidebar is open
        setSidebarOpen(true);
      }
    };

    // Initial check
    checkMobileView();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobileView);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("resize", checkMobileView);
    };
  }, []);

  // Consolidated sidebar toggle handler
  const handleSidebarToggle = () => {
    // Toggle sidebar state
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar - managed by its own open/close state */}
      <Sidebar
        open={!isMobile && sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main content area - now with dynamic width based on sidebar state */}
      <div
        className={`
        flex-1 
        flex 
        flex-col 
        bg-gray-100 
        transition-all 
        duration-300 
        ease-in-out 
        ${!isMobile && !sidebarOpen ? "ml-0" : !isMobile ? "ml-64" : ""}
      `}
      >
        {/* Navbar with sidebar toggle */}
        <Navbar
          onSidebarToggle={handleSidebarToggle}
          onToggleNotification={() => {}}
        />

        {/* Main content area with padding */}
        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
