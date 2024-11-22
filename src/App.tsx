import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "@/pages/Index";
import Auth from "@/pages/Auth";
import Documents from "@/pages/Documents";
import Tax from "@/pages/Tax";
import Audit from "@/pages/Audit";
import AuditDetail from "@/pages/AuditDetail";
import Revenue from "@/pages/Revenue";
import WriteOffs from "@/pages/WriteOffs";
import BalanceSheet from "@/pages/BalanceSheet";
import Forecast from "@/pages/Forecast";
import Assurance from "@/pages/Assurance";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/tax" element={<Tax />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/audit/:id" element={<AuditDetail />} />
            <Route path="/revenue" element={<Revenue />} />
            <Route path="/write-offs" element={<WriteOffs />} />
            <Route path="/balance-sheet" element={<BalanceSheet />} />
            <Route path="/forecast" element={<Forecast />} />
            <Route path="/assurance" element={<Assurance />} />
          </Routes>
          <Toaster />
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
