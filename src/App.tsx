import "./App.css";
import { TooltipProvider } from "./components/ui/tooltip";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Student from "./pages/Student";
import ESakuForm from "./pages/EsakuForm";
import History from "./pages/History";
import Login from "./pages/Login";
import StudentByClass from "./pages/StudentByClass";
import StudentBio from "./pages/StudentBio";
import EditStudentBio from "./pages/EditStudentBio";
import BioAccomplisments from "./pages/BioAccomplisments";
import BioViolations from "./pages/BioViolations";
import Help from "./pages/Help";
// import Settings from "./pages/Settings";
import { SidebarProvider } from "./utils/context/sidebarContext";
import MainLayout from "./components/layouts/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProtectedRoute } from "./config/Routes/ProtectedRoutes";
import TeacherProfile from "./pages/TeacherProfile";
import Rules from "./pages/Rules";
import ManageRules from "./pages/ManageRules";
import Report from "./pages/Report";
import { Toaster } from "react-hot-toast";
import StudentProfile from "./pages/ProfileStudent";
// import PrivacyPolicy from "./pages/PrivacyPolicy";

const LayoutWrapper = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[1] || "/";

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    student: "Student",
    esakuform: "E-Saku Form",
    history: "History",
    class: "Class",
    studentbio: "Student Bio",
    help: "Help",
    profilestudent: "Profile",
    profileteacher: "Teacher Profile",
    // settings: "Settings",
    rules: "Rules Of Conduct",
    privacypolicy: "Privacy Policy",
    report: "Report",
    managerules: "Manage Rules",
  };

  const title = pageTitles[path] || "Unknown Page";

  return (
    <MainLayout title={title}>
      <Outlet />
    </MainLayout>
  );
};

export function AppContent() {
  const token = localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/login"
        element={token ? <Navigate to="/" replace /> : <Login />}
      />
      <Route element={<ProtectedRoute />}>
        <Route element={<LayoutWrapper />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/student" element={<Student />} />
          <Route path="/esakuform" element={<ESakuForm />} />
          <Route path="/history" element={<History />} />
          <Route path="student/class/:id" element={<StudentByClass />} />
          <Route path="/studentbio/:id" element={<StudentBio />} />
          <Route path="/studentbio/edit/:id" element={<EditStudentBio />} />
          <Route
            path="/studentbio/accomplishments/:id"
            element={<BioAccomplisments />}
          />
          <Route
            path="/studentbio/violations/:id"
            element={<BioViolations />}
          />
          <Route path="/report" element={<Report />} />
          {/* <Route path="/settings" element={<Settings />} /> */}
          <Route path="/help" element={<Help />} />
          <Route path="/profileteacher" element={<TeacherProfile />} />
          <Route path="/profilestudent" element={<StudentProfile />} />
          <Route path="/managerules" element={<ManageRules />} />
          <Route path="/rules" element={<Rules />} />
          {/* <Route path="/privacypolicy" element={<PrivacyPolicy/>} /> */}
        </Route>
      </Route>
    </Routes>
  );
}

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SidebarProvider>
          <Router>
            <AppContent />
            <Toaster position="top-center" reverseOrder={false} />
          </Router>
        </SidebarProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
