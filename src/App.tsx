import "./App.css";
import MainLayout from "./components/layouts/MainLayout";
import { Button } from "./components/ui/button";
import { TooltipProvider } from "./components/ui/tooltip";

function App() {
  return (
    <TooltipProvider>
    <MainLayout>
      <h1 className="text-3xl font-semibold">Welcome to the Dashboard!</h1>
      <p className="mt-4 text-lg">
        This is your main content area. You can add whatever you like here.
      </p>
      <Button>Click me</Button>
    </MainLayout>
    </TooltipProvider>
  );
}

export default App;
