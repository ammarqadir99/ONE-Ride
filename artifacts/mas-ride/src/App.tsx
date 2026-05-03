import { Switch, Route, Router as WouterRouter, Redirect } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useStore } from "@/store";
import LoginPage from "@/pages/login";
import RegisterPage from "@/pages/register";
import VerifyOtpPage from "@/pages/verify-otp";
import RegisterProfilePage from "@/pages/register-profile";
import HomePage from "@/pages/home";
import CarpoolPage from "@/pages/carpool";
import CarpoolDetailPage from "@/pages/carpool-detail";
import PublishPage from "@/pages/publish";
import ProfilePage from "@/pages/profile";
import ChatPage from "@/pages/chat";
import MyRidesPage from "@/pages/my-rides";
import NotificationsPage from "@/pages/notifications";
import PersonalInfoPage from "@/pages/personal-info";
import WalletPage from "@/pages/wallet";
import AddressPage from "@/pages/address";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient();

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const currentUser = useStore((s) => s.currentUser);
  if (!currentUser) return <Redirect to="/login" />;
  return <Component />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Redirect to="/login" />} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/verify-otp" component={VerifyOtpPage} />
      <Route path="/register/profile" component={RegisterProfilePage} />
      <Route path="/home" component={() => <ProtectedRoute component={HomePage} />} />
      <Route path="/carpool" component={() => <ProtectedRoute component={CarpoolPage} />} />
      <Route path="/carpool/:id" component={() => <ProtectedRoute component={CarpoolDetailPage} />} />
      <Route path="/publish" component={() => <ProtectedRoute component={PublishPage} />} />
      <Route path="/profile" component={() => <ProtectedRoute component={ProfilePage} />} />
      <Route path="/profile/edit" component={() => <ProtectedRoute component={PersonalInfoPage} />} />
      <Route path="/wallet" component={() => <ProtectedRoute component={WalletPage} />} />
      <Route path="/profile/address" component={() => <ProtectedRoute component={AddressPage} />} />
      <Route path="/chat" component={() => <ProtectedRoute component={ChatPage} />} />
      <Route path="/my-rides" component={() => <ProtectedRoute component={MyRidesPage} />} />
      <Route path="/notifications" component={() => <ProtectedRoute component={NotificationsPage} />} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
