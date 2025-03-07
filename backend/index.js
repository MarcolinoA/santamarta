import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import session from "express-session";
import MongoStore from "connect-mongo";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { initScheduledJobs } from "./util/cronJobs.js";

// Carica le variabili d'ambiente
dotenv.config(); // Assicurati che questo sia eseguito per primo

import { PORT, mongoDBURL } from "./config.js";
import homeImageRoute from "./routes/imageRoute.js";
import usersRoute from "./routes/usersRoute.js";
import OTPRoutes from "./domains/otp/routes.js";
import devRoutes from "./routes/DevRoutes.js";

// Crea un'istanza dell'app Express
const app = express();

// Inizializza i lavori pianificati
initScheduledJobs();

// Configurazione CORS
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://santamarta.vercel.app'  // aggiungi il dominio di produzione
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Gestione delle richieste preflight OPTIONS
app.options("*", cors()); // Applica CORS a tutte le rotte per preflight

// Middleware per il parsing del JSON
app.use(express.json());
app.use(cookieParser());

// Configurazione della sessione
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
      domain: process.env.FRONTEND_URL
        ? new URL(process.env.FRONTEND_URL).hostname
        : undefined,
      secure: process.env.NODE_ENV === "production", // Usa solo HTTPS in produzione
      httpOnly: true, // Il cookie non è accessibile via JS nel client
      sameSite: "None", // Necessario per inviare i cookie con CORS
      maxAge: 24 * 60 * 60 * 1000, // Durata cookie: 24 ore
    },
  })
);

// Configurazione delle route
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

// Connessione al database e avvio del server
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