import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/HomePage";
import AdminPanelPage from "@/pages/AdminPanelPage";
import DepartmentSelectionPage from "@/pages/DepartmentSelectionPage";
import DepartmentDetailsPage from "@/pages/DepartmentDetailsPage";
import ApplicationFormPage from "@/pages/ApplicationFormPage";
import ConfirmationPage from "@/pages/ConfirmationPage";
import StarBackground from "@/components/StarBackground";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/admin" component={AdminPanelPage} />
      <Route path="/departments" component={DepartmentSelectionPage} />
      <Route path="/departments/:departmentId" component={DepartmentDetailsPage} />
      <Route path="/apply/:departmentId?" component={ApplicationFormPage} />
      <Route path="/confirmation" component={ConfirmationPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-black text-white relative overflow-hidden">
        <StarBackground />
        <div className="relative z-10">
          <Router />
        </div>
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
