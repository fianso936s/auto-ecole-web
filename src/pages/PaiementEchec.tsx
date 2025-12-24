import React from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Home, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PaiementEchec: React.FC = () => {
  const [searchParams] = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="flex min-h-screen items-center bg-[var(--bg-main)] px-4 pb-20 pt-32">
      <div className="container mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="overflow-hidden border-none bg-card text-center shadow-2xl">
            <div className="h-2 bg-destructive" />
            <CardHeader className="pt-12">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
              <CardTitle className="text-3xl font-bold text-foreground">
                Échec du Paiement
              </CardTitle>
              <p className="mt-2 text-muted-foreground">
                Nous n'avons pas pu valider votre transaction.
              </p>
            </CardHeader>
            <CardContent className="space-y-8 pb-12">
              <div className="mx-auto max-w-md rounded-2xl border border-destructive/10 bg-destructive/5 p-6">
                <p className="mb-1 text-sm text-destructive/80">
                  Motif de l'erreur
                </p>
                <p className="font-medium text-destructive">
                  {error === "cancelled"
                    ? "La transaction a été annulée."
                    : "Une erreur technique est survenue. Aucun montant n'a été débité."}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  Besoin d'aide ?
                </h3>
                <p className="mx-auto max-w-sm text-muted-foreground">
                  Vous pouvez réessayer le paiement ou nous contacter si le
                  problème persiste.
                </p>
              </div>

              <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
                <Button
                  variant="primary"
                  size="lg"
                  className="px-8 shadow-lg shadow-primary/20"
                  asChild
                >
                  <Link to="/preinscription">
                    <RefreshCcw className="mr-2 h-4 w-4" />
                    Réessayer
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="px-8" asChild>
                  <Link to="/contact">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Nous contacter
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

export default PaiementEchec;
