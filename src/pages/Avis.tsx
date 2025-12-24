import React, { useState, useEffect, useCallback } from "react";
import { REVIEWS } from "../data/mockData";
import { Card, CardContent, CardHeader } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  Star,
  Quote,
  Filter,
  Trophy,
  Clock,
  GraduationCap,
  Smartphone,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScrollAnimation,
  StaggerContainer,
  StaggerItem,
} from "../components/ui/ScrollAnimation";

const FILTERS = [
  { id: "all", label: "Tous", icon: Filter },
  {
    id: "Réussite",
    label: "Réussite",
    icon: Trophy,
    description: 'pack "Réussite"',
  },
  {
    id: "Flexibilité",
    label: "Flexibilité",
    icon: Clock,
    description: 'pack "Flexibilité"',
  },
  {
    id: "Pédagogie",
    label: "Pédagogie",
    icon: GraduationCap,
    description: 'pack "Pédagogie"',
  },
  { id: "App", label: "App", icon: Smartphone, description: 'pack "App"' },
];

const Avis: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 1,
      breakpoints: {
        "(min-width: 768px)": { slidesToScroll: 2 },
        "(min-width: 1024px)": { slidesToScroll: 3 },
      },
    },
    [Autoplay({ delay: 5000, stopOnInteraction: true })]
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const filteredReviews =
    activeFilter === "all"
      ? REVIEWS
      : REVIEWS.filter((r) => r.tags.includes(activeFilter));

  const onNavButtonSelect = useCallback((emblaApi: any) => {
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    onNavButtonSelect(emblaApi);
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onNavButtonSelect);
    emblaApi.on("reInit", onNavButtonSelect);
  }, [emblaApi, onNavButtonSelect]);

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi]
  );
  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
    [emblaApi]
  );
  const scrollTo = useCallback(
    (index: number) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi]
  );

  // Re-init embla when filtered reviews change
  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi, filteredReviews]);

  return (
    <div className="bg-[var(--bg-main)] px-4 pb-20 pt-32">
      <div className="container mx-auto">
        <ScrollAnimation className="mb-16 text-center">
          <h1 className="mb-6 text-4xl font-bold text-foreground md:text-5xl">
            Les <span className="text-primary">Avis</span> de nos élèves
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            La réussite de nos élèves est notre plus belle récompense. Découvrez
            leurs témoignages authentiques.
          </p>
          <div className="mt-8 flex items-center justify-center gap-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-6 w-6 fill-yellow-400 text-yellow-400"
                />
              ))}
            </div>
            <span className="text-xl font-bold text-foreground">4.9/5</span>
            <span className="text-muted-foreground">(+500 avis Google)</span>
          </div>
        </ScrollAnimation>

        {/* Filtres UI */}
        <ScrollAnimation direction="none" delay={0.2} className="mb-12">
          <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-4 md:justify-center">
            {FILTERS.map((filter) => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center gap-2 whitespace-nowrap rounded-full border-2 px-6 py-3 text-sm font-semibold transition-all ${
                    isActive
                      ? "scale-105 border-primary bg-primary text-white shadow-lg"
                      : "border-slate-200 bg-slate-100 text-slate-700 hover:border-slate-300 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${isActive ? "text-white" : "text-primary"}`}
                  />
                  {filter.label}
                </button>
              );
            })}
          </div>

          <motion.p
            key={activeFilter}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="mt-4 text-center font-medium text-muted-foreground"
          >
            <span className="font-bold text-primary">
              {filteredReviews.length}
            </span>{" "}
            avis sur{" "}
            {activeFilter === "all"
              ? '"Tous les témoignages"'
              : `"${activeFilter}"`}
          </motion.p>
        </ScrollAnimation>

        {/* Carousel des avis mis en avant (filtré) */}
        <div className="group relative mb-24">
          <div
            className="cursor-grab overflow-hidden active:cursor-grabbing"
            ref={emblaRef}
          >
            <div className="flex">
              <AnimatePresence mode="popLayout">
                {filteredReviews.map((review) => (
                  <motion.div
                    key={`${activeFilter}-${review.id}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="flex-[0_0_100%] px-4 md:flex-[0_0_50%] lg:flex-[0_0_33.333%]"
                  >
                    <Card className="group/card relative h-full overflow-hidden border border-border/50 bg-card shadow-md transition-shadow hover:shadow-xl">
                      <Quote className="absolute -right-4 -top-4 h-24 w-24 rotate-12 text-primary/5 transition-colors group-hover/card:text-primary/10" />
                      <CardHeader className="relative z-10 flex flex-row items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-bold text-white shadow-inner">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-foreground">
                              {review.name}
                            </h3>
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          </div>
                          <div className="flex origin-left scale-75 text-yellow-400">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-current" />
                            ))}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <p className="min-h-[100px] italic leading-relaxed text-foreground/80">
                          "{review.comment}"
                        </p>
                        <div className="mt-6 flex flex-wrap gap-2">
                          {review.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="border-none bg-primary/5 px-3 py-1 text-primary hover:bg-primary/10"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mt-4 text-xs text-muted-foreground">
                          {review.date}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Navigation Flèches */}
          {filteredReviews.length > 1 && (
            <>
              <button
                onClick={scrollPrev}
                className="absolute left-0 top-1/2 z-20 flex h-12 w-12 -translate-x-2 -translate-y-1/2 items-center justify-center rounded-full border border-border/50 bg-card text-foreground opacity-0 shadow-lg transition-all hover:bg-primary hover:text-white group-hover:opacity-100 md:-translate-x-6"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={scrollNext}
                className="absolute right-0 top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 translate-x-2 items-center justify-center rounded-full border border-border/50 bg-card text-foreground opacity-0 shadow-lg transition-all hover:bg-primary hover:text-white group-hover:opacity-100 md:translate-x-6"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Pagination Dots */}
          <div className="mt-8 flex justify-center gap-2">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2.5 w-2.5 rounded-full transition-all ${
                  index === selectedIndex
                    ? "w-8 bg-primary"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Liste détaillée */}
        <div className="mx-auto max-w-5xl border-t border-border/50 pt-10">
          <div className="mb-10 flex items-center justify-between">
            <h2 className="flex items-center gap-3 text-2xl font-bold text-foreground">
              <Filter className="h-5 w-5 text-primary" />
              Détails des témoignages
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            <AnimatePresence mode="popLayout">
              {filteredReviews.map((review) => (
                <motion.div
                  key={review.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm transition-colors hover:bg-primary/5"
                >
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-foreground">
                        {review.name}
                      </h4>
                      <span className="text-sm text-muted-foreground">
                        {review.date}
                      </span>
                    </div>
                    <div className="flex text-yellow-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="mb-4 leading-relaxed text-foreground/70">
                    "{review.comment}"
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {review.tags.map((tag) => (
                      <span
                        key={tag}
                        className="flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-primary"
                      >
                        <Badge
                          variant="outline"
                          className="border-primary/20 bg-background text-primary"
                        >
                          #{tag}
                        </Badge>
                      </span>
                    ))}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Avis;
