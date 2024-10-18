import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { initScheduledJobs } from "./util/cronJobs.js";
import { createProxyMiddleware } from "http-proxy-middleware";

// Carica le variabili d'ambiente
dotenv.config(); // Assicurati che questo sia eseguito per primo

import { PORT, mongoDBURL } from "./config.js";
import homeImageRoute from "./routes/imageRoute.js";
import usersRoute from "./routes/usersRoute.js";
import OTPRoutes from "./domains/otp/routes.js";
import devRoutes from "./routes/DevRoutes.js";

// Il resto del tuo codice rimane invariato
const app = express();

// Inizializza i lavori pianificati
initScheduledJobs();

// CORS configuration
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        process.env.CLIENT_URL,
        "https://santamarta.vercel.app",
      ];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Gestione delle richieste preflight OPTIONS
app.options("*", cors());

app.use(express.json());
app.use(cookieParser());

// Proxy middleware per inoltrare le richieste a un altro server (ad esempio un'API)
app.use(
  "/api", // Percorso per cui configurare il proxy
  createProxyMiddleware({
    target: "https://santamarta-backend.onrender.com", // Indirizzo del server backend (o URL dell'API esterna)
    changeOrigin: true,
    pathRewrite: {
      "^/api": "", // Riscrive l'URL rimuovendo '/api' prima di inoltrarlo
    },
  })
);

// Session configuration
app.use(
  session({
    secret: process.env.SECRET_KEY || "default-secret-key",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: mongoDBURL,
      collectionName: "sessions",
    }),
    cookie: {
      domain: process.env.CLIENT_URL
        ? new URL(process.env.CLIENT_URL).hostname
        : "santamarta.vercel.app",
      secure: process.env.NODE_ENV === "production", // Usa solo HTTPS in produzione
      httpOnly: true, // Il cookie non è accessibile via JS nel client
      sameSite: "None", // Necessario per inviare i cookie con CORS
      maxAge: 24 * 60 * 60 * 1000, // Durata cookie: 24 ore
    },
  })
);

// Route configuration
app.use("/homeImage", homeImageRoute);
app.use("/users", usersRoute);
app.use("/otp", OTPRoutes);
app.use("/dev", devRoutes);

// Root endpoint
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Santamarta site");
});

// Database connection and server start
mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log("App connected to database");
    const port = PORT || 5555;
    app.listen(port, () => {
      console.log(`App is listening on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });
