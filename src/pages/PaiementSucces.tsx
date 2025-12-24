import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, Home, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import confetti from "canvas-confetti";

const PaiementSucces: React.FC = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#10B981", "#34D399", "#6EE7B7"],
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center bg-[var(--bg-main)] px-4 pb-20 pt-32">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-none bg-card text-center shadow-2xl">
            <div className="h-2 bg-green-500" />
            <CardHeader className="pt-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground">
                Paiement Réussi !
              </CardTitle>
              <p className="mt-2 text-muted-foreground">
                Votre acompte a été validé avec succès.
              </p>
            </CardHeader>
            <CardContent className="space-y-8 pb-12">
              <div className="mx-auto max-w-md rounded-2xl border border-border/50 bg-slate-50 p-6 dark:bg-slate-800/50">
                <p className="mb-1 text-sm text-muted-foreground">
                  Référence du paiement
                </p>
                <p className="break-all font-mono text-xs font-bold text-foreground">
                  {sessionId || "PRLV-123456789"}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Et maintenant ?
                </h3>
                <p className="mx-auto max-w-sm text-muted-foreground">
                  Votre dossier est en cours de traitement. Vous recevrez un
                  email de confirmation d'ici quelques minutes.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-8 shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link to="/dashboard">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Accéder à mon espace
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8" asChild>
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Retour à l'accueil
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PaiementSucces;
