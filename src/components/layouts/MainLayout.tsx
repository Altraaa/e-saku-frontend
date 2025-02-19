import { useEffect, useState } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import { useSidebar } from "@/context/sidebarContext";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const { isOpen } = useSidebar(); // Menggunakan useSidebar
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen">
      <Sidebar isMobile={isMobile} />

      <div
        className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <Navbar onToggleNotification={() => {}} />
        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
