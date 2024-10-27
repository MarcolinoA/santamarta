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
        process.env.CLIENT_URL, // Origine del frontend (es. santamarta.vercel.app)
        "http://localhost:3000",
        // Aggiungi altre origini consentite se necessario
      ];

      // Se non c'è 'origin' (ad esempio, richieste fatte dallo stesso dominio)
      // o se l'origine è consentita, esegui il callback senza errori.
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        // Se l'origine non è consentita, blocca la richiesta
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Metodi consentiti
    credentials: true, // Permetti l'invio di cookie e altre credenziali
    allowedHeaders: ["Content-Type", "Authorization"], // Intestazioni consentite
    preflightContinue: false, // Blocca il passaggio successivo per le richieste preflight (OPTIONS)
    optionsSuccessStatus: 204, // Risposta per le richieste preflight con successo
  })
);

// Gestione delle richieste preflight OPTIONS
app.options("*", cors()); // Applica CORS a tutte le rotte per preflight

app.use(express.json());
app.use(cookieParser());

/*Proxy middleware per inoltrare le richieste a un altro server (ad esempio un'API)
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
*/

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
        : "http://localhost:3000",
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

app.get("/test", (req, res) => {
  res.status(200).send("Server is up and running!");
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
