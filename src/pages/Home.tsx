import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  AnimatePresence,
  useMotionValue,
  animate,
  useInView,
} from "framer-motion";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Link } from "react-router-dom";
import {
  CheckCircle2,
  Users,
  Star,
  Clock,
  MapPin,
  Search,
  ChevronRight,
  Calendar,
  Smartphone,
  Zap,
  ShieldCheck,
  Award,
  HelpCircle,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import InteractiveMap from "../components/InteractiveMap";
import { Badge } from "../components/ui/badge";
import { ZONES, OFFRES } from "../data/mockData";
import { Input } from "../components/ui/input";
import QuizPack from "../components/QuizPack";
import { getOffers } from "../lib/api";

gsap.registerPlugin(ScrollTrigger);

// --- Sub-components ---

const CountUp = ({
  value,
  duration = 2,
  id,
}: {
  value: number;
  duration?: number;
  id?: string;
}) => {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) =>
    Math.floor(latest).toLocaleString()
  );
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    const storageKey = `animated_kpi_${id || value}`;
    const hasAnimated = sessionStorage.getItem(storageKey);

    if (isInView) {
      if (hasAnimated) {
        count.set(value);
      } else {
        const controls = animate(count, value, {
          duration: duration,
          ease: "easeOut",
        });
        sessionStorage.setItem(storageKey, "true");
        return controls.stop;
      }
    }
  }, [isInView, count, value, duration, id]);

  return <motion.span ref={ref}>{rounded}</motion.span>;
};

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [searchFaq, setSearchFaq] = useState("");
  const [offres, setOffres] = useState<any[]>([]);
  const [loadingOffres, setLoadingOffres] = useState(true);

  // Embla Carousel setup
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" }, [
    Autoplay({ delay: 4000, stopOnInteraction: false, stopOnMouseEnter: true }),
  ]);

  useEffect(() => {
    const fetchOffres = async () => {
      try {
        const data = await getOffers();
        setOffres(
          data.slice(0, 4).map((o: any) => ({
            ...o,
            highlight: o.slug === "permis-accelere",
          }))
        );
      } catch (error: any) {
        // Si erreur réseau (backend non démarré), utiliser les données mock
        if (error?.data?.networkError) {
          // Utiliser les données mock comme fallback
          setOffres(
            OFFRES.slice(0, 4).map((o: any) => ({
              ...o,
              id: o.id,
              slug: o.id,
              highlight: o.highlight || o.id === "permis-accelere",
            }))
          );
        } else if (import.meta.env.DEV) {
          console.error("Erreur offres home:", error);
        }
      } finally {
        setLoadingOffres(false);
      }
    };
    fetchOffres();

    // Parallaxe léger Hero (GSAP)
    if (heroRef.current) {
      gsap.to(".hero-bg-element", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }

    // Progress line Timeline (GSAP)
    if (timelineRef.current && progressLineRef.current) {
      gsap.fromTo(
        progressLineRef.current,
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top center",
            end: "bottom center",
            scrub: true,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const faqItems = [
    {
      q: "Comment s'inscrire ?",
      a: "L'inscription se fait directement en ligne via notre formulaire de pré-inscription ou en nous contactant.",
    },
    {
      q: "Quels sont les délais pour passer l'examen ?",
      a: "Les délais dépendent de votre progression et des places disponibles en préfecture, mais nous optimisons chaque dossier.",
    },
    {
      q: "Puis-je payer en plusieurs fois ?",
      a: "Oui, nous proposons des solutions de financement adaptées à votre budget, incluant le CPF.",
    },
    {
      q: "Où se situent les points de rendez-vous ?",
      a: "Nous couvrons de nombreuses zones. Consultez la section 'Zones' pour voir la carte interactive.",
    },
  ].filter(
    (item) =>
      item.q.toLowerCase().includes(searchFaq.toLowerCase()) ||
      item.a.toLowerCase().includes(searchFaq.toLowerCase())
  );

  const timelineSteps = [
    {
      title: "Évaluation",
      desc: "Test de niveau initial pour définir votre parcours personnalisé.",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Code de la route",
      desc: "Accès premium à notre plateforme d'entraînement en ligne 24/7.",
      icon: <Smartphone className="h-6 w-6" />,
    },
    {
      title: "Conduite",
      desc: "Leçons avec nos moniteurs experts sur des véhicules récents.",
      icon: <Zap className="h-6 w-6" />,
    },
    {
      title: "Examen",
      desc: "Accompagnement et passage de l'épreuve avec sérénité.",
      icon: <Award className="h-6 w-6" />,
    },
  ];

  const reviews = [
    {
      name: "Thomas L.",
      text: "Une équipe pédagogique au top. J'ai eu mon permis du premier coup !",
      rating: 5,
      tag: "Réussite",
    },
    {
      name: "Sarah M.",
      text: "La flexibilité des horaires est un vrai plus quand on travaille à côté.",
      rating: 5,
      tag: "Flexibilité",
    },
    {
      name: "Kevin D.",
      text: "Moniteurs très patients et professionnels. Je recommande vivement.",
      rating: 4,
      tag: "Pédagogie",
    },
    {
      name: "Julie R.",
      text: "Application mobile super pratique pour gérer son planning.",
      rating: 5,
      tag: "App",
    },
  ];

  return (
    <div className="relative bg-[var(--bg-main)]">
      {/* Hero Section with Parallax */}
      <section
        ref={heroRef}
        className="relative flex min-h-[90vh] items-center overflow-hidden bg-[var(--bg-hero)] px-4 pb-20 pt-32"
      >
        <div className="absolute inset-0 z-0 opacity-60">
          <div className="hero-bg-element absolute right-[-10%] top-20 h-[500px] w-[500px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="hero-bg-element absolute bottom-0 left-[-5%] h-[400px] w-[400px] rounded-full bg-primary/20 blur-[100px]" />
        </div>

        <div className="container relative z-10 mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <Badge className="mb-6 cursor-default border-primary/20 bg-primary/10 px-4 py-1.5 text-primary transition-all hover:bg-primary/20">
              Auto-école Nouvelle Génération
            </Badge>
            <h1 className="mb-6 text-foreground">
              Réussissez votre <span className="text-primary">permis</span>{" "}
              <br /> en toute sérénité
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl font-medium leading-relaxed text-muted-foreground">
              Une formation premium, flexible et connectée. Apprenez à votre
              rythme avec les meilleurs moniteurs de votre région.
            </p>
            <div className="flex flex-col justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                variant="primary"
                asChild
                rightIcon={<ArrowRight className="h-4 w-4" />}
              >
                <Link to="/preinscription">S'inscrire maintenant</Link>
              </Button>
              <Button
                size="lg"
                variant="secondary"
                className="border-slate-300 dark:border-slate-700"
                asChild
              >
                <Link to="/tarifs#simulateur">Simuler mon budget</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Social Proof: Logos & Count-up */}
      <section className="border-y border-white/5 bg-black/20 py-16 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <motion.div
            className="grid grid-cols-2 gap-8 text-center md:grid-cols-4"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            {[
              { label: "Élèves formés", value: 1250, suffix: "+" },
              { label: "Taux de réussite", value: 94, suffix: "%" },
              { label: "Moniteurs experts", value: 12, suffix: "" },
              { label: "Zones couvertes", value: 8, suffix: "" },
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                variants={{
                  hidden: { opacity: 0, scale: 0.9 },
                  show: { opacity: 1, scale: 1 },
                }}
              >
                <div className="mb-2 text-4xl font-bold text-primary">
                  <CountUp value={stat.value} id={stat.label} />
                  {stat.suffix}
                </div>
                <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 opacity-30 grayscale transition-all duration-500 hover:grayscale-0 md:gap-16">
            {/* Mock Logos */}
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 rounded-md bg-white/20" />
            ))}
          </div>
        </div>
      </section>

      {/* Quiz Section */}
      <section className="relative overflow-hidden bg-[var(--bg-main)] px-4 py-24">
        <div className="absolute inset-0 origin-left -skew-y-3 bg-primary/5" />
        <div className="container relative z-10 mx-auto">
          <div className="mb-16 text-center">
            <Badge
              variant="outline"
              className="mb-4 border-primary bg-primary/5 text-primary"
            >
              Aide au choix
            </Badge>
            <h2 className="mb-4 text-foreground">
              Tu ne sais pas quel pack choisir ?
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              Réponds à 3 questions rapides pour découvrir la formule qui
              correspond exactement à tes besoins et ton profil.
            </p>
          </div>
          <QuizPack />
        </div>
      </section>

      {/* Offres: 4 Premium Cards with 3D Hover */}
      <section className="bg-slate-50/50 px-4 py-24 dark:bg-primary/5">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4">Nos Offres Premium</h2>
            <p className="text-muted-foreground">
              Des formules adaptées à chaque profil de conducteur.
            </p>
          </div>

          {loadingOffres ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <motion.div
              className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.15,
                  },
                },
              }}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
            >
              {offres.map((offer, idx) => (
                <motion.div
                  key={idx}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    show: { opacity: 1, y: 0 },
                  }}
                  whileHover={{ y: -10, rotateX: 2, rotateY: 2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`group relative rounded-3xl border p-8 ${offer.highlight ? "border-primary/30 bg-primary/5 shadow-2xl shadow-primary/10" : "border-border bg-card shadow-sm"} overflow-hidden backdrop-blur-md transition-all`}
                >
                  {offer.highlight && (
                    <div className="absolute right-0 top-0 rounded-bl-xl bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-tighter text-white">
                      Populaire
                    </div>
                  )}
                  <h3 className="mb-2 text-xl text-foreground">{offer.name}</h3>
                  <div className="mb-6 text-3xl font-bold text-primary">
                    {typeof offer.price === "number"
                      ? `${offer.price}€`
                      : offer.price}
                  </div>
                  <ul className="mb-8 space-y-4">
                    {offer.features
                      ?.slice(0, 3)
                      .map((feat: string, i: number) => (
                        <li
                          key={i}
                          className="flex items-center text-sm font-medium text-foreground/90"
                        >
                          <CheckCircle2
                            className="mr-3 h-4 w-4 shrink-0 text-primary"
                            aria-hidden="true"
                          />
                          {feat}
                        </li>
                      ))}
                  </ul>
                  <Button
                    variant="primary"
                    className="w-full"
                    asChild
                    rightIcon={<ArrowRight className="h-4 w-4" />}
                  >
                    <Link to="/preinscription">S'inscrire</Link>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Comment ça marche: Timeline Responsive + Progress Line */}
      <section
        ref={timelineRef}
        className="relative overflow-hidden px-4 py-24"
      >
        <div className="container relative mx-auto max-w-4xl">
          <div className="mb-20 text-center">
            <h2 className="mb-4">Votre parcours vers le permis</h2>
            <p className="text-muted-foreground">
              Une méthode structurée pour une réussite garantie.
            </p>
          </div>

          <div className="relative">
            {/* GSAP Progress Line */}
            <div className="absolute bottom-0 left-8 top-0 w-0.5 bg-border md:left-1/2 md:-translate-x-1/2" />
            <div
              ref={progressLineRef}
              className="absolute left-8 top-0 w-0.5 origin-top bg-primary md:left-1/2 md:-translate-x-1/2"
              style={{ height: "100%" }}
            />

            <div className="space-y-24">
              {timelineSteps.map((step, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className={`flex flex-col items-start gap-12 md:flex-row md:items-center ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div
                    className={`w-full flex-1 md:text-${idx % 2 === 0 ? "right" : "left"}`}
                  >
                    <div
                      className={`group rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/30`}
                    >
                      <h4 className="mb-2 text-xl text-foreground transition-colors group-hover:text-primary">
                        {step.title}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {step.desc}
                      </p>
                    </div>
                  </div>

                  <div className="absolute left-8 z-10 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border-2 border-primary bg-background shadow-[0_0_20px_rgba(59,130,246,0.2)] md:left-1/2">
                    <span className="text-primary">{step.icon}</span>
                  </div>

                  <div className="hidden flex-1 md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Planning & App: Mock Agenda with Tabs */}
      <section className="bg-primary/5 px-4 py-24">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge
                variant="outline"
                className="mb-6 border-primary bg-primary/5 text-primary"
              >
                L'Expérience Digitale
              </Badge>
              <h2 className="mb-6 text-foreground">
                Gérez votre planning en un clic
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Notre application intelligente vous permet de réserver vos
                heures, suivre votre progression et échanger avec votre moniteur
                instantanément.
              </p>
              <div className="space-y-4">
                {[
                  {
                    icon: <Clock className="h-5 w-5" aria-hidden="true" />,
                    text: "Disponibilités en temps réel",
                  },
                  {
                    icon: (
                      <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                    ),
                    text: "Validation des acquis après chaque leçon",
                  },
                  {
                    icon: <Smartphone className="h-5 w-5" aria-hidden="true" />,
                    text: "Notifications de rappel automatiques",
                  },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 font-medium text-foreground/90"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      {item.icon}
                    </div>
                    {item.text}
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-full bg-primary/20 opacity-20 blur-3xl" />
              <Card className="glass relative overflow-hidden border-border bg-card/80 shadow-2xl">
                <CardHeader className="pb-0">
                  <Tabs defaultValue="auto" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 bg-muted">
                      <TabsTrigger value="auto">Réservation Auto</TabsTrigger>
                      <TabsTrigger value="manuelle">
                        Planning Manuel
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="auto" className="py-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-xl border border-primary/10 bg-primary/5 p-4">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-primary" />
                            <div>
                              <div className="text-sm font-semibold text-foreground">
                                Lundi 22 Déc.
                              </div>
                              <div className="text-xs text-muted-foreground">
                                14:00 - 16:00
                              </div>
                            </div>
                          </div>
                          <Badge className="border-green-500/20 bg-green-500/10 text-green-600">
                            Disponible
                          </Badge>
                        </div>
                        <div className="flex items-center justify-between rounded-xl border border-border bg-muted p-4 opacity-50">
                          <div className="flex items-center gap-3">
                            <Calendar className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <div className="text-sm font-semibold text-foreground">
                                Mardi 23 Déc.
                              </div>
                              <div className="text-xs text-muted-foreground">
                                10:00 - 12:00
                              </div>
                            </div>
                          </div>
                          <Badge variant="outline" className="border-border">
                            Occupé
                          </Badge>
                        </div>
                        <Button variant="primary" className="w-full">
                          Confirmer la session
                        </Button>
                      </div>
                    </TabsContent>
                    <TabsContent value="manuelle" className="py-6">
                      <div className="py-8 text-center text-sm text-muted-foreground">
                        Sélectionnez vos créneaux favoris pour une planification
                        personnalisée.
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardHeader>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Avis: Carousel Fluide Embla */}
      <section className="overflow-hidden px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="mb-4">Ce qu'ils en pensent</h2>
              <p className="text-muted-foreground">
                Ils ont réussi leur permis avec nous.
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                aria-label="Avis précédent"
              >
                <ChevronRight className="h-5 w-5 rotate-180" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full"
                aria-label="Avis suivant"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>

          <div className="embla overflow-hidden" ref={emblaRef}>
            <div className="embla__container flex gap-6">
              {reviews.map((review, idx) => (
                <div
                  key={idx}
                  className="embla__slide min-w-0 flex-[0_0_100%] md:flex-[0_0_45%] lg:flex-[0_0_30%]"
                >
                  <Card className="glass flex h-full flex-col justify-between border-border bg-card/80 p-8 shadow-md transition-colors duration-500 hover:border-primary/40">
                    <div>
                      <div className="mb-4 flex gap-1">
                        {[...Array(review.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-primary text-primary"
                          />
                        ))}
                      </div>
                      <p className="mb-6 italic text-foreground/80">
                        "{review.text}"
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-foreground">
                        {review.name}
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-muted text-muted-foreground"
                      >
                        {review.tag}
                      </Badge>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ: Accordion + Recherche */}
      <section className="bg-primary/5 px-4 py-24">
        <div className="container mx-auto max-w-3xl">
          <div className="mb-16 text-center">
            <h2 className="mb-8 text-foreground">Questions Fréquentes</h2>
            <div className="relative mx-auto max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="rounded-xl border-border bg-card pl-10 focus-visible:ring-primary"
                placeholder="Rechercher une question..."
                value={searchFaq}
                onChange={(e) => setSearchFaq(e.target.value)}
              />
            </div>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AnimatePresence>
              {faqItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <AccordionItem
                    value={`item-${idx}`}
                    className="overflow-hidden rounded-xl border border-none border-border/50 bg-card px-4 shadow-sm"
                  >
                    <AccordionTrigger className="py-5 font-semibold text-foreground transition-colors hover:text-primary hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="pb-5 leading-relaxed text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </AnimatePresence>
          </Accordion>
        </div>
      </section>

      {/* Zones: Map Placeholder Glass + Cards Villes */}
      <section className="px-4 py-24">
        <div className="container mx-auto">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-foreground">Où nous trouver ?</h2>
            <p className="text-muted-foreground">
              Plusieurs zones d'examen couvertes pour plus de proximité.
            </p>
          </div>

          <div className="grid h-[600px] grid-cols-1 gap-8 lg:h-[500px] lg:grid-cols-3">
            <div className="group relative h-full lg:col-span-2">
              <InteractiveMap />
            </div>

            <div className="custom-scrollbar space-y-4 overflow-y-auto pr-2">
              {ZONES.map((zone, i) => (
                <div
                  key={i}
                  className="group/zone cursor-default rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:border-primary/30"
                >
                  <div className="mb-2 flex items-start justify-between">
                    <div className="font-bold text-foreground transition-colors group-hover/zone:text-primary">
                      {zone.city}
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        zone.status === "Disponible"
                          ? "border-green-200 bg-green-50 text-green-700"
                          : zone.status === "Occupé"
                            ? "border-amber-200 bg-amber-50 text-amber-700"
                            : "border-red-200 bg-red-50 text-red-700"
                      }
                    >
                      {zone.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 text-primary" />{" "}
                    {zone.sectors.slice(0, 2).join(", ")}
                    {zone.sectors.length > 2 ? "..." : ""}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Area */}
      <section className="relative overflow-hidden rounded-t-[3rem] bg-slate-900 px-4 py-24 text-center text-white dark:bg-slate-950">
        <div className="absolute inset-0 bg-primary/10 opacity-50" />
        <div className="container relative z-10 mx-auto">
          <h2 className="mb-8 text-white">Prêt à prendre la route ?</h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-slate-300">
            Inscrivez-vous en 2 minutes et commencez vos premières leçons dès la
            semaine prochaine.
          </p>
          <div className="flex flex-col justify-center gap-6 sm:flex-row">
            <Button
              size="lg"
              variant="primary"
              asChild
              className="shadow-lg shadow-primary/20"
            >
              <Link to="/preinscription">S'inscrire maintenant</Link>
            </Button>
            <Button
              size="lg"
              variant="secondary"
              asChild
              className="border-white/20 bg-white/10 text-white hover:bg-white/20"
            >
              <Link to="/contact">Parler à un conseiller</Link>
            </Button>
          </div>
          <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-green-500" /> Paiement
              sécurisé
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" /> Éligible CPF
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
