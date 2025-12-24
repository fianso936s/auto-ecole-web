import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Check, Calculator, Info, TrendingDown, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "../components/ui/ScrollAnimation";
import { OFFRES as MOCK_OFFRES } from "../data/mockData";
import { getOffers } from "../lib/api";

const Tarifs: React.FC = () => {
  const [hours, setHours] = useState<number>(20);
  const [hasCode, setHasCode] = useState<boolean>(false);
  const [isAccelerated, setIsAccelerated] = useState<boolean>(false);
  const [total, setTotal] = useState<number>(0);
  const [offres, setOffres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const HOUR_PRICE = 55;
  const CODE_PRICE = 150;
  const ACCELERATED_FEE = 300;
  const ADMIN_FEE = 80;

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const data = await getOffers();
        const combined = data.map((apiOffre: any) => {
          const mock = MOCK_OFFRES.find(
            (m) => m.id === apiOffre.slug || m.title === apiOffre.name
          );
          return {
            ...apiOffre,
            title: apiOffre.name,
            highlight: mock?.highlight || false,
            priceDetail: mock?.priceDetail || "",
            displayPrice:
              typeof apiOffre.price === "number"
                ? `${apiOffre.price}€`
                : apiOffre.price,
          };
        });
        setOffres(combined.length > 0 ? combined : MOCK_OFFRES);
      } catch (error) {
        console.error("Erreur lors de la récupération des offres:", error);
        setOffres(MOCK_OFFRES);
      } finally {
        setLoading(false);
      }
    };

    fetchOffres();
  }, []);

  useEffect(() => {
    let price = hours * HOUR_PRICE + ADMIN_FEE;
    if (!hasCode) price += CODE_PRICE;
    if (isAccelerated) price += ACCELERATED_FEE;
    setTotal(price);
  }, [hours, hasCode, isAccelerated]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 pb-20 pt-32">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-main)] px-4 pb-20 pt-32">
      <div className="container mx-auto">
        <ScrollAnimation className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Nos <span className="text-primary">Tarifs</span> Transparents
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Pas de frais cachés. Nous croyons en une tarification claire et
            juste pour tous nos élèves.
          </p>
        </ScrollAnimation>

        {/* Section Packs Recap */}
        <ScrollAnimation className="mb-20">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h2 className="flex items-center gap-3 text-3xl font-bold text-foreground">
                <div className="rounded-lg bg-green-500/10 p-2">
                  <TrendingDown className="h-6 w-6 text-green-500" />
                </div>
                Nos Packs Tout-Compris
              </h2>
              <p className="mt-2 text-muted-foreground">
                La solution la plus économique pour votre permis
              </p>
            </div>
            <Button
              variant="outline"
              asChild
              className="border-primary/20 text-primary hover:bg-primary/5"
            >
              <Link to="/offres">Comparer toutes les offres</Link>
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-6">
            {offres.map((offre) => (
              <Card
                key={offre.id || offre.slug}
                className={`group w-full max-w-sm border-2 transition-all duration-300 hover:-translate-y-1 sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] ${
                  offre.highlight
                    ? "border-primary bg-primary/[0.02] shadow-xl shadow-primary/10"
                    : "border-border/50 bg-card shadow-sm hover:border-primary/30"
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex h-full flex-col">
                    <div className="mb-4">
                      <h3 className="line-clamp-1 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {offre.title || offre.name}
                      </h3>
                      {offre.priceDetail && (
                        <p className="mt-1 text-xs font-bold uppercase tracking-wider text-primary">
                          {offre.priceDetail}
                        </p>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between border-t border-border/50 pt-4">
                      <div className="text-2xl font-black text-foreground">
                        {offre.displayPrice || offre.price}
                      </div>
                      <Button
                        size="sm"
                        variant={offre.highlight ? "primary" : "outline"}
                        asChild
                        className="h-8 px-4 text-xs font-bold uppercase tracking-tighter"
                      >
                        <Link
                          to={
                            offre.id === "pack-sur-mesure" ||
                            offre.slug === "pack-sur-mesure"
                              ? "/contact"
                              : "/preinscription"
                          }
                        >
                          {offre.id === "pack-sur-mesure" ||
                          offre.slug === "pack-sur-mesure"
                            ? "Devis"
                            : "Choisir"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollAnimation>

        {/* Tableau des prix unitaires */}
        <StaggerContainer
          className="mb-20 flex flex-wrap justify-center gap-6"
          delay={0.1}
        >
          {[
            { label: "Heure de conduite", price: "55€", detail: "À l'unité" },
            {
              label: "Pack Code",
              price: "150€",
              detail: "Accès 6 mois + livre",
            },
            {
              label: "Frais de dossier",
              price: "80€",
              detail: "Inscription ANTS",
            },
            {
              label: "Accompagnement examen",
              price: "55€",
              detail: "Le jour J",
            },
          ].map((item, i) => (
            <StaggerItem key={i} className="w-full sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)] max-w-sm">
              <Card className="flex h-full flex-col border border-border/50 bg-card text-center shadow-sm transition-shadow hover:shadow-md">
                <CardHeader className="flex-grow">
                  <CardTitle className="flex min-h-[3rem] items-center justify-center text-center text-lg font-medium text-muted-foreground">
                    {item.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pb-8">
                  <p className="text-3xl font-bold text-foreground">
                    {item.price}
                  </p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {item.detail}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Simulateur */}
        <ScrollAnimation
          id="simulateur"
          className="mx-auto max-w-4xl scroll-mt-32"
        >
          <Card className="overflow-hidden border-2 border-primary/20 bg-card shadow-xl">
            <div className="flex items-center gap-4 bg-primary p-6 text-white">
              <Calculator className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Simulateur de Budget
                </h2>
                <p className="text-sm text-primary-foreground/80">
                  Estimez le coût de votre formation en quelques clics
                </p>
              </div>
            </div>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <Label
                      htmlFor="hours"
                      className="text-base font-semibold text-foreground"
                    >
                      Nombre d'heures estimé
                    </Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="hours"
                        type="range"
                        min="20"
                        max="50"
                        step="1"
                        value={hours}
                        onChange={(e) => setHours(parseInt(e.target.value))}
                        className="h-2 flex-grow cursor-pointer appearance-none rounded-lg bg-muted accent-primary"
                      />
                      <span className="w-12 text-xl font-bold text-primary">
                        {hours}h
                      </span>
                    </div>
                    <p className="text-xs italic text-muted-foreground">
                      20h est le minimum légal obligatoire.
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label className="text-base font-semibold text-foreground">
                      Options additionnelles
                    </Label>
                    <div className="space-y-3">
                      <label className="group flex cursor-pointer items-center gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${hasCode ? "border-primary bg-primary" : "border-border group-hover:border-primary/50"}`}
                        >
                          <input
                            type="checkbox"
                            checked={hasCode}
                            onChange={() => setHasCode(!hasCode)}
                            className="hidden"
                          />
                          {hasCode && <Check className="h-4 w-4 text-white" />}
                        </div>
                        <span className="text-foreground/80">
                          J'ai déjà mon code de la route
                        </span>
                      </label>
                      <label className="group flex cursor-pointer items-center gap-3">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded border transition-colors ${isAccelerated ? "border-primary bg-primary" : "border-border group-hover:border-primary/50"}`}
                        >
                          <input
                            type="checkbox"
                            checked={isAccelerated}
                            onChange={() => setIsAccelerated(!isAccelerated)}
                            className="hidden"
                          />
                          {isAccelerated && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </div>
                        <span className="text-foreground/80">
                          Formation accélérée (+300€)
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-border/50 bg-muted/50 p-8 shadow-inner">
                  <div>
                    <h3 className="mb-6 text-center text-lg font-bold uppercase tracking-wider text-foreground/80">
                      Votre Devis Estimatif
                    </h3>
                    <ul className="mb-8 space-y-4">
                      <li className="flex justify-between border-b border-border/50 pb-2 text-muted-foreground">
                        <span>
                          Conduite ({hours}h x {HOUR_PRICE}€)
                        </span>
                        <span className="font-medium text-foreground">
                          {hours * HOUR_PRICE}€
                        </span>
                      </li>
                      <li className="flex justify-between border-b border-border/50 pb-2 text-muted-foreground">
                        <span>Frais de dossier</span>
                        <span className="font-medium text-foreground">
                          {ADMIN_FEE}€
                        </span>
                      </li>
                      {!hasCode && (
                        <li className="flex justify-between border-b border-border/50 pb-2 text-muted-foreground">
                          <span>Pack Code complet</span>
                          <span className="font-medium text-foreground">
                            {CODE_PRICE}€
                          </span>
                        </li>
                      )}
                      {isAccelerated && (
                        <li className="flex justify-between border-b border-border/50 pb-2 text-muted-foreground">
                          <span>Option Accéléré</span>
                          <span className="font-medium text-foreground">
                            {ACCELERATED_FEE}€
                          </span>
                        </li>
                      )}
                    </ul>
                  </div>
                  <div className="pt-6">
                    <div className="mb-8 flex items-end justify-between">
                      <span className="text-xl font-bold text-foreground">
                        Total TTC
                      </span>
                      <span className="text-4xl font-black text-primary">
                        {total}€
                      </span>
                    </div>
                    <Button
                      variant="primary"
                      size="lg"
                      className="w-full shadow-lg shadow-primary/20"
                      asChild
                    >
                      <Link to="/preinscription">S'inscrire maintenant</Link>
                    </Button>
                    <p className="mt-4 text-center text-[10px] font-medium uppercase text-muted-foreground">
                      * Estimation basée sur vos sélections. Un bilan de
                      compétences est requis pour un devis définitif.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Tarifs;
