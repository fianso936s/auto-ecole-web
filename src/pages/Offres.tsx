import React, { useEffect, useState } from "react";
import {
  OFFRES as MOCK_OFFRES,
  FAQ_OFFRES,
  COMPARATIF_OFFRES,
} from "../data/mockData";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Check, HelpCircle, Info, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import QuizPack from "../components/QuizPack";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "../components/ui/ScrollAnimation";
import { getOffers } from "../lib/api";

const Offres: React.FC = () => {
  const [offres, setOffres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const data = await getOffers();
        // Combiner avec les données mockées pour le style (highlight, subtitle, etc.)
        const combined = data.map((apiOffre: any) => {
          const mock = MOCK_OFFRES.find(
            (m) => m.id === apiOffre.slug || m.title === apiOffre.name
          );
          return {
            ...apiOffre,
            subtitle: mock?.subtitle || apiOffre.description.split(".")[0],
            priceDetail: mock?.priceDetail || "",
            target: mock?.target || "",
            highlight: mock?.highlight || false,
            // Utiliser les features de l'API si disponibles, sinon mock
            displayFeatures:
              apiOffre.features?.length > 0
                ? apiOffre.features
                : mock?.features || [],
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
            Nos <span className="text-primary">Offres</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Choisissez la formule qui vous correspond le mieux. Toutes nos
            offres incluent un accompagnement personnalisé et des moniteurs
            diplômés d'État.
          </p>
        </ScrollAnimation>

        {/* Liste des offres */}
        <StaggerContainer className="mb-20 flex flex-wrap justify-center gap-6">
          {offres.map((offre) => (
            <StaggerItem key={offre.id || offre.slug} className="w-full max-w-sm sm:w-[calc(50%-0.75rem)] lg:w-[calc(25%-1.125rem)]">
              <Card
                className={`flex h-full flex-col transition-all duration-300 hover:shadow-xl ${offre.highlight ? "relative z-10 scale-105 border-2 border-primary shadow-lg" : "border-border/50 shadow-sm"}`}
              >
                {offre.highlight && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-br from-primary to-primary-hover px-4 py-1 text-xs font-bold uppercase tracking-wider text-primary-foreground shadow-elevation-2">
                    Le plus populaire
                  </div>
                )}
                <CardHeader className="pb-4">
                  <div className="mb-2">
                    <CardTitle className="text-xl font-bold text-foreground">
                      {offre.title || offre.name}
                    </CardTitle>
                    <p className="mt-1 text-sm font-medium text-primary">
                      {offre.subtitle}
                    </p>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-black text-foreground">
                        {offre.displayPrice || offre.price}
                      </span>
                      {(offre.displayPrice || offre.price) !== "Sur devis" && (
                        <span className="text-sm font-normal text-muted-foreground">
                          TTC
                        </span>
                      )}
                    </div>
                    {offre.priceDetail && (
                      <p className="mt-1 inline-block rounded bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-600 dark:bg-green-900/20 dark:text-green-400">
                        {offre.priceDetail}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-0">
                  <p className="mb-4 text-xs italic text-muted-foreground">
                    {offre.target}
                  </p>
                  <p className="mb-6 line-clamp-2 text-sm text-foreground/80">
                    {offre.description}
                  </p>
                  <ul className="space-y-3">
                    {(offre.displayFeatures || offre.features).map(
                      (feature: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-start gap-2.5 text-sm text-foreground/80"
                        >
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                          <span>{feature}</span>
                        </li>
                      )
                    )}
                  </ul>
                </CardContent>
                <CardFooter className="pt-2">
                  <Button
                    className="w-full py-6 font-bold"
                    variant={offre.highlight ? "primary" : "outline"}
                    asChild
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
                        ? "Demander un devis"
                        : "Choisir ce pack"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Quiz Section */}
        <ScrollAnimation className="mb-24 rounded-3xl border border-border/50 bg-slate-50 px-6 py-16 dark:bg-slate-800/50">
          <div className="mb-12 text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
              <HelpCircle className="h-4 w-4" />
              Aide au choix
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Tu hésites entre plusieurs offres ?
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Réponds à quelques questions pour identifier le pack qui
              correspond le mieux à ta situation.
            </p>
          </div>
          <QuizPack />
        </ScrollAnimation>

        {/* Tableau Comparatif */}
        <ScrollAnimation className="mb-24">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              Tableau Comparatif
            </h2>
            <p className="text-muted-foreground">
              Comparez nos formules en un coup d'œil
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-border/50 shadow-sm">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/50">
                  <th className="sticky left-0 z-20 border-b border-border/50 bg-card p-6 text-left text-foreground">
                    Fonctionnalités
                  </th>
                  {COMPARATIF_OFFRES.offres.map((offre, i) => (
                    <th
                      key={i}
                      className={`min-w-[200px] border-b border-border/50 p-6 text-center ${offre.highlight ? "bg-primary/5" : ""}`}
                    >
                      <div className="text-lg font-bold text-foreground">
                        {offre.name}
                      </div>
                      {offre.highlight && (
                        <span className="text-[10px] font-bold uppercase text-primary">
                          Conseillé
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARATIF_OFFRES.features.map((feature, featureIdx) => (
                  <tr
                    key={featureIdx}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-800/30"
                  >
                    <td className="sticky left-0 z-20 border-b border-border/50 bg-card p-6 font-medium text-foreground/80">
                      {feature}
                    </td>
                    {COMPARATIF_OFFRES.offres.map((offre, offreIdx) => (
                      <td
                        key={offreIdx}
                        className={`border-b border-border/50 p-6 text-center text-sm text-muted-foreground ${offre.highlight ? "bg-primary/5" : ""}`}
                      >
                        {offre.values[featureIdx]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 text-primary" />
            <span>
              Tous nos packs incluent l'évaluation de départ et les frais de
              dossier.
            </span>
          </div>
        </ScrollAnimation>

        {/* FAQ Mini */}
        <ScrollAnimation className="mx-auto mb-20 max-w-3xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-foreground">
            Questions Fréquentes
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {FAQ_OFFRES.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="border-border/50"
              >
                <AccordionTrigger className="text-foreground transition-colors hover:text-primary">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollAnimation>

        {/* CTA */}
        <ScrollAnimation
          direction="none"
          className="rounded-3xl bg-slate-900 p-12 text-center text-white shadow-xl shadow-blue-900/20 dark:bg-slate-800"
        >
          <h2 className="mb-4 text-3xl font-bold text-white">
            Besoin d'un conseil personnalisé ?
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-slate-300">
            Nos conseillers sont à votre disposition pour vous aider à choisir
            la meilleure formule selon votre expérience et votre budget.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button size="lg" variant="secondary" asChild className="shadow-lg">
              <Link to="/contact">Nous contacter</Link>
            </Button>
            <Button
              size="lg"
              variant="primary"
              asChild
              className="shadow-elevation-3 shadow-primary/20"
            >
              <Link to="/tarifs">Simuler mon tarif</Link>
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </div>
  );
};

export default Offres;
