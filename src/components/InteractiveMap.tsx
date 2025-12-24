import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ZONES } from "../data/mockData";
import { MapPin, AlertCircle, RefreshCcw } from "lucide-react";
import { Button } from "./ui/button";

// Fix for default Leaflet icons in common bundler environments
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom SVG icon generator
const createCustomIcon = (status: string) => {
  let color = "#2F7DFF"; // Blue (Default)
  if (status === "Fermé") color = "#EF4444"; // Red
  if (status === "Occupé") color = "#F59E0B"; // Orange
  if (status === "Disponible") color = "#10B981"; // Green

  return L.divIcon({
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center;">
        <div style="position: absolute; width: 40px; height: 40px; background-color: ${color}; opacity: 0.2; border-radius: 50%; animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; color: ${color}; filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3" fill="white"/>
          </svg>
        </div>
      </div>
    `,
    className: "custom-map-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const InteractiveMap: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    const loadMap = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        // Simulation d'un temps de chargement réseau
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setIsLoading(false);
      } catch (error) {
        console.error("Map loading error:", error);
        setHasError(true);
        setIsLoading(false);
      }
    };

    loadMap();

    const errorTimeout = setTimeout(() => {
      if (isLoading) {
        setHasError(true);
        setIsLoading(false);
      }
    }, 5000);

    return () => clearTimeout(errorTimeout);
  }, [retryCount]);

  const handleRetry = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRetryCount((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-slate-100/50 backdrop-blur-sm dark:border-blue-900 dark:bg-slate-900/50">
        <div className="relative">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary opacity-20"></div>
          <MapPin className="relative z-10 h-12 w-12 text-primary" />
        </div>
        <div className="mt-6 animate-pulse px-4 text-center text-sm font-bold uppercase tracking-widest text-primary/60">
          Carte interactive en cours de chargement
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center rounded-3xl border-2 border-dashed border-red-200 bg-red-50 p-8 text-center backdrop-blur-sm dark:border-red-900 dark:bg-red-950/20">
        <AlertCircle className="mb-4 h-12 w-12 text-red-500" />
        <h3 className="mb-2 text-xl font-bold text-foreground">
          Erreur de chargement
        </h3>
        <p className="mx-auto mb-6 max-w-xs text-muted-foreground">
          Impossible de charger la carte interactive. Veuillez vérifier votre
          connexion.
        </p>
        <Button
          variant="primary"
          onClick={handleRetry}
          className="h-auto rounded-full px-8 py-6 text-lg shadow-elevation-3 shadow-primary/20"
          rightIcon={<RefreshCcw className="h-5 w-5" />}
        >
          Réessayer
        </Button>
      </div>
    );
  }

  return (
    <div className="relative z-0 h-full w-full overflow-hidden rounded-3xl border border-white/20 shadow-2xl">
      <MapContainer
        center={[48.81, 2.27]}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {ZONES.map((zone, idx) => (
          <Marker
            key={idx}
            position={[zone.lat, zone.lng]}
            icon={createCustomIcon(zone.status || "Disponible")}
          >
            <Popup>
              <div className="min-w-[180px] p-1 font-sans">
                <h3 className="mb-1 text-lg font-bold text-blue-900">
                  {zone.city}
                </h3>
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${
                      zone.status === "Disponible"
                        ? "animate-pulse bg-green-500"
                        : zone.status === "Fermé"
                          ? "bg-red-500"
                          : "bg-orange-500"
                    }`}
                  />
                  <span
                    className={`text-sm font-bold ${
                      zone.status === "Disponible"
                        ? "text-green-600"
                        : zone.status === "Fermé"
                          ? "text-red-600"
                          : "text-orange-600"
                    }`}
                  >
                    {zone.status}
                  </span>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Secteurs couverts :
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {zone.sectors.map((sector, i) => (
                      <span
                        key={i}
                        className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      >
                        {sector}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  variant="tertiary"
                  className="mt-4 h-8 w-full rounded-none border-t border-slate-100 text-xs font-bold"
                >
                  Réserver dans cette zone
                </Button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Overlay controls hint */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-[1000] rounded-full border border-white/20 bg-white/80 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-500 shadow-sm backdrop-blur-md dark:bg-black/80">
        Utilisez Ctrl + Scroll pour zoomer
      </div>
    </div>
  );
};

export default InteractiveMap;
