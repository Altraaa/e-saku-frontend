import "./App.css";
import { TooltipProvider } from "./components/ui/tooltip";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
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
import ProfileStudent from "./pages/ProfileStudent";
import { SidebarProvider } from "./utils/context/sidebarContext";
import MainLayout from "./components/layouts/MainLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const AppContent = () => {
  const location = useLocation();

  const pageTitles: Record<string, string> = {
    "/": "Dashboard",
    "/student": "Student",
    "/esakuform": "E-Saku Form",
    "/history": "History",
    "/class": "Class",
    "/studentbio": "Student Bio",
    "/studentbio/edit": "Edit Student Bio",
    "/studentbio/accomplishments": "Accomplishments Student",
    "/studentbio/violations": "Violations Student",
    "/help": "Help",
    "/profile": "Profile",
  };

  const title = pageTitles[location.pathname] || "Unknown Page";

  return (
    <MainLayout title={title}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/student" element={<Student />} />
        <Route path="/esakuform" element={<ESakuForm />} />
        <Route path="/history" element={<History />} />
        <Route path="/login" element={<Login />} />
        <Route path="/class" element={<StudentByClass />} />
        <Route path="/studentbio" element={<StudentBio />} />
        <Route path="/studentbio/edit" element={<EditStudentBio />} />
        <Route
          path="/studentbio/accomplishments"
          element={<BioAccomplisments />}
        />
        <Route path="/studentbio/violations" element={<BioViolations />} />
        <Route path="/help" element={<Help />} />
        <Route path="/profile" element={<ProfileStudent />} />
      </Routes>
    </MainLayout>
  );
};

function App() {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <Router>
          <AppContent />
        </Router>
      </SidebarProvider>
    </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
