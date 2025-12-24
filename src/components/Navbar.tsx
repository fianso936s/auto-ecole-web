import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
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
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 shadow-sm backdrop-blur-md transition-all duration-300"
      aria-label="Navigation principale"
    >
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center space-x-2"
          aria-label="Moniteur1D - Accueil"
        >
          <span className="font-display text-2xl font-black tracking-tight text-foreground">
            Moniteur
            <span className="text-primary transition-colors group-hover:text-primary/80">
              1D
            </span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "group relative py-2 text-sm font-semibold transition-all hover:text-primary",
                isActive(link.href) ? "text-primary" : "text-foreground/70"
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

        {/* Desktop CTAs & Theme Toggle */}
        <div className="hidden lg:flex lg:items-center lg:space-x-4">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="secondary" size="sm" asChild>
                <Link to={getDashboardLink() || "/"}>Mon espace</Link>
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </>
          ) : (
            <>
              <Button variant="tertiary" size="sm" asChild>
                <Link to="/tarifs#simulateur">Simuler mon prix</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
              <Button variant="primary" size="sm" asChild>
                <Link to="/preinscription">S'inscrire maintenant</Link>
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
                <SheetTitle className="font-display text-2xl font-black">
                  Moniteur<span className="text-primary">1D</span>
                </SheetTitle>
              </SheetHeader>

              <nav
                className="flex flex-col space-y-4"
                aria-label="Navigation mobile"
              >
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    aria-current={isActive(link.href) ? "page" : undefined}
                    className={cn(
                      "border-b border-border/10 py-2 text-lg font-medium transition-colors",
                      isActive(link.href)
                        ? "text-accent"
                        : "text-muted-foreground hover:text-accent"
                    )}
                  >
                    {link.name}
                  </Link>
                ))}
              </nav>

              <div className="mt-auto flex flex-col space-y-4 pt-6">
                {user ? (
                  <>
                    <Button
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to={getDashboardLink() || "/"}>Mon espace</Link>
                    </Button>
                    <Button
                      variant="outline"
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
                      variant="secondary"
                      size="lg"
                      className="w-full"
                      asChild
                      onClick={() => setIsOpen(false)}
                    >
                      <Link to="/tarifs#simulateur">Simuler mon prix</Link>
                    </Button>
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
                      <Link to="/preinscription">S'inscrire maintenant</Link>
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
