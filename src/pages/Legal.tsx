import React from "react";
import { Routes, Route } from "react-router-dom";

const Legal: React.FC = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold">Mentions Légales</h1>
      <Routes>
        <Route path="mentions-legales" element={<div>Mentions Légales</div>} />
        <Route path="cgv" element={<div>CGV</div>} />
        <Route
          path="confidentialite"
          element={<div>Politique de confidentialité</div>}
        />
        <Route
          index
          element={<div>Veuillez sélectionner une page légale.</div>}
        />
      </Routes>
    </div>
  );
};

export default Legal;
