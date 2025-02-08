import "./App.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Student from "./pages/Student";
import ESakuForm from "./pages/EsakuForm";
import History from "./pages/History";
import Login from "./pages/Login";

function App() {
  return (
    <TooltipProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/student" element={<Student />} />
          <Route path="/esakuform" element={<ESakuForm />} />
          <Route path="/history" element={<History />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </Router>
    </TooltipProvider>
  );
}

export default App;
