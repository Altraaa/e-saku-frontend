import "./App.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Student from "./pages/Student";
import ESakuForm from "./pages/EsakuForm";
import History from "./pages/History";
import Login from "./pages/Login";
import StudentByClass from "./pages/StudentByClass";
import StudentBio from "./pages/StudentBio";
import BioAccomplisments from "./pages/BioAccomplisments"; 
import BioViolations from "./pages/BioViolations"; 
import { SidebarProvider } from "./context/sidebarContext";
import MainLayout from "./components/layouts/MainLayout";

function App() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/student" element={<Student />} />
              <Route path="/esakuform" element={<ESakuForm />} />
              <Route path="/history" element={<History />} />
              <Route path="/login" element={<Login />} />
              <Route path="/class" element={<StudentByClass />} />
              <Route path="/studentbio" element={<StudentBio />} />
              <Route path="/studentbio/accomplishments" element={<BioAccomplisments />} />
              <Route path="/studentbio/violations" element={<BioViolations />} />
            </Routes>
          </MainLayout>
        </Router>
      </SidebarProvider>
    </TooltipProvider>
  );
}

export default App;
