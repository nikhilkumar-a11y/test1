import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppLayout } from "@/components/AppLayout";
import { Dashboard } from "@/pages/Dashboard";
import { ScanTallyPage } from "@/pages/ScanTally";
import { InscanbagPage } from "@/pages/InscanbagPage";
import { PickedByRiderPage } from "@/pages/PickedByRiderPage";
import { PlaceholderPage } from "@/pages/PlaceholderPage";

const queryClient = new QueryClient();

function Router() {
  return (
    <AppLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/scan-tally" component={ScanTallyPage} />
        <Route path="/shipments/inscan-bag" component={InscanbagPage} />
        <Route path="/shipments/picked-by-rider" component={PickedByRiderPage} />
        <Route path="/bags">
          <PlaceholderPage title="Bags" description="Initialize and manage bag inventory." />
        </Route>
        <Route path="/pickup-trips">
          <PlaceholderPage title="Pickup Trips" description="Track and manage pickup rider trips." />
        </Route>
        <Route path="/linehaul-trips">
          <PlaceholderPage title="Linehaul Trips" description="Monitor linehaul trip status across hubs." />
        </Route>
        <Route path="/reports">
          <PlaceholderPage title="Reports" description="View operational reports and analytics." />
        </Route>
        <Route>
          <PlaceholderPage title="Page Not Found" description="This page doesn't exist." />
        </Route>
      </Switch>
    </AppLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}

export default App;
