import React from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import {
  Facebook,
  Instagram,
  Linkedin,
  Twitter,
  Mail,
  Phone,
  MapPin,
  Car,
} from "lucide-react";
import { cn } from "../lib/utils";

// Logo Component with Icon (shared with Navbar)
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

const Footer: React.FC = () => {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-background pb-12 pt-24">
      {/* Glow Effect */}
      <div className="absolute bottom-0 left-1/2 -z-10 h-[300px] w-[800px] -translate-x-1/2 rounded-full bg-accent/5 blur-[120px]" />

      <div className="container mx-auto px-4">
        {/* Newsletter / CTA Section in Footer */}
        <div className="glass relative mb-20 grid grid-cols-1 items-center gap-12 overflow-hidden rounded-[2rem] border-white/10 p-12 lg:grid-cols-2">
          <div className="relative z-10">
            <h3 className="mb-4 text-3xl font-bold text-foreground">
              Prêt à obtenir votre permis ?
            </h3>
            <p className="max-w-md font-medium text-muted-foreground">
              Rejoignez plus de 1000 élèves satisfaits et commencez votre
              formation dès aujourd'hui.
            </p>
          </div>
          <div className="relative z-10 flex flex-col gap-4 sm:flex-row lg:justify-end">
            <Button size="lg" variant="primary" asChild>
              <Link to="/preinscription">S'inscrire maintenant</Link>
            </Button>
            <Button size="lg" variant="secondary" asChild>
              <Link to="/contact">Nous contacter</Link>
            </Button>
          </div>
        </div>

        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-6">
            <Link
              to="/"
              className="block"
              aria-label="Moniteur1D - Accueil"
            >
              <Logo />
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              L'auto-école moderne qui s'adapte à votre vie. Formation premium,
              moniteurs experts et outils digitaux.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Instagram, name: "Instagram" },
                { Icon: Twitter, name: "Twitter" },
                { Icon: Facebook, name: "Facebook" },
                { Icon: Linkedin, name: "Linkedin" },
              ].map(({ Icon, name }, i) => (
                <a
                  key={i}
                  href="#"
                  className="glass flex h-10 w-10 items-center justify-center rounded-full border-white/10 transition-all hover:bg-accent/10 hover:text-accent"
                  aria-label={`Suivez-nous sur ${name}`}
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Navigation
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Accueil
                </Link>
              </li>
              <li>
                <Link
                  to="/offres"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Nos Offres
                </Link>
              </li>
              <li>
                <Link
                  to="/tarifs"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Tarifs
                </Link>
              </li>
              <li>
                <Link
                  to="/zones"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Zones d'examen
                </Link>
              </li>
              <li>
                <Link
                  to="/avis"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Avis Clients
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Légal
            </h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link
                  to="/legal/mentions-legales"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Mentions Légales
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/cgv"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  CGV
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/confidentialite"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link
                  to="/legal/cookies"
                  className="text-muted-foreground transition-colors hover:text-accent"
                >
                  Gestion des cookies
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-8 text-sm font-bold uppercase tracking-widest text-muted-foreground">
              Contact
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-center gap-3 text-muted-foreground">
                <Mail className="h-4 w-4 text-accent" />
                <a
                  href="mailto:contact@moniteur1d.fr"
                  className="transition-colors hover:text-accent"
                >
                  contact@moniteur1d.fr
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <Phone className="h-4 w-4 text-accent" />
                <a
                  href="tel:0123456789"
                  className="transition-colors hover:text-accent"
                >
                  01 23 45 67 89
                </a>
              </li>
              <li className="flex items-center gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 text-accent" />
                <span>Paris & Île-de-France</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/5 pt-8 text-xs text-muted-foreground md:flex-row">
          <p>
            &copy; {new Date().getFullYear()} Moniteur1D. Tous droits réservés.
          </p>
          <div className="flex gap-8">
            <span>Conçu avec excellence</span>
            <span>Membre du réseau E-Permis</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
