import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ParallaxImage } from "../components/ui/ScrollAnimation";

const categories = ["Tout", "Milky", "Cat Eye", "Blooming", "Chrome", "French", "Glazed", "3D Art"];

const galleryItems = [
  {
    src: "https://images.pexels.com/photos/6941115/pexels-photo-6941115.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Milky Opalescent",
    category: "Milky",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.pexels.com/photos/3060257/pexels-photo-3060257.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Cat Eye Velours",
    category: "Cat Eye",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/704815/pexels-photo-704815.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Blooming Aquarelle",
    category: "Blooming",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/1121230/pexels-photo-1121230.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Chrome Rose Gold",
    category: "Chrome",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/1164339/pexels-photo-1164339.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Micro French Colorée",
    category: "French",
    span: "md:col-span-2",
  },
  {
    src: "https://images.pexels.com/photos/939836/pexels-photo-939836.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "Glazed Donut Classic",
    category: "Glazed",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/7664093/pexels-photo-7664093.jpeg?auto=compress&cs=tinysrgb&w=600",
    title: "3D Micro-Perles",
    category: "3D Art",
    span: "",
  },
  {
    src: "https://images.pexels.com/photos/6940364/pexels-photo-6940364.jpeg?auto=compress&cs=tinysrgb&w=800",
    title: "Jelly Translucide",
    category: "Milky",
    span: "md:col-span-2",
  },
];

const Galerie: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Tout");

  const filtered =
    activeCategory === "Tout"
      ? galleryItems
      : galleryItems.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-28">
      {/* Header */}
      <section className="mx-auto max-w-7xl px-6 pb-16 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="font-display text-charcoal">
            Artistry
            <br />
            <span className="italic text-rose-dark">Defined.</span>
          </h1>
          <p className="mt-6 max-w-lg font-body text-lg text-gris-moyen">
            Milky, cat eye, blooming, glazed donut — découvrez nos plus belles
            réalisations. Chaque main raconte une histoire de style.
          </p>
        </motion.div>
      </section>

      {/* Category Filter */}
      <section className="mx-auto max-w-7xl px-6 pb-12 lg:px-12">
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`rounded-sm px-5 py-2.5 font-heading text-xs font-medium uppercase tracking-[0.15em] transition-all duration-300 ${
                activeCategory === cat
                  ? "bg-charcoal text-white"
                  : "bg-gris-chaud text-gris-moyen hover:bg-rose-light hover:text-charcoal"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-28 lg:px-12">
        <motion.div
          layout
          className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.title}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`group relative overflow-hidden rounded-xl ${item.span}`}
              >
                <ParallaxImage
                  src={item.src}
                  srcSet={`${item.src.replace(/w=\d+/, 'w=400')} 400w, ${item.src.replace(/w=\d+/, 'w=800')} 800w, ${item.src.replace(/w=\d+/, 'w=1200')} 1200w`}
                  sizes={item.span ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 100vw, 25vw"}
                  alt={item.title}
                  speed={0.15}
                  className="aspect-square"
                  imgClassName="scale-[1.15] transition-transform duration-700 group-hover:scale-[1.25]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="font-heading text-xs font-medium uppercase tracking-[0.15em] text-white/70">
                    {item.category}
                  </p>
                  <p className="mt-1 font-display text-lg text-white">
                    {item.title}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* CTA Bottom */}
      <section className="bg-gris-chaud py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-12">
          <div>
            <h2 className="font-display text-charcoal">
              Your Canvas <span className="italic">Awaits.</span>
            </h2>
            <p className="mx-auto mb-8 mt-4 max-w-md font-body text-gris-moyen">
              Inspirée par nos réalisations ? Prenez rendez-vous et laissez
              notre équipe créer votre prochain chef-d'oeuvre.
            </p>
            <a href="/reservation" className="btn-premium">
              Réserver maintenant
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Galerie;
