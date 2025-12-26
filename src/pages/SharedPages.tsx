import React from "react";

const PageTemplate: React.FC<{ title: string }> = ({ title }) => (
  <div className="px-4 pb-20 pt-32">
    <div className="container mx-auto">
      <h1 className="mb-8">{title}</h1>
      <p className="max-w-3xl text-lg leading-relaxed text-gray-400">
        Le contenu de la page{" "}
        <span className="font-semibold text-accent">{title}</span> est en cours
        de préparation. Revenez très bientôt pour découvrir nos services.
      </p>
    </div>
  </div>
);

export const Offres: React.FC = () => <PageTemplate title="Nos Offres" />;
export const Tarifs: React.FC = () => <PageTemplate title="Nos Tarifs" />;
export const Financement: React.FC = () => <PageTemplate title="Financement" />;
export const Avis: React.FC = () => <PageTemplate title="Avis Clients" />;
export const Zones: React.FC = () => <PageTemplate title="Zones d'examen" />;
export const Contact: React.FC = () => <PageTemplate title="Contactez-nous" />;
export const Preinscription: React.FC = () => (
  <PageTemplate title="Pré-inscription" />
);
export const NotFound: React.FC = () => (
  <PageTemplate title="Page non trouvée" />
);






