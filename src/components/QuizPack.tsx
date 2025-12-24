import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "./ui/card";
import {
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  Zap,
  Clock,
  Users,
  Wallet,
  Check,
} from "lucide-react";
import { OFFRES } from "../data/mockData";
import { Link } from "react-router-dom";

type Question = {
  id: string;
  text: string;
  options: {
    label: string;
    value: string;
    icon?: React.ReactNode;
  }[];
};

const questions: Question[] = [
  {
    id: "age",
    text: "Quel âge as-tu ?",
    options: [
      {
        label: "15 - 17 ans",
        value: "minor",
        icon: <Users className="h-4 w-4" />,
      },
      {
        label: "18 ans et plus",
        value: "major",
        icon: <Users className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "budget",
    text: "Quel est ton budget pour cette formation ?",
    options: [
      {
        label: "Budget maîtrisé",
        value: "limited",
        icon: <Wallet className="h-4 w-4" />,
      },
      {
        label: "Prêt à investir pour la rapidité",
        value: "flexible",
        icon: <Wallet className="h-4 w-4" />,
      },
    ],
  },
  {
    id: "urgency",
    text: "Quel est ton niveau d'urgence ?",
    options: [
      {
        label: "Je veux mon permis au plus vite !",
        value: "urgent",
        icon: <Zap className="h-4 w-4" />,
      },
      {
        label: "Je préfère prendre mon temps",
        value: "chill",
        icon: <Clock className="h-4 w-4" />,
      },
    ],
  },
];

const QuizPack: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [isSkipped, setIsSkipped] = useState(false);

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentStep].id]: value };
    setAnswers(newAnswers);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowResult(true);
    }
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
    setIsSkipped(false);
  };

  const getRecommendedPack = () => {
    if (answers.age === "minor") {
      const pack = OFFRES.find((o) => o.id === "conduite-accompagnee");
      return pack
        ? {
            ...pack,
            reason:
              "C'est la formule idéale pour débuter tôt et gagner en expérience sereinement avant tes 18 ans.",
          }
        : null;
    }

    if (answers.budget === "limited" || answers.urgency === "urgent") {
      const pack = OFFRES.find((o) => o.id === "permis-accelere");
      return pack
        ? {
            ...pack,
            reason:
              answers.urgency === "urgent"
                ? "Tu es pressé, et notre pack accéléré est conçu pour te faire décrocher le permis en un temps record."
                : "Malgré un budget maîtrisé, ce pack offre le meilleur rapport rapidité/prix pour ton profil.",
          }
        : null;
    }

    const pack = OFFRES.find((o) => o.id === "permis-b-classique");
    return pack
      ? {
          ...pack,
          reason:
            "La formule classique est parfaite pour apprendre à ton rythme avec un accompagnement complet et structuré.",
        }
      : null;
  };

  const recommendedPack = getRecommendedPack();

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { duration: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  if (isSkipped) {
    return (
      <div className="mx-auto w-full max-w-4xl">
        <div className="mb-10 text-center">
          <h3 className="mb-4 text-2xl font-bold">Nos Offres Premium</h3>
          <p className="text-muted-foreground">
            Découvre toutes nos formules pour trouver celle qui te convient.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {OFFRES.map((offre) => (
            <Card
              key={offre.id}
              className={`glass border-white/10 ${offre.highlight ? "border-accent/50 ring-1 ring-accent/50" : ""}`}
            >
              <CardHeader>
                <CardTitle>{offre.title}</CardTitle>
                <div className="text-2xl font-bold text-accent">
                  {offre.price}
                </div>
              </CardHeader>
              <CardContent>
                <ul className="mb-6 space-y-2">
                  {offre.features.slice(0, 3).map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-muted-foreground"
                    >
                      <Check className="mr-2 h-4 w-4 text-accent" /> {f}
                    </li>
                  ))}
                </ul>
                <Button variant="primary" className="w-full" asChild>
                  <Link to="/preinscription">S'inscrire</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button variant="tertiary" onClick={resetQuiz}>
            <RotateCcw className="mr-2 h-4 w-4" /> Recommencer le quiz
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4">
      <AnimatePresence mode="wait">
        {!showResult ? (
          <motion.div
            key={`question-${currentStep}`}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="w-full"
          >
            <Card className="glass relative overflow-hidden border-white/10 shadow-2xl">
              {/* Progress Bar Top */}
              <div className="absolute left-0 top-0 h-1.5 w-full bg-white/5">
                <motion.div
                  className="h-full bg-primary shadow-[0_0_10px_hsl(var(--primary)/0.5)]"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((currentStep + 1) / questions.length) * 100}%`,
                  }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              <CardHeader className="pb-4 pt-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Question {currentStep + 1} / {questions.length}
                  </span>
                  {currentStep > 0 && (
                    <button
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ChevronLeft className="h-4 w-4" /> Précédent
                    </button>
                  )}
                </div>
                <CardTitle className="text-2xl font-bold md:text-3xl">
                  {questions[currentStep].text}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 pb-10">
                <div className="grid grid-cols-1 gap-4">
                  {questions[currentStep].options.map((option) => {
                    const isSelected =
                      answers[questions[currentStep].id] === option.value;
                    return (
                      <motion.div 
                        key={option.value} 
                        variants={itemVariants}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant="outline"
                          className={`group relative min-h-[70px] w-full justify-between overflow-hidden border-white/10 px-6 text-lg transition-all duration-300 ${
                            isSelected
                              ? "border-primary/40 bg-primary text-primary-foreground hover:bg-primary-hover"
                              : "glass hover:border-white/20 hover:bg-white/5"
                          }`}
                          onClick={() => handleAnswer(option.value)}
                        >
                          <div className="relative z-10 flex items-center gap-4">
                            <div
                              className={`rounded-xl p-2 transition-colors ${isSelected ? "bg-white/20" : "bg-primary/10 text-primary"}`}
                            >
                              {option.icon}
                            </div>
                            <span className="font-semibold">
                              {option.label}
                            </span>
                          </div>

                          <div className="relative z-10 flex items-center">
                            {isSelected ? (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="rounded-full bg-white p-1 text-primary"
                              >
                                <Check className="h-4 w-4" />
                              </motion.div>
                            ) : (
                              <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
                            )}
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </div>

                <div className="pt-6 text-center">
                  <button
                    onClick={() => setIsSkipped(true)}
                    className="text-sm text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    Passer le quiz
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{
              type: "spring",
              damping: 25,
              stiffness: 120,
            }}
          >
            <Card className="glass relative overflow-hidden border-primary/30 shadow-elevation-4">
              <div className="absolute right-0 top-0 rounded-bl-2xl bg-primary px-6 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground shadow-lg">
                Recommandation
              </div>

              <CardHeader className="pb-6 pt-12 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-primary/20 bg-primary/10"
                >
                  <CheckCircle2 className="h-12 w-12 text-primary" />
                </motion.div>
                <CardTitle className="mb-3 text-3xl font-black md:text-4xl">
                  Le pack idéal pour toi :
                </CardTitle>
                <CardDescription className="text-lg font-medium text-primary/80">
                  Analyse de tes besoins terminée
                </CardDescription>
              </CardHeader>

              <CardContent className="px-6 pb-12 md:px-10">
                {recommendedPack && (
                  <div className="overflow-hidden rounded-3xl border border-primary/20 bg-primary/5">
                    <div className="p-8 md:p-10">
                      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
                        <div>
                          <h3 className="mb-2 text-3xl font-bold">
                            {recommendedPack.title}
                          </h3>
                          <p className="font-medium italic text-primary/90">
                            "{recommendedPack.reason}"
                          </p>
                        </div>
                        <div className="self-start rounded-2xl bg-primary px-6 py-3 text-4xl font-black text-primary-foreground shadow-xl shadow-primary/20 md:self-center">
                          {recommendedPack.price}
                        </div>
                      </div>

                      <div className="mb-10 grid grid-cols-1 gap-4 md:grid-cols-2">
                        {recommendedPack.features.map((feat, i) => (
                          <div
                            key={i}
                            className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/5 p-3 text-muted-foreground"
                          >
                            <Check className="h-5 w-5 shrink-0 text-primary" />
                            <span className="text-sm font-medium">{feat}</span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col gap-4 sm:flex-row">
                        <Button
                          variant="primary"
                          size="lg"
                          className="flex-1"
                          asChild
                        >
                          <Link to="/preinscription">
                            S'inscrire maintenant
                          </Link>
                        </Button>
                        <Button
                          variant="secondary"
                          size="lg"
                          className="px-8"
                          onClick={resetQuiz}
                        >
                          <RotateCcw className="mr-2 h-5 w-5" /> Recommencer
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                <p className="mt-8 text-center text-sm text-muted-foreground">
                  Besoin d'explorer d'autres options ?{" "}
                  <Link
                    to="/offres"
                    className="font-semibold text-primary hover:underline"
                  >
                    Voir toutes nos offres Premium
                  </Link>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuizPack;
