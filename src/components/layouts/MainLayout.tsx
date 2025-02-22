import { useState } from "react";
import Sidebar from "../shared/Sidebar";
import Navbar from "../shared/Navbar";
import { useSidebar } from "@/utils/context/sidebarContext";

const MainLayout = ({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) => {
  const { isOpen } = useSidebar(); // Menggunakan useSidebar
  const [isMobile] = useState(false);

  return (
    <div className="relative flex min-h-screen">
      <Sidebar isMobile={isMobile} />

      {/* Overlay untuk mencegah interaksi saat sidebar terbuka */}
      {isMobile && isOpen && <div className="fixed inset-0 bg-black/50 z-40" />}

      <div
        className={`flex-1 flex flex-col bg-gray-100 transition-all duration-300 ${
          isOpen && !isMobile ? "md:ml-64" : "ml-0"
        }`}
      >
        <Navbar onToggleNotification={() => {}} title={title} />
        <div className="p-6 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default MainLayout;
