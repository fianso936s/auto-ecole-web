import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const soinCategories = [
  {
    number: "01",
    title: "Signature Styles",
    items: [
      {
        name: "Milky & Jelly Nails",
        description:
          "La tendance n°1 — ongles translucides nacrés, effet verre dépoli. Un rendu lumineux et aérien.",
        price: "30 — 45€",
        image:
          "https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&q=80",
      },
      {
        name: "Glazed Donut",
        description:
          "Le glow doux et nacré inspiré Hailey Bieber. Finition miroir perlée, élégance absolue.",
        price: "35 — 50€",
        image:
          "https://images.unsplash.com/photo-1610992015732-2449b0e0df30?w=400&q=80",
      },
      {
        name: "French Revisitée",
        description:
          "Micro french, colorée ou glazed — la french classique réinventée avec modernité et audace.",
        price: "35 — 55€",
        image:
          "https://images.unsplash.com/photo-1625247661636-bac1e69c33e7?w=400&q=80",
      },
    ],
  },
  {
    number: "02",
    title: "Techniques d'Exception",
    items: [
      {
        name: "Cat Eye Magnétique",
        description:
          "Reflets velours qui bougent avec la lumière. Un effet magnétique hypnotique et premium.",
        price: "40 — 55€",
        image:
          "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80",
      },
      {
        name: "Blooming Gel Japonais",
        description:
          "Effets aquarelle et marbre organiques, technique japonaise raffinée. Chaque ongle est unique.",
        price: "45 — 65€",
        image:
          "https://images.unsplash.com/photo-1571290274554-6a2eaa74d75b?w=400&q=80",
      },
    ],
  },
  {
    number: "03",
    title: "Finitions Précieuses",
    items: [
      {
        name: "Chrome Nacré Soft",
        description:
          "Champagne, rose gold, opale — une finition chrome douce et sophistiquée pour un éclat subtil.",
        price: "+5 — 15€",
        image:
          "https://images.unsplash.com/photo-1583255448430-17c5eda08e5c?w=400&q=80",
      },
      {
        name: "Nail Art 3D Miniature",
        description:
          "Micro-perles, bijoux et relief subtil — des créations miniatures sculptées avec précision.",
        price: "+10 — 20€",
        image:
          "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&q=80",
      },
    ],
  },
];

const Tarifs: React.FC = () => {
  return (
    <div className="min-h-screen pt-28">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pb-20 lg:px-12">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="mb-3 font-heading text-xs font-medium uppercase tracking-[0.3em] text-or-discret">
              Curated Selection
            </p>
            <h1 className="font-display text-charcoal">
              Menu des Soins
            </h1>
            <p className="mt-6 max-w-md font-body text-lg leading-relaxed text-gris-moyen">
              Six prestations signatures conçues pour sublimer vos ongles.
              Techniques tendance, finitions haute couture.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative overflow-hidden rounded-xl"
          >
            <img
              src="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=80"
              srcSet="https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80 400w, https://images.unsplash.com/photo-1604654894610-df63bc536371?w=700&q=80 700w, https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1200&q=80 1200w"
              sizes="(max-width: 1024px) 100vw, 50vw"
              alt="Pose signature bayaNail — vernis gel finition miroir"
              className="aspect-[4/3] w-full object-cover"
              loading="eager"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                e.currentTarget.parentElement!.style.backgroundColor = "#F5E6E8";
              }}
            />
            <div className="absolute bottom-4 left-4 rounded-lg bg-white/90 px-4 py-2 backdrop-blur-sm">
              <p className="font-display text-sm italic text-charcoal">
                Cat Eye Magnétique
              </p>
              <p className="font-body text-xs text-gris-moyen">
                Notre soin iconique
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services List */}
      <section className="mx-auto max-w-5xl px-6 pb-20 lg:px-12">
        {soinCategories.map((category) => (
          <div
            key={category.number}
            className="mb-20"
          >
            <div className="mb-10 flex items-baseline gap-4">
              <span className="font-display text-sm text-or-discret">
                {category.number}
              </span>
              <h2 className="font-display text-2xl tracking-wide text-charcoal md:text-3xl">
                {category.title}
              </h2>
            </div>

            <div className="space-y-6">
              {category.items.map((item, i) => (
                <div
                  key={item.name}
                  className={`flex flex-col gap-6 py-8 sm:flex-row sm:items-center ${
                    i < category.items.length - 1
                      ? "border-b border-gris-chaud"
                      : ""
                  }`}
                >
                  <div className="shrink-0 overflow-hidden rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-24 w-24 object-cover transition-transform duration-500 hover:scale-110 sm:h-28 sm:w-28"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading text-base font-semibold text-charcoal">
                      {item.name}
                    </h3>
                    <p className="mt-1 font-body text-sm leading-relaxed text-gris-moyen">
                      {item.description}
                    </p>
                  </div>
                  <span className="shrink-0 font-display text-lg text-charcoal">
                    {item.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* Quote */}
      <section className="bg-rose-light py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-12">
          <blockquote>
            <p className="font-display text-xl italic leading-relaxed text-charcoal md:text-2xl">
              "Chaque ongle est une toile. Nous y apposons notre signature
              avec précision, créativité et passion."
            </p>
            <p className="mt-6 font-heading text-xs font-medium uppercase tracking-[0.2em] text-gris-moyen">
              — L'équipe bayaNail
            </p>
          </blockquote>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-creme py-16">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-12">
          <Link to="/reservation" className="btn-premium">
            Réserver un soin
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Tarifs;
