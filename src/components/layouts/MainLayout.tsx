import React, { useState, useEffect } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check for window size
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isMobile={isMobile}
      />

      {/* Main content area */}
      <div
        className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "ml-64" : "ml-0" // Only shift content when sidebar is open
        }`}
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
