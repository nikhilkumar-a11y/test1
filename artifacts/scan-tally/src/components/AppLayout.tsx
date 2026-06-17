import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Package,
  ScanLine,
  Briefcase,
  Truck,
  Route as RouteIcon,
  FileBarChart,
  ChevronDown,
  Rocket,
  Check,
  Warehouse,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { HUBS, setHub, useHub, type Hub } from "@/lib/hub-store";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  children?: { to: string; label: string }[];
};

const NAV: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  {
    to: "/shipments",
    label: "Shipments",
    icon: Package,
    children: [
      { to: "/shipments/inscan-bag", label: "Inscan · Bag" },
      { to: "/shipments/picked-by-rider", label: "Picked by Rider" },
    ],
  },
  { to: "/scan-tally", label: "Scan Tally", icon: ScanLine },
  { to: "/bags", label: "Bags", icon: Briefcase },
  { to: "/pickup-trips", label: "Pickup Trips", icon: Truck },
  { to: "/linehaul-trips", label: "Linehaul Trips", icon: RouteIcon },
  { to: "/reports", label: "Reports", icon: FileBarChart },
];

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [pathname] = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "/shipments": true,
  });
  const hub = useHub();
  const [hubOpen, setHubOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
        <div className="flex h-16 items-center gap-2 px-5 border-b border-sidebar-border">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-4 w-4" />
          </div>
          <div className="text-[15px] font-semibold tracking-tight">
            Rocket<span className="text-primary">Xpress</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 text-sm">
          {NAV.map((item) => {
            const Icon = item.icon;
            const active =
              item.to === "/"
                ? pathname === "/"
                : pathname === item.to ||
                  pathname.startsWith(item.to + "/") ||
                  (item.children?.some((c) => pathname.startsWith(c.to)) ?? false);

            if (item.children) {
              const open = openGroups[item.to] ?? active;
              return (
                <div key={item.to} className="mb-0.5">
                  <button
                    onClick={() =>
                      setOpenGroups((g) => ({ ...g, [item.to]: !open }))
                    }
                    className={cn(
                      "flex w-full items-center gap-3 rounded-md px-3 py-2 text-left font-medium transition-colors",
                      active
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-muted",
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    <ChevronDown
                      className={cn(
                        "h-3.5 w-3.5 transition-transform",
                        open && "rotate-180",
                      )}
                    />
                  </button>
                  {open && (
                    <div className="ml-7 mt-1 flex flex-col gap-0.5 border-l border-sidebar-border pl-3">
                      {item.children.map((c) => {
                        const childActive = pathname === c.to || pathname.startsWith(c.to + "/");
                        return (
                          <Link
                            key={c.to}
                            href={c.to}
                            className={cn(
                              "rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                              childActive
                                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                                : "text-sidebar-foreground hover:bg-muted",
                            )}
                          >
                            {c.label}
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <Link
                key={item.to}
                href={item.to}
                className={cn(
                  "mb-0.5 flex items-center gap-3 rounded-md px-3 py-2 font-medium transition-colors",
                  active
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Hub selector */}
        <div className="border-t border-sidebar-border p-3">
          <div className="relative">
            <button
              onClick={() => setHubOpen((v) => !v)}
              className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-medium hover:bg-muted transition-colors"
            >
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-accent">
                <Warehouse className="h-3.5 w-3.5 text-accent-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-bold text-foreground">{hub.name}</div>
                <div className="text-[11px] text-muted-foreground">{hub.kind} Hub</div>
              </div>
              <ChevronDown className={cn("h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform", hubOpen && "rotate-180")} />
            </button>
            {hubOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 rounded-xl border bg-popover shadow-lg overflow-hidden z-50">
                {HUBS.map((h) => (
                  <button
                    key={h.id}
                    onClick={() => { setHub(h); setHubOpen(false); }}
                    className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[13px] font-medium hover:bg-muted transition-colors"
                  >
                    <div className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-md", h.id === hub.id ? "bg-primary text-primary-foreground" : "bg-muted")}>
                      {h.id === hub.id ? <Check className="h-3.5 w-3.5" /> : <Warehouse className="h-3 w-3" />}
                    </div>
                    <div>
                      <div className="font-semibold leading-tight">{h.name}</div>
                      <div className="text-[11px] text-muted-foreground">{h.kind} Hub</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      <div className="flex flex-1 flex-col min-w-0">
        {/* Mobile header */}
        <header className="flex h-14 items-center gap-2 border-b bg-card px-4 md:hidden">
          <div className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Rocket className="h-3.5 w-3.5" />
          </div>
          <span className="text-[14px] font-semibold">Rocket<span className="text-primary">Xpress</span></span>
        </header>

        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
