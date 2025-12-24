import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Label } from "../components/ui/label";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { contact } from "../lib/api";

const contactSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Adresse email invalide"),
  phone: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Numéro de téléphone invalide"
    ),
  subject: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
  message: z
    .string()
    .min(10, "Le message doit contenir au moins 10 caractères"),
});

type ContactFormData = z.infer<typeof contactSchema>;

const STORAGE_KEY = "moniteur1d_contact_data";

const Contact: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    mode: "onTouched",
  });

  const formData = watch();

  // Charger les données depuis le localStorage au montage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        reset(parsed);
      } catch (e) {
        console.error("Erreur lors du chargement des données sauvegardées", e);
      }
    }
  }, [reset]);

  // Sauvegarder les données dans le localStorage à chaque changement
  useEffect(() => {
    if (!isSuccess) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isSuccess]);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // Séparer le nom et le prénom pour le backend
      const nameParts = data.name.trim().split(" ");
      const firstName = nameParts[0];
      const lastName =
        nameParts.length > 1 ? nameParts.slice(1).join(" ") : "Non précisé";

      await contact({
        email: data.email,
        firstName,
        lastName,
        phone: data.phone,
        message: `[Sujet: ${data.subject}] ${data.message}`,
        source: "website",
      });

      setIsSuccess(true);

      // Célébration !
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#2563eb", "#3b82f6", "#60a5fa"],
      });

      toast.success(
        "Votre message a bien été envoyé ! Nous vous répondrons sous 24h."
      );
      localStorage.removeItem(STORAGE_KEY); // Nettoyer après succès

      // Reset after 5 seconds to show success state
      setTimeout(() => {
        setIsSuccess(false);
        reset({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
        });
      }, 5000);
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message || "Une erreur est survenue lors de l'envoi du message."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[var(--bg-main)] px-4 pb-20 pt-32">
      <div className="container mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="mb-6 text-4xl font-bold md:text-5xl">
            Contactez-<span className="text-primary">nous</span>
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-muted-foreground">
            Une question sur nos formules ou besoin d'un devis personnalisé ?
            Notre équipe est à votre écoute.
          </p>
        </motion.div>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Informations de contact */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <Card className="border-none bg-primary text-primary-foreground shadow-elevation-3">
              <CardHeader>
                <CardTitle className="text-2xl">Coordonnées</CardTitle>
                <CardDescription className="text-blue-100">
                  Plusieurs moyens de nous joindre facilement.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Phone className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase text-blue-100">
                      Téléphone
                    </p>
                    <p className="text-lg font-bold">01 23 45 67 89</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <Mail className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase text-blue-100">
                      Email
                    </p>
                    <p className="text-lg font-bold">contact@moniteur1d.fr</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                    <MapPin className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold uppercase text-blue-100">
                      Siège social
                    </p>
                    <p className="text-lg font-bold">
                      123 Avenue du Maine, 75015 Paris
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl text-foreground">
                  Horaires d'accueil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-muted-foreground">
                  <span>Lundi - Vendredi</span>
                  <span className="font-semibold text-foreground">
                    09h - 19h
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Samedi</span>
                  <span className="font-semibold text-foreground">
                    10h - 17h
                  </span>
                </div>
                <div className="flex justify-between text-slate-400 dark:text-slate-500">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Formulaire de contact */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden border-none shadow-2xl">
              <AnimatePresence mode="wait">
                {isSuccess ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex min-h-[500px] flex-col items-center justify-center p-12 text-center"
                  >
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-12 w-12 text-green-600" />
                    </div>
                    <h2 className="mb-4 text-3xl font-bold text-foreground">
                      Message envoyé !
                    </h2>
                    <p className="mx-auto mb-8 max-w-md text-lg text-muted-foreground">
                      Merci pour votre message. Notre équipe reviendra vers vous
                      par email ou par téléphone sous 24 heures.
                    </p>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setIsSuccess(false);
                        reset({
                          name: "",
                          email: "",
                          phone: "",
                          subject: "",
                          message: "",
                        });
                      }}
                    >
                      Envoyer un autre message
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div key="form" exit={{ opacity: 0, y: -20 }}>
                    <CardHeader>
                      <CardTitle className="text-2xl">
                        Envoyez un message
                      </CardTitle>
                      <CardDescription>
                        Réponse garantie sous 24 heures ouvrées.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="name">Nom complet</Label>
                            <Input
                              id="name"
                              placeholder="Jean Dupont"
                              {...register("name")}
                              className={
                                errors.name
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }
                            />
                            {errors.name && (
                              <p className="text-xs font-medium text-red-500">
                                {errors.name.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                              id="email"
                              type="email"
                              placeholder="jean.dupont@email.com"
                              {...register("email")}
                              className={
                                errors.email
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }
                            />
                            {errors.email && (
                              <p className="text-xs font-medium text-red-500">
                                {errors.email.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                          <div className="space-y-2">
                            <Label htmlFor="phone">Téléphone</Label>
                            <Input
                              id="phone"
                              placeholder="06 12 34 56 78"
                              {...register("phone")}
                              className={
                                errors.phone
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }
                            />
                            {errors.phone && (
                              <p className="text-xs font-medium text-red-500">
                                {errors.phone.message}
                              </p>
                            )}
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="subject">Sujet</Label>
                            <Input
                              id="subject"
                              placeholder="Demande de renseignements"
                              {...register("subject")}
                              className={
                                errors.subject
                                  ? "border-red-500 focus-visible:ring-red-500"
                                  : ""
                              }
                            />
                            {errors.subject && (
                              <p className="text-xs font-medium text-red-500">
                                {errors.subject.message}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            placeholder="Bonjour, je souhaiterais avoir des informations sur..."
                            rows={5}
                            {...register("message")}
                            className={
                              errors.message
                                ? "border-red-500 focus-visible:ring-red-500"
                                : ""
                            }
                          />
                          {errors.message && (
                            <p className="text-xs font-medium text-red-500">
                              {errors.message.message}
                            </p>
                          )}
                        </div>

                        <Button
                          type="submit"
                          variant="primary"
                          className="h-12 w-full text-lg"
                          loading={isSubmitting}
                          rightIcon={<Send className="h-5 w-5" />}
                        >
                          Envoyer mon message
                        </Button>
                      </form>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
