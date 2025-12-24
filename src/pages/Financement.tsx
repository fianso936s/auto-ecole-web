import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import {
  CheckCircle2,
  CreditCard,
  GraduationCap,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";

const Financement: React.FC = () => {
  const financingOptions = [
    {
      title: "Mon Compte Formation (CPF)",
      description:
        "Utilisez vos droits à la formation pour financer l'intégralité ou une partie de votre permis B.",
      icon: <CreditCard className="h-8 w-8 text-primary" />,
      benefits: [
        "Zéro reste à charge possible",
        "Inscription simplifiée via l'app CPF",
        "Valable pour code + conduite",
      ],
      link: "https://www.moncompteformation.gouv.fr",
      cta: "Vérifier mes droits",
    },
    {
      title: "Permis à 1€ par jour",
      description:
        "Un prêt à taux zéro pour les 15-25 ans afin de faciliter l'accès au premier permis.",
      icon: <GraduationCap className="h-8 w-8 text-primary" />,
      benefits: [
        "Taux d'intérêt à 0%",
        "Remboursement de 30€/mois",
        "Ouvert aux 15-25 ans",
      ],
      link: "/contact",
      cta: "Demander des infos",
    },
    {
      title: "Aide Apprentis (500€)",
      description:
        "Une aide forfaitaire de l'État pour les apprentis de plus de 18 ans en cours de formation.",
      icon: <ShieldCheck className="h-8 w-8 text-primary" />,
      benefits: [
        "Aide de 500€ sans conditions de ressources",
        "Cumulable avec les autres aides",
        "Versée directement par le CFA",
      ],
      link: "/contact",
      cta: "Comment en bénéficier ?",
    },
  ];

  return (
    <div className="bg-[var(--bg-main)] px-4 pb-20 pt-32">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Financer votre <span className="text-primary">Permis</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            De nombreuses solutions existent pour vous aider à financer votre
            formation. Nous vous accompagnons dans toutes vos démarches
            administratives.
          </p>
        </div>

        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-3">
          {financingOptions.map((option, index) => (
            <Card
              key={index}
              className="flex flex-col border-none shadow-xl transition-all hover:shadow-2xl"
            >
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="rounded-2xl bg-primary/5 p-3">
                  {option.icon}
                </div>
                <CardTitle className="text-xl text-foreground">
                  {option.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="mb-6 text-muted-foreground">
                  {option.description}
                </p>
                <ul className="mb-8 space-y-3">
                  {option.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-center gap-2 text-sm text-foreground/80"
                    >
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <div className="mt-auto p-6 pt-0">
                <Button className="w-full" variant="secondary" asChild>
                  {option.link.startsWith("http") ? (
                    <a
                      href={option.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {option.cta}
                    </a>
                  ) : (
                    <Link to={option.link}>{option.cta}</Link>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <div className="relative overflow-hidden rounded-3xl bg-slate-900 p-10 text-white shadow-2xl shadow-blue-900/20 dark:bg-slate-800 md:p-16">
          <div className="relative z-10 max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white">
              Besoin d'aide pour votre dossier ?
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-slate-300">
              Les démarches CPF ou Permis à 1€ peuvent paraître complexes. Notre
              équipe administrative est experte sur ces sujets et s'occupe de
              monter votre dossier avec vous.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button
                size="lg"
                variant="primary"
                asChild
                className="shadow-lg shadow-blue-500/20"
              >
                <Link to="/preinscription">S'inscrire maintenant</Link>
              </Button>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-400">
                <span className="h-2 w-2 animate-pulse rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                Réponse sous 24h ouvrées
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 -mr-32 -mt-32 h-96 w-96 rounded-full bg-primary/10 opacity-50 blur-3xl"></div>
        </div>
      </div>
    </div>
  );
};

export default Financement;
