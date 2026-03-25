import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Star, Sparkles, Heart, Gem } from "lucide-react";
import { ParallaxImage } from "../components/ui/ScrollAnimation";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.7, ease: [0.4, 0, 0.2, 1] as const },
  }),
};

const services = [
  {
    icon: Sparkles,
    title: "Milky & Jelly Nails",
    description:
      "La tendance n°1 — ongles translucides nacrés, effet verre dépoli. Un rendu lumineux et aérien.",
    price: "30 — 45€",
    image:
      "https://images.pexels.com/photos/6941115/pexels-photo-6941115.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    icon: Gem,
    title: "Cat Eye Magnétique",
    description:
      "Reflets velours qui bougent avec la lumière. Un effet magnétique hypnotique et premium.",
    price: "40 — 55€",
    image:
      "https://images.pexels.com/photos/3060257/pexels-photo-3060257.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
  {
    icon: Heart,
    title: "Glazed Donut",
    description:
      "Le glow doux et nacré inspiré Hailey Bieber. Finition miroir perlée, élégance absolue.",
    price: "35 — 50€",
    image:
      "https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=600",
  },
];

const testimonials = [
  {
    name: "Amira K.",
    rating: 5,
    text: "Un salon d'exception. La pose est impeccable et le nail art est d'une finesse rare. Je ne vais plus nulle part ailleurs.",
  },
  {
    name: "Sarah M.",
    rating: 5,
    text: "L'accueil est chaleureux, l'ambiance est zen et le résultat est toujours au-dessus de mes attentes. Merci bayaNail !",
  },
  {
    name: "Léa D.",
    rating: 5,
    text: "Glazed donut parfait. Ça fait 6 mois que j'y vais et la qualité est constante. Rapport qualité-prix imbattable.",
  },
];

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* ═══ HERO ═══ */}
      <section className="relative flex min-h-screen items-center">
        <div className="absolute inset-0 z-0">
          <ParallaxImage
            src="https://images.pexels.com/photos/6940364/pexels-photo-6940364.jpeg?auto=compress&cs=tinysrgb&w=1600"
            srcSet="https://images.pexels.com/photos/6940364/pexels-photo-6940364.jpeg?auto=compress&cs=tinysrgb&w=800 800w, https://images.pexels.com/photos/6940364/pexels-photo-6940364.jpeg?auto=compress&cs=tinysrgb&w=1200 1200w, https://images.pexels.com/photos/6940364/pexels-photo-6940364.jpeg?auto=compress&cs=tinysrgb&w=1600 1600w"
            sizes="100vw"
            alt="Salon de manucure bayaNail — Aubervilliers"
            speed={0.2}
            className="absolute inset-0"
            imgClassName="scale-[1.2]"
            loading="eager"
            overlay={
              <div className="absolute inset-0 bg-gradient-to-r from-creme/95 via-creme/70 to-transparent" />
            }
          />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 py-32 lg:px-12">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.p
              custom={0}
              variants={fadeInUp}
              className="mb-4 font-heading text-xs font-medium uppercase tracking-[0.3em] text-gris-moyen"
            >
              Bar à Ongles &mdash; Aubervilliers
            </motion.p>

            <motion.h1 custom={1} variants={fadeInUp} className="mb-6">
              <span className="block font-display text-charcoal">
                Sculpted
              </span>
              <span className="block font-display italic text-rose-dark">
                Elegance
              </span>
            </motion.h1>

            <motion.p
              custom={2}
              variants={fadeInUp}
              className="mb-10 max-w-md font-body text-lg leading-relaxed text-gris-moyen"
            >
              Milky, glazed donut, cat eye, aura — découvrez les tendances
              les plus prisées sublimées par nos artisans.
            </motion.p>

            <motion.div
              custom={3}
              variants={fadeInUp}
              className="flex flex-wrap gap-4"
            >
              <Link to="/reservation" className="btn-premium">
                Prendre rendez-vous
              </Link>
              <Link to="/galerie" className="btn-ghost">
                Voir nos créations
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CURATED SERVICES ═══ */}
      <section className="bg-gris-chaud py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <p className="mb-3 font-heading text-xs font-medium uppercase tracking-[0.3em] text-or-discret">
              Nos signatures
            </p>
            <h2 className="font-display text-charcoal">Trending Now</h2>
            <p className="mx-auto mt-4 max-w-lg font-body text-gris-moyen">
              Les techniques les plus demandées, réalisées avec une
              précision d'orfèvre et des produits premium.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="group">
                <div className="card-editorial overflow-hidden">
                  <div className="mb-5 overflow-hidden rounded-lg">
                    <img
                      src={service.image}
                      srcSet={`${service.image.replace('w=600', 'w=400')} 400w, ${service.image} 600w, ${service.image.replace('w=600', 'w=1200')} 1200w`}
                      sizes="(max-width: 768px) 100vw, 33vw"
                      alt={service.title}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.style.backgroundColor = "#F5E6E8";
                      }}
                    />
                  </div>
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <service.icon className="h-5 w-5 text-or-discret" />
                      <h3 className="font-heading text-base font-semibold tracking-wide text-charcoal">
                        {service.title}
                      </h3>
                    </div>
                    <span className="font-display text-sm text-rose-dark">
                      {service.price}
                    </span>
                  </div>
                  <p className="font-body text-sm leading-relaxed text-gris-moyen">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              to="/soins"
              className="inline-flex items-center gap-2 font-heading text-xs font-medium uppercase tracking-[0.2em] text-charcoal transition-colors hover:text-or-discret"
            >
              Voir toutes nos prestations
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ TESTIMONIALS ═══ */}
      <section className="bg-creme py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-12">
          <div className="mb-16 text-center">
            <h2 className="font-display text-charcoal">
              The <span className="italic">Visionaries</span>
            </h2>
            <p className="mx-auto mt-4 max-w-md font-body text-gris-moyen">
              Ce que nos clientes disent de leur expérience chez bayaNail.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="rounded-xl bg-white p-8 shadow-elevation-1"
              >
                <div className="mb-4 flex gap-1">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-4 w-4 fill-or-discret text-or-discret"
                    />
                  ))}
                </div>
                <p className="mb-6 font-body text-sm italic leading-relaxed text-charcoal/80">
                  "{t.text}"
                </p>
                <p className="font-heading text-xs font-semibold uppercase tracking-widest text-gris-moyen">
                  {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL ═══ */}
      <section className="relative overflow-hidden bg-charcoal py-28">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-rose-nude blur-[100px]" />
          <div className="absolute bottom-1/4 right-1/4 h-48 w-48 rounded-full bg-or-discret blur-[80px]" />
        </div>

        <div className="relative z-10 mx-auto max-w-3xl px-6 text-center lg:px-12">
          <h2 className="font-display text-white">
            Your canvas
            <br />
            <span className="italic text-rose-nude">awaits discovery.</span>
          </h2>
          <p className="mx-auto mb-10 mt-6 max-w-md font-body text-white/50">
            Réservez votre créneau et laissez-nous sublimer vos ongles avec
            art et délicatesse.
          </p>
          <Link to="/reservation" className="btn-gold">
            Prendre rendez-vous
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
