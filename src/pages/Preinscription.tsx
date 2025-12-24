import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import confetti from "canvas-confetti";
import {
  User as UserIcon,
  CreditCard,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Upload,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Trophy,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import api, {
  getOffers,
  getMe,
  register as registerApi,
  createDraft,
  uploadDocument,
  submitPreinscription,
  createCheckout,
} from "../lib/api";

// Types
type Step = 1 | 2 | 3;

interface Offre {
  id: string;
  name: string;
  title: string;
  price: number | string;
  description: string;
  features: string[];
  popular?: boolean;
  slug: string;
}

const preinscriptionSchema = z.object({
  nom: z.string().min(2, "Le nom est requis (min 2 caractères)"),
  prenom: z.string().min(2, "Le prénom est requis"),
  email: z.string().email("Email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .optional(),
  tel: z
    .string()
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Téléphone invalide"
    ),
  ville: z.string().min(2, "La ville est requise"),
  offreId: z.string({
    required_error: "Veuillez choisir une offre",
  }),
  docs: z.any().optional(),
});

type PreinscriptionFormData = z.infer<typeof preinscriptionSchema>;

const STORAGE_KEY = "moniteur1d_preinscription_data";

const Preinscription: React.FC = () => {
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [offres, setOffres] = useState<Offre[]>([]);
  const [user, setUser] = useState<any>(null);
  const [preRegistrationId, setPreRegistrationId] = useState<string | null>(
    null
  );

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { errors },
    reset,
  } = useForm<PreinscriptionFormData>({
    resolver: zodResolver(preinscriptionSchema),
    mode: "onChange",
    defaultValues: {
      nom: "",
      prenom: "",
      email: "",
      tel: "",
      ville: "",
      offreId: "",
    },
  });

  const formData = watch();

  // Chargement initial: Offres + User
  useEffect(() => {
    const init = async () => {
      try {
        const [offresData, userData] = await Promise.allSettled([
          getOffers(),
          getMe(),
        ]);

        if (offresData.status === "fulfilled") {
          setOffres(
            offresData.value.map((o: any) => ({
              ...o,
              title: o.name,
              popular: o.slug === "permis-accelere",
            }))
          );
        }

        if (userData.status === "fulfilled") {
          const u = userData.value.user;
          setUser(u);
          setValue("nom", u.profile?.lastName || "");
          setValue("prenom", u.profile?.firstName || "");
          setValue("email", u.email);
          setValue("tel", u.profile?.phone || "");
          setValue("ville", u.profile?.address || "");
        }
      } catch (error) {
        console.error("Erreur d'initialisation", error);
      } finally {
        setIsInitialLoading(false);
      }
    };
    init();
  }, [setValue]);

  // Charger les données depuis le localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData && !user) {
      try {
        const parsed = JSON.parse(savedData);
        delete parsed.docs;
        delete parsed.password;
        reset(parsed);
      } catch (e) {
        console.error("Erreur lors du chargement des données sauvegardées", e);
      }
    }
  }, [reset, user]);

  // Sauvegarder les données dans le localStorage
  useEffect(() => {
    if (!isSuccess && !user) {
      const dataToSave = { ...formData };
      delete dataToSave.docs;
      delete dataToSave.password;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    }
  }, [formData, isSuccess, user]);

  const handleNext = async () => {
    let fieldsToValidate: (keyof PreinscriptionFormData)[] = [];

    if (step === 1) {
      fieldsToValidate = ["nom", "prenom", "email", "tel", "ville"];
      if (!user) fieldsToValidate.push("password");
    } else if (step === 2) {
      fieldsToValidate = ["offreId"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (!isValid) return;

    setLoading(true);
    try {
      if (step === 1) {
        // Inscription si pas d'utilisateur
        if (!user) {
          await registerApi({
            email: formData.email,
            password: formData.password,
            firstName: formData.prenom,
            lastName: formData.nom,
          });
          // Après inscription, on tente de se connecter ou on refresh le user
          const userData = await getMe();
          setUser(userData.user);
          toast.success("Compte créé avec succès !");
        }
        setStep(2);
      } else if (step === 2) {
        // Créer le brouillon de pré-inscription
        const draft = await createDraft({ offerId: formData.offreId });
        setPreRegistrationId(draft.id);
        setStep(3);
      }
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setStep((prev) => (prev - 1) as Step);
  };

  const onSubmit = async (data: PreinscriptionFormData) => {
    if (step === 3 && !formData.docs) {
      toast.error("Veuillez uploader une pièce d'identité");
      return;
    }

    setLoading(true);
    try {
      if (!preRegistrationId) throw new Error("ID de pré-inscription manquant");

      // 1. Upload du document
      const docFormData = new FormData();
      docFormData.append("file", formData.docs);
      docFormData.append("type", "IDENTITY_CARD");
      docFormData.append("preRegistrationId", preRegistrationId);
      await uploadDocument(docFormData);

      // 2. Soumission finale
      await submitPreinscription(preRegistrationId);

      // 3. Création de la session Stripe
      const { url } = await createCheckout(preRegistrationId);

      // Célébration avant redirection
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });

      toast.success("Redirection vers le paiement...");

      // Nettoyer et rediriger
      localStorage.removeItem(STORAGE_KEY);
      window.location.href = url;
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la validation");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { id: 1, title: "Infos Perso", icon: UserIcon },
    { id: 2, title: "Choix Offre", icon: CreditCard },
    { id: 3, title: "Documents", icon: FileText },
  ];

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-main)] pb-12 pt-24">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="mb-12 flex justify-between">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-12 rounded-full" />
            ))}
          </div>
          <Card className="shadow-xl">
            <CardHeader>
              <Skeleton className="mb-2 h-8 w-1/3" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6 pt-8">
              <div className="grid grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-main)] pb-12 pt-24">
      <div className="container mx-auto max-w-4xl px-4">
        {/* Stepper Header */}
        <div className="mb-12">
          <div className="relative flex items-center justify-between">
            {/* Progress Line */}
            <div className="absolute left-0 top-1/2 z-0 h-1 w-full -translate-y-1/2 bg-slate-200 dark:bg-slate-800" />
            <motion.div
              className="absolute left-0 top-1/2 z-0 h-1 -translate-y-1/2 bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: `${((step - 1) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 0.5 }}
            />

            {steps.map((s) => {
              const Icon = s.icon;
              const isActive = step >= s.id;
              const isCurrent = step === s.id;

              return (
                <div
                  key={s.id}
                  className="relative z-10 flex flex-col items-center"
                >
                  <motion.div
                    initial={false}
                    animate={{
                      backgroundColor: isActive
                        ? "var(--color-primary, #3B82F6)"
                        : "var(--color-bg-card, #ffffff)",
                      borderColor: isActive
                        ? "var(--color-primary, #3B82F6)"
                        : "var(--color-border-medium, #e5e5e5)",
                      scale: isCurrent ? 1.2 : 1,
                    }}
                    className={`flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors
                      ${isActive ? "text-white" : "text-slate-400 dark:text-slate-600"}`}
                  >
                    {isActive && s.id < step ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </motion.div>
                  <span
                    className={`absolute -bottom-8 whitespace-nowrap text-sm font-medium
                    ${isActive ? "text-primary" : "text-muted-foreground"}`}
                  >
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Content */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Card className="border-neutral/10 overflow-hidden shadow-xl">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-12 text-center"
                >
                  <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-green-100">
                    <Trophy className="h-12 w-12 text-green-600" />
                  </div>
                  <h2 className="mb-4 text-4xl font-bold text-foreground">
                    Félicitations !
                  </h2>
                  <p className="mx-auto mb-8 max-w-lg text-xl text-muted-foreground">
                    Votre pré-inscription est validée. Un conseiller va vous
                    contacter sous 24h pour finaliser votre dossier.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Button
                      size="lg"
                      variant="secondary"
                      onClick={() => (window.location.href = "/")}
                    >
                      Retour à l'accueil
                    </Button>
                    <Button
                      variant="secondary"
                      size="lg"
                      onClick={() => setIsSuccess(false)}
                    >
                      Nouvelle inscription
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="form">
                  <CardHeader className="bg-neutral/5 border-neutral/10 border-b">
                    <CardTitle className="text-2xl">
                      {steps[step - 1].title}
                    </CardTitle>
                    <CardDescription>
                      {step === 1 &&
                        "Veuillez renseigner vos informations de contact."}
                      {step === 2 &&
                        "Sélectionnez la formule qui vous correspond le mieux."}
                      {step === 3 &&
                        "Finalisez votre dossier et procédez au paiement."}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="pt-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        {step === 1 && (
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Prénom
                              </label>
                              <Input
                                placeholder="Jean"
                                {...register("prenom")}
                                className={
                                  errors.prenom ? "border-destructive" : ""
                                }
                                disabled={!!user}
                              />
                              {errors.prenom && (
                                <p className="flex items-center gap-1 text-xs text-destructive">
                                  <AlertCircle className="h-3 w-3" />{" "}
                                  {errors.prenom.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Nom de famille
                              </label>
                              <Input
                                placeholder="Dupont"
                                {...register("nom")}
                                className={
                                  errors.nom ? "border-destructive" : ""
                                }
                                disabled={!!user}
                              />
                              {errors.nom && (
                                <p className="flex items-center gap-1 text-xs text-destructive">
                                  <AlertCircle className="h-3 w-3" />{" "}
                                  {errors.nom.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Email
                              </label>
                              <Input
                                type="email"
                                placeholder="jean@example.com"
                                {...register("email")}
                                className={
                                  errors.email ? "border-destructive" : ""
                                }
                                disabled={!!user}
                              />
                              {errors.email && (
                                <p className="flex items-center gap-1 text-xs text-destructive">
                                  <AlertCircle className="h-3 w-3" />{" "}
                                  {errors.email.message}
                                </p>
                              )}
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">
                                Téléphone
                              </label>
                              <Input
                                placeholder="06 12 34 56 78"
                                {...register("tel")}
                                className={
                                  errors.tel ? "border-destructive" : ""
                                }
                              />
                              {errors.tel && (
                                <p className="flex items-center gap-1 text-xs text-destructive">
                                  <AlertCircle className="h-3 w-3" />{" "}
                                  {errors.tel.message}
                                </p>
                              )}
                            </div>
                            {!user && (
                              <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium">
                                  Mot de passe (pour créer votre compte)
                                </label>
                                <div className="relative">
                                  <Input
                                    type="password"
                                    placeholder="******"
                                    {...register("password")}
                                    className={
                                      errors.password
                                        ? "border-destructive pl-10"
                                        : "pl-10"
                                    }
                                  />
                                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                </div>
                                {errors.password && (
                                  <p className="flex items-center gap-1 text-xs text-destructive">
                                    <AlertCircle className="h-3 w-3" />{" "}
                                    {errors.password.message}
                                  </p>
                                )}
                              </div>
                            )}
                            <div className="space-y-2 md:col-span-2">
                              <label className="text-sm font-medium">
                                Ville / Zone
                              </label>
                              <Input
                                placeholder="Paris, Lyon, Marseille..."
                                {...register("ville")}
                                className={
                                  errors.ville ? "border-destructive" : ""
                                }
                              />
                              {errors.ville && (
                                <p className="flex items-center gap-1 text-xs text-destructive">
                                  <AlertCircle className="h-3 w-3" />{" "}
                                  {errors.ville.message}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {step === 2 && (
                          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                            {offres.length > 0 ? (
                              offres.map((offre) => (
                                <motion.div
                                  key={offre.id}
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  onClick={() =>
                                    setValue("offreId", offre.id, {
                                      shouldValidate: true,
                                    })
                                  }
                                  className={`relative cursor-pointer rounded-xl border-2 p-6 transition-all
                                  ${
                                    formData.offreId === offre.id
                                      ? "border-primary bg-primary/5 shadow-md"
                                      : "border-border/50 bg-card hover:border-primary/30"
                                  }`}
                                >
                                  {offre.popular && (
                                    <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 border-none bg-primary px-3 py-1 text-white shadow-sm">
                                      Populaire
                                    </Badge>
                                  )}
                                  <h3 className="mb-2 text-xl font-bold text-foreground">
                                    {offre.title}
                                  </h3>
                                  <div className="mb-4 text-3xl font-bold text-primary">
                                    {typeof offre.price === "number"
                                      ? `${offre.price}€`
                                      : offre.price}
                                  </div>
                                  <p className="mb-6 line-clamp-2 text-sm text-muted-foreground">
                                    {offre.description}
                                  </p>
                                  <ul className="space-y-2">
                                    {offre.features.map((f, i) => (
                                      <li
                                        key={i}
                                        className="flex items-start gap-2 text-sm text-foreground/80"
                                      >
                                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                                        <span>{f}</span>
                                      </li>
                                    ))}
                                  </ul>
                                  {formData.offreId === offre.id && (
                                    <div className="absolute right-4 top-4 rounded-full bg-primary p-1 text-white shadow-sm">
                                      <Check className="h-4 w-4" />
                                    </div>
                                  )}
                                </motion.div>
                              ))
                            ) : (
                              <div className="col-span-full py-12 text-center text-muted-foreground">
                                Aucune offre disponible pour le moment.
                              </div>
                            )}
                            {errors.offreId && (
                              <p className="col-span-full text-center text-sm font-medium text-destructive">
                                {errors.offreId.message}
                              </p>
                            )}
                          </div>
                        )}

                        {step === 3 && (
                          <div className="space-y-8">
                            {/* Upload Section */}
                            <div className="space-y-4">
                              <label className="block text-lg font-semibold text-foreground">
                                Justificatif d'identité
                              </label>
                              <div
                                className={`rounded-xl border-2 border-dashed p-12 text-center shadow-inner transition-colors
                                ${formData.docs ? "border-primary bg-primary/5" : "border-border/50 bg-muted/30 hover:border-primary/30"}`}
                              >
                                <input
                                  type="file"
                                  id="file-upload"
                                  className="hidden"
                                  onChange={(e) =>
                                    setValue(
                                      "docs",
                                      e.target.files?.[0] || null
                                    )
                                  }
                                />
                                <label
                                  htmlFor="file-upload"
                                  className="flex cursor-pointer flex-col items-center gap-4"
                                >
                                  <div className="rounded-full bg-primary/10 p-4">
                                    <Upload className="h-8 w-8 text-primary" />
                                  </div>
                                  <div>
                                    <p className="text-lg font-medium text-foreground">
                                      {formData.docs
                                        ? (formData.docs as File).name
                                        : "Cliquez pour uploader ou glissez-déposez"}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      PNG, JPG ou PDF (max. 5Mo)
                                    </p>
                                  </div>
                                </label>
                              </div>
                              {step === 3 && !formData.docs && (
                                <p className="flex items-center justify-center gap-1 text-sm font-medium text-destructive">
                                  <AlertCircle className="h-4 w-4" /> Veuillez
                                  télécharger un document
                                </p>
                              )}
                            </div>

                            {/* Summary */}
                            <div className="rounded-xl border border-border/50 bg-muted/50 p-6 shadow-sm">
                              <h4 className="mb-4 flex items-center gap-2 font-semibold text-foreground">
                                <FileText className="h-5 w-5 text-primary" />
                                Récapitulatif
                              </h4>
                              <div className="grid grid-cols-2 gap-y-4 text-sm">
                                <div className="text-muted-foreground">
                                  Prénom :
                                </div>
                                <div className="font-medium text-foreground">
                                  {formData.prenom}
                                </div>
                                <div className="text-muted-foreground">
                                  Nom :
                                </div>
                                <div className="font-medium text-foreground">
                                  {formData.nom}
                                </div>
                                <div className="text-muted-foreground">
                                  Offre choisie :
                                </div>
                                <div className="font-medium text-foreground">
                                  {
                                    offres.find(
                                      (o) => o.id === formData.offreId
                                    )?.title
                                  }{" "}
                                  -{" "}
                                  {typeof offres.find(
                                    (o) => o.id === formData.offreId
                                  )?.price === "number"
                                    ? `${offres.find((o) => o.id === formData.offreId)?.price}€`
                                    : offres.find(
                                        (o) => o.id === formData.offreId
                                      )?.price}
                                </div>
                                <div className="text-muted-foreground">
                                  Acompte à payer :
                                </div>
                                <div className="font-bold text-primary">
                                  50,00€
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </motion.div>
                    </AnimatePresence>
                  </CardContent>

                  <CardFooter className="border-neutral/10 bg-neutral/5 mt-8 flex justify-between border-t p-6">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={handleBack}
                      disabled={step === 1 || loading}
                      leftIcon={<ChevronLeft className="h-4 w-4" />}
                    >
                      Retour
                    </Button>

                    {step < 3 ? (
                      <Button
                        type="button"
                        variant="primary"
                        onClick={handleNext}
                        className="px-8"
                        rightIcon={<ChevronRight className="h-4 w-4" />}
                      >
                        Continuer
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={loading || !formData.docs}
                        loading={loading}
                        className="px-8"
                        rightIcon={<CreditCard className="h-4 w-4" />}
                      >
                        Payer l'acompte
                      </Button>
                    )}
                  </CardFooter>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </form>

        {/* Info Text */}
        <p className="text-neutral/40 mt-8 text-center text-sm">
          Vos données sont sécurisées et traitées conformément à notre politique
          de confidentialité. Le paiement de l'acompte est nécessaire pour
          valider votre pré-inscription.
        </p>
      </div>
    </div>
  );
};

export default Preinscription;
