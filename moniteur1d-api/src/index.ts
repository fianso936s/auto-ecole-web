import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import dotenv from "dotenv";
import { createServer } from "http";
import { initSocket } from "./lib/socket.js";
import { errorHandler } from "./middleware/error.js";
import prisma from "./lib/prisma.js";
import bcrypt from "bcrypt";
import authRoutes from "./routes/auth.routes.js";
import offerRoutes from "./routes/offer.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import preRegistrationRoutes from "./routes/preRegistration.routes.js";
import documentRoutes from "./routes/document.routes.js";
import billingRoutes from "./routes/billing.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import jobRoutes from "./routes/job.routes.js";
import studentRoutes from "./routes/student.routes.js";
import instructorRoutes from "./routes/instructor.routes.js";
import vehicleRoutes from "./routes/vehicle.routes.js";
import availabilityRoutes from "./routes/availability.routes.js";
import lessonRoutes from "./routes/lesson.routes.js";
import calendarRoutes from "./routes/calendar.routes.js";
import requestRoutes from "./routes/request.routes.js";
import skillRoutes from "./routes/skill.routes.js";
import crmRoutes from "./routes/crm.routes.js";
import settingRoutes from "./routes/setting.routes.js";
import examRoutes from "./routes/exam.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

const allowedCorsOrigins: Array<string | RegExp> = [
  "https://www.moniteur1d.com",
  "https://moniteur1d.com",
  "http://localhost:5173",
  /\.moniteur1d\.com$/,
];

// Permet de piloter l'origine principale via variable d'env (utile en déploiement)
if (process.env.FRONTEND_URL) {
  allowedCorsOrigins.unshift(process.env.FRONTEND_URL);
}

// Global Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Trop de requêtes effectuées depuis cette adresse IP, réessayez plus tard.",
  standardHeaders: true,
  legacyHeaders: false,
});

// Middlewares
app.use(limiter);
app.use(helmet());
app.use(cors({
  origin: allowedCorsOrigins,
  credentials: true
}));
app.use(cookieParser());
app.use(hpp() as any);

// Webhook route must come BEFORE express.json()
app.use("/billing/webhook", express.raw({ type: "application/json" }), (req, res, next) => {
  // Pass to billing routes specifically
  next();
});

app.use(express.json({ limit: "10kb" })); // Protection against large payloads

// Routes
app.use("/auth", authRoutes);
app.use("/offers", offerRoutes);
app.use("/contact", contactRoutes);
app.use("/preinscription", preRegistrationRoutes);
app.use("/documents", documentRoutes);
app.use("/billing", billingRoutes);
app.use("/invoices", invoiceRoutes);
app.use("/jobs", jobRoutes);
app.use("/students", studentRoutes);
app.use("/instructors", instructorRoutes);
app.use("/vehicles", vehicleRoutes);
app.use("/availability", availabilityRoutes);
app.use("/lessons", lessonRoutes);
app.use("/calendar", calendarRoutes);
app.use("/lesson-requests", requestRoutes);
app.use("/skills", skillRoutes);
app.use("/crm", crmRoutes);
app.use("/settings", settingRoutes);
app.use("/exams", examRoutes);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK", timestamp: new Date().toISOString() });
});

// Basic route
app.get("/", (req, res) => {
  res.send("Moniteur1D API is running");
});

// Error handling - must be after all routes
app.use(errorHandler);

const httpServer = createServer(app);
initSocket(httpServer);

const ensureAdminCreated = async () => {
  try {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@moniteur1d.fr";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      console.log("⚠️ ADMIN_PASSWORD non configuré. Création admin automatique ignorée.");
      return;
    }

    const adminExists = await prisma.user.findFirst({
      where: { role: "ADMIN" }
    });

    if (!adminExists) {
      console.log("🚀 Tentative de création du compte admin unique...");
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword,
          role: "ADMIN",
          profile: {
            create: {
              firstName: "Admin",
              lastName: "System",
            }
          }
        }
      });
      console.log("✅ Compte admin créé avec succès au démarrage.");
    }
  } catch (error) {
    console.error("❌ Erreur lors de la vérification/création de l'admin :", error);
  }
};

httpServer.listen(PORT, async () => {
  console.log(`Server is running on port ${PORT}`);
  await ensureAdminCreated();
});

