import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { motion } from "framer-motion";
export function Layout() {
  const activeLinkClass = "text-primary font-semibold";
  const inactiveLinkClass = "text-muted-foreground hover:text-primary transition-colors duration-200";
  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold font-display text-primary">Aurore</h1>
          </div>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavLink
              to="/"
              className={({ isActive }) => cn(isActive ? activeLinkClass : inactiveLinkClass)}
            >
              Service du Jour
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) => cn(isActive ? activeLinkClass : inactiveLinkClass)}
            >
              Historique
            </NavLink>
          </nav>
        </div>
      </header>
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="container mx-auto max-w-7xl p-4 md:p-8"
      >
        <Outlet />
      </motion.main>
      <footer className="py-8 text-center text-muted-foreground/80 no-print">
        <p>Built with ❤️ at Cloudflare</p>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
  );
}