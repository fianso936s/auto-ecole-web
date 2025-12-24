import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Car } from "lucide-react";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import ThemeToggle from "./ThemeToggle";
import { cn } from "../lib/utils";
import { useMe } from "../hooks/useMe";
import { logout } from "../lib/api";
import { toast } from "sonner";

const navLinks = [
  { name: "Offres", href: "/offres" },
  { name: "Tarifs", href: "/tarifs" },
  { name: "Financement", href: "/financement" },
  { name: "Avis", href: "/avis" },
  { name: "Zones", href: "/zones" },
  { name: "Contact", href: "/contact" },
];

// Logo Component with Icon
const Logo = ({ className = "" }: { className?: string }) => (
  <div className={cn("flex items-center gap-2", className)}>
    <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-elevation-1">
      <Car className="h-5 w-5 text-primary-foreground" strokeWidth={2.5} />
      <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-background bg-accent-warm" />
    </div>
    <span className="font-display text-xl font-black tracking-tight text-foreground">
      Moniteur<span className="text-primary">1D</span>
    </span>
  </div>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading } = useMe();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Déconnexion réussie");
      navigate("/");
      window.location.reload();
    } catch (error: any) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const getDashboardLink = () => {
    if (!user) return null;
    switch (user.role) {
      case "ADMIN":
        return "/admin";
      case "INSTRUCTOR":
        return "/coach";
      case "STUDENT":
        return "/app";
      default:
        return null;
    }
  };

  return (
    <nav
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 shadow-elevation-1 backdrop-blur-lg transition-all duration-300"
      aria-label="Navigation principale"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="group"
          aria-label="Moniteur1D - Accueil"
        >
          <Logo className="transition-transform duration-200 group-hover:scale-[1.02]" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "group relative py-2 text-sm font-semibold transition-all hover:text-primary",
                isActive(link.href) ? "text-primary" : "text-muted-foreground"
              )}
            >
              {link.name}
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-0.5 w-full origin-left bg-primary transition-transform duration-300",
                  isActive(link.href)
                    ? "scale-x-100"
                    : "scale-x-0 group-hover:scale-x-100"
                )}
              />
            </Link>
          ))}
        </div>

        {/* Desktop CTAs & Theme Toggle - Simplified to 2 CTAs max */}
        <div className="hidden lg:flex lg:items-center lg:space-x-3">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="outline" size="sm" asChild>
                <Link to={getDashboardLink() || "/"}>Mon espace</Link>
              </Button>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link to="/preinscription">S'inscrire</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation (Burger Menu) */}
        <div className="flex items-center space-x-2 lg:hidden">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 border border-border/50 hover:bg-primary/10"
              >
                <Menu className="h-6 w-6 text-foreground" />
                <span className="sr-only">Menu toggle</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="flex h-full w-full flex-col border-l border-border/40 bg-background/95 p-6 backdrop-blur-xl sm:max-w-xs"
            >
              <SheetHeader className="mb-8 text-left">
                <Logo />
              </SheetHeader>

              <nav
                className="flex flex-col space-y-2"
                aria-label="Navigation mobile"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "rounded-lg px-3 py-3 text-base font-medium transition-all",
                      isActive(link.href)
                        ? "bg-primary/10 text-primary"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col space-y-3 border-t border-border/50 pt-6">
                {user ? (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to={getDashboardLink() || "/"}>Mon espace</Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                    >
                      Déconnexion
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/login">Connexion</Link>
                    </Button>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/preinscription">S'inscrire</Link>
                    </Button>
                  </>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
