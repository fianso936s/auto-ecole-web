export const ADMIN_STATS = [
  { label: "Nouveaux Leads", value: 45, change: "+12%", status: "up" },
  { label: "Conversions", value: 28, change: "+5%", status: "up" },
  { label: "CA ce mois", value: "32,450€", change: "+18%", status: "up" },
  { label: "Leçons cette semaine", value: 156, change: "-2%", status: "down" },
  { label: "No-shows", value: 4, change: "-15%", status: "up" },
];

export const RECENT_LEADS = [
  { id: "1", name: "Alice Martin", email: "alice@example.com", status: "NEW", date: "2023-12-20" },
  { id: "2", name: "Bob Durand", email: "bob@example.com", status: "FOLLOW_UP", date: "2023-12-19" },
  { id: "3", name: "Charlie Perrin", email: "charlie@example.com", status: "CONVERTED", date: "2023-12-18" },
];

export const CRM_TASKS = [
  { id: "1", title: "Rappeler Alice Martin", dueAt: "2023-12-22T10:00:00Z", status: "TODO" },
  { id: "2", title: "Envoyer devis à Bob", dueAt: "2023-12-22T14:30:00Z", status: "TODO" },
  { id: "3", title: "Relancer lead #456", dueAt: "2023-12-23T09:00:00Z", status: "TODO" },
];

export const CHART_DATA_LESSONS = [
  { name: "Lun", value: 12 },
  { name: "Mar", value: 19 },
  { name: "Mer", value: 15 },
  { name: "Jeu", value: 22 },
  { name: "Ven", value: 30 },
  { name: "Sam", value: 10 },
  { name: "Dim", value: 0 },
];

export const CHART_DATA_CONVERSIONS = [
  { name: "Sem 1", value: 4 },
  { name: "Sem 2", value: 7 },
  { name: "Sem 3", value: 5 },
  { name: "Sem 4", value: 12 },
];

export const DEMO_STUDENTS = [
  {
    id: "1",
    firstName: "Alice",
    lastName: "Martin",
    email: "alice@example.com",
    phone: "0612345678",
    transmission: "MANUAL",
    balance: -150,
    progress: 65,
    status: "ACTIVE",
    createdAt: "2023-10-15",
  },
  {
    id: "2",
    firstName: "Bob",
    lastName: "Durand",
    email: "bob@example.com",
    phone: "0687654321",
    transmission: "AUTO",
    balance: 0,
    progress: 30,
    status: "ACTIVE",
    createdAt: "2023-11-02",
  },
];

export const STUDENT_SKILLS = [
  { category: "Maîtriser le véhicule", skills: [
    { label: "S'installer au poste de conduite", level: 3, status: "ACQUIRED" },
    { label: "Démarrer et s'arrêter", level: 3, status: "ACQUIRED" },
    { label: "Utiliser la boîte de vitesses", level: 2, status: "IN_PROGRESS" },
  ]},
  { category: "Appréhender la route", skills: [
    { label: "Rechercher la signalisation", level: 2, status: "IN_PROGRESS" },
    { label: "Adapter sa vitesse", level: 1, status: "IN_PROGRESS" },
  ]},
];

export const DEMO_INSTRUCTORS = [
  {
    id: "1",
    firstName: "Jean",
    lastName: "Dupont",
    email: "jean.moniteur@moniteur1d.fr",
    phone: "0612345678",
    licenseNumber: "LIC-123456789",
    isActive: true,
    lessonsCount: 45,
    rating: 4.8,
  },
  {
    id: "2",
    firstName: "Marie",
    lastName: "Curie",
    email: "marie.monitrice@moniteur1d.fr",
    phone: "0698765432",
    licenseNumber: "LIC-987654321",
    isActive: true,
    lessonsCount: 32,
    rating: 4.9,
  },
];

export const DEMO_VEHICLES = [
  { id: "1", name: "Peugeot 208 M1", plate: "AB-123-CD", transmission: "MANUAL", isActive: true },
  { id: "2", name: "Peugeot 208 M2", plate: "EF-456-GH", transmission: "MANUAL", isActive: true },
  { id: "3", name: "Renault Zoe A1", plate: "IJ-789-KL", transmission: "AUTO", isActive: true },
  { id: "4", name: "Renault Zoe A2", plate: "MN-012-OP", transmission: "AUTO", isActive: false },
];

export const DEMO_LEADS = [
  { id: "1", firstName: "Alice", lastName: "Martin", email: "alice@example.com", phone: "0611223344", status: "NEW", score: 85, nextFollowUp: "2023-12-24T10:00:00", createdAt: "2023-12-20" },
  { id: "2", firstName: "Bob", lastName: "Durand", email: "bob@example.com", phone: "0622334455", status: "FOLLOW_UP", score: 60, nextFollowUp: "2023-12-23T14:00:00", createdAt: "2023-12-18" },
  { id: "3", firstName: "Charlie", lastName: "Perrin", email: "charlie@example.com", phone: "0633445566", status: "CONVERTED", score: 100, nextFollowUp: null, createdAt: "2023-12-15" },
  { id: "4", firstName: "David", lastName: "Lemoine", email: "david@example.com", phone: "0644556677", status: "NEW", score: 40, nextFollowUp: "2023-12-26T09:00:00", createdAt: "2023-12-21" },
];

export const LEAD_ACTIVITIES = [
  { id: "1", type: "CALL", content: "Appel de découverte, intéressée par le pack initial.", date: "2023-12-20T11:00:00", actor: "Jean Dupont" },
  { id: "2", type: "EMAIL", content: "Envoi de la brochure tarifaire.", date: "2023-12-20T11:30:00", actor: "System" },
  { id: "3", type: "STATUS_CHANGE", content: "Passé de NEW à FOLLOW_UP", date: "2023-12-22T09:00:00", actor: "Jean Dupont" },
];

export const DEMO_EVENTS = [
  {
    id: "1",
    title: "Leçon - Alice Martin",
    start: "2023-12-22T09:00:00",
    end: "2023-12-22T11:00:00",
    status: "CONFIRMED",
    studentName: "Alice Martin",
    instructorName: "Jean Moniteur",
  },
  {
    id: "2",
    title: "Leçon - Bob Durand",
    start: "2023-12-22T14:00:00",
    end: "2023-12-22T16:00:00",
    status: "PLANNED",
    studentName: "Bob Durand",
    instructorName: "Jean Moniteur",
  },
];

