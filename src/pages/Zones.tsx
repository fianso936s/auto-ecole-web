import React, { useState, useMemo } from "react";
import { ZONES } from "../data/mockData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  MapPin,
  Navigation,
  Map as MapIcon,
  Search,
  CheckCircle2,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import InteractiveMap from "../components/InteractiveMap";
import { Badge } from "../components/ui/badge";

const Zones: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);

  const filteredZones = useMemo(() => {
    return ZONES.filter(
      (zone) =>
        zone.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        zone.sectors.some((sector) =>
          sector.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery]);

  return (
    <div className="bg-[var(--bg-main)] px-4 pb-20 pt-32">
      <div className="container mx-auto">
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 text-4xl font-bold text-foreground md:text-5xl"
          >
            Nos <span className="text-primary">Zones</span> d'intervention
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground"
          >
            Nous venons vous chercher à l'endroit qui vous arrange : domicile,
            travail ou école. Découvrez nos secteurs couverts.
          </motion.p>
        </div>

        {/* Barre de recherche interactive */}
        <div className="relative mx-auto mb-12 max-w-xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Rechercher une ville ou un quartier..."
              className="h-14 rounded-2xl border-none bg-card pl-12 text-lg text-foreground shadow-lg focus-visible:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          {searchQuery && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              {filteredZones.length} résultat(s) trouvé(s)
            </p>
          )}
        </div>

        <div className="mb-20 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredZones.map((zone, index) => (
              <motion.div
                key={zone.city}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={`cursor-pointer border-border/50 shadow-md transition-all duration-300 ${
                    selectedCity === zone.city
                      ? "-translate-y-2 ring-2 ring-primary"
                      : "hover:-translate-y-1"
                  }`}
                  onClick={() =>
                    setSelectedCity(
                      selectedCity === zone.city ? null : zone.city
                    )
                  }
                >
                  <CardHeader
                    className={`${selectedCity === zone.city ? "bg-primary text-white" : "bg-slate-50 dark:bg-slate-800/50"} rounded-t-xl transition-colors`}
                  >
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <MapPin
                        className={`${selectedCity === zone.city ? "text-white" : "text-primary"} h-5 w-5`}
                      />
                      {zone.city}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6">
                    <ul className="space-y-3">
                      {zone.sectors.map((sector, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-foreground/80"
                        >
                          <CheckCircle2
                            className={`h-4 w-4 ${selectedCity === zone.city ? "text-primary" : "text-primary/30"}`}
                          />
                          {sector}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mb-20 grid grid-cols-1 items-stretch gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="group relative h-[500px] overflow-hidden rounded-3xl border-4 border-white shadow-2xl"
          >
            <InteractiveMap />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col justify-center"
          >
            <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-bold text-primary shadow-sm">
              <div className="h-2 w-2 animate-pulse rounded-full bg-primary"></div>
              Récupération à domicile gratuite
            </div>
            <h2 className="mb-6 text-4xl font-bold leading-tight text-foreground">
              Préparez-vous sur les lieux de l'examen
            </h2>
            <p className="mb-8 text-lg leading-relaxed text-muted-foreground">
              Pour maximiser vos chances de réussite, nous effectuons
              systématiquement les dernières heures de conduite sur les parcours
              officiels d'examen.
            </p>
            <div className="space-y-6">
              {[
                {
                  icon: MapIcon,
                  title: "Parcours variés",
                  desc: "Ville, autoroute et zones résidentielles pour une préparation complète.",
                },
                {
                  icon: Navigation,
                  title: "Points de rendez-vous flexibles",
                  desc: "Gares, stations de métro ou devant votre établissement scolaire.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 rounded-2xl border border-transparent p-4 transition-all duration-300 hover:border-border/50 hover:bg-card hover:shadow-lg"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <item.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">
                      {item.title}
                    </h4>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 flex flex-wrap gap-4">
              <Button
                size="lg"
                variant="primary"
                asChild
                className="shadow-elevation-3 shadow-primary/20"
              >
                <Link to="/preinscription">S'inscrire maintenant</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Zones;
