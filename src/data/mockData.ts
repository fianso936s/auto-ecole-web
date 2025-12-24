export const OFFRES = [
  {
    id: "permis-b-classique",
    title: "Pack Initial",
    subtitle: "L'essentiel pour réussir",
    description:
      "La formation complète pour obtenir votre permis de conduire à votre rythme.",
    price: "1290€",
    priceDetail: "Soit 95€ d'économie",
    target: "Idéal pour les étudiants et actifs",
    features: [
      "20 heures de conduite (boîte manuelle)",
      "Code de la route illimité (6 mois)",
      "Accompagnement administratif complet",
      "1 présentation à l'examen incluse",
      "Livret d'apprentissage numérique",
    ],
    highlight: false,
  },
  {
    id: "permis-accelere",
    title: "Pack Accéléré",
    subtitle: "Le permis en un temps record",
    description:
      "Obtenez votre permis en moins de 30 jours avec notre formation intensive.",
    price: "1890€",
    priceDetail: "Soit 345€ d'économie",
    target: "Pour ceux qui ont une date d'examen proche",
    features: [
      "30 heures de conduite intensives",
      "Stage code intensif (3 jours)",
      "Planning de conduite prioritaire",
      "1 présentation à l'examen (sous 15 jours)",
      "Suivi quotidien personnalisé",
    ],
    highlight: true,
  },
  {
    id: "conduite-accompagnee",
    title: "Conduite Accompagnée",
    subtitle: "L'expérience pour la confiance",
    description:
      "Dès 15 ans, apprenez à conduire sereinement avec vos proches.",
    price: "1090€",
    priceDetail: "Le meilleur taux de réussite",
    target: "Accessible dès 15 ans",
    features: [
      "20 heures de conduite initiales",
      "Code de la route inclus et illimité",
      "2 rendez-vous pédagogiques",
      "Formation des accompagnateurs (2h)",
      "Assurance souvent moins chère après",
    ],
    highlight: false,
  },
  {
    id: "pack-sur-mesure",
    title: "Pack Sur-Mesure",
    subtitle: "À la carte selon vos besoins",
    description:
      "Composez votre formation selon votre expérience et votre budget.",
    price: "Sur devis",
    priceDetail: "Prix à l'heure : 55€",
    target: "Pour un perfectionnement ciblé",
    features: [
      "Nombre d'heures au choix",
      "Code de la route en option",
      "Évaluation de départ offerte",
      "Flexibilité totale du planning",
      "Moniteur dédié possible",
    ],
    highlight: false,
  },
];

export const COMPARATIF_OFFRES = {
  features: [
    "Heures de conduite",
    "Code de la route",
    "Frais de dossier",
    "Présentation examen",
    "Délai moyen",
    "Accompagnement",
  ],
  offres: [
    {
      name: "Pack Initial",
      values: [
        "20h",
        "Inclus (6 mois)",
        "Inclus",
        "1 incluse",
        "3-6 mois",
        "Standard",
      ],
    },
    {
      name: "Pack Accéléré",
      values: [
        "30h",
        "Stage intensif",
        "Inclus",
        "Prioritaire",
        "Moins de 30j",
        "Quotidien",
      ],
      highlight: true,
    },
    {
      name: "Conduite Accompagnée",
      values: [
        "20h",
        "Inclus",
        "Inclus",
        "1 incluse",
        "Selon l'âge",
        "Pédagogique",
      ],
    },
  ],
};

export const FAQ_OFFRES = [
  {
    question: "Combien de temps dure la formation ?",
    answer:
      "La durée moyenne est de 3 à 6 mois pour une formation classique, et moins d'un mois pour le pack accéléré.",
  },
  {
    question: "Puis-je payer en plusieurs fois ?",
    answer:
      "Oui, nous proposons des facilités de paiement en 3 ou 4 fois sans frais.",
  },
  {
    question: "Quels sont les documents à fournir ?",
    answer:
      "Pièce d'identité, justificatif de domicile de moins de 6 mois, et photos d'identité numériques (e-photo).",
  },
];

export const REVIEWS = [
  {
    id: 1,
    name: "Thomas L.",
    rating: 5,
    date: "Il y a 2 semaines",
    comment:
      "Super auto-école ! Les moniteurs sont très pédagogues et patients. J'ai eu mon permis du premier coup grâce à leur pack réussite.",
    tags: ["Réussite", "Pédagogie"],
  },
  {
    id: 2,
    name: "Sarah M.",
    rating: 4,
    date: "Il y a 1 mois",
    comment:
      "Très bonne expérience. L'accueil est chaleureux et les horaires sont flexibles, ce qui est parfait quand on travaille.",
    tags: ["Flexibilité"],
  },
  {
    id: 3,
    name: "Nicolas R.",
    rating: 5,
    date: "Il y a 2 mois",
    comment:
      "Code et conduite obtenus rapidement. L'application mobile est vraiment top pour réviser n'importe où !",
    tags: ["Réussite", "App"],
  },
  {
    id: 4,
    name: "Julie D.",
    rating: 5,
    date: "Il y a 1 semaine",
    comment:
      "Moniteur incroyable ! Très patient, il a su me redonner confiance après un premier échec ailleurs.",
    tags: ["Pédagogie"],
  },
  {
    id: 5,
    name: "Marc A.",
    rating: 5,
    date: "Il y a 3 semaines",
    comment:
      "J'ai eu mon permis ! Merci pour l'accompagnement et la flexibilité du planning.",
    tags: ["Réussite", "Flexibilité"],
  },
  {
    id: 6,
    name: "Léa P.",
    rating: 4,
    date: "Il y a 1 mois",
    comment:
      "L'app est super pratique pour suivre sa progression et réserver ses heures.",
    tags: ["App"],
  },
  {
    id: 7,
    name: "Kevin S.",
    rating: 5,
    date: "Il y a 2 mois",
    comment:
      "Une équipe au top, toujours à l'écoute. La pédagogie est vraiment adaptée à chacun.",
    tags: ["Pédagogie"],
  },
  {
    id: 8,
    name: "Mélanie V.",
    rating: 5,
    date: "Il y a 3 jours",
    comment:
      "Enfin mon permis en poche ! Un grand merci pour l'organisation sans faille.",
    tags: ["Réussite", "Flexibilité"],
  },
];

export const ZONES = [
  {
    city: "Paris 15e",
    sectors: ["Vaugirard", "Convention", "Boucicaut"],
    lat: 48.8412,
    lng: 2.3003,
    status: "Disponible",
  },
  {
    city: "Issy-les-Moulineaux",
    sectors: ["Centre-ville", "Corentin Celton"],
    lat: 48.8239,
    lng: 2.27,
    status: "Disponible",
  },
  {
    city: "Boulogne-Billancourt",
    sectors: ["Marcel Sembat", "Pont de Sèvres"],
    lat: 48.8352,
    lng: 2.2409,
    status: "Occupé",
  },
  {
    city: "Vanves",
    sectors: ["Plateau de Vanves", "Centre"],
    lat: 48.8211,
    lng: 2.29,
    status: "Disponible",
  },
  {
    city: "Vélizy-Villacoublay",
    sectors: ["Centre Commercial", "Zone d'activités"],
    lat: 48.7816,
    lng: 2.2201,
    status: "Disponible",
  },
  {
    city: "Massy",
    sectors: ["Gare", "Atlantis"],
    lat: 48.7308,
    lng: 2.2713,
    status: "Fermé",
  },
];
