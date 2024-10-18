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

// Il resto del tuo codice rimane invariato
const app = express();

// Inizializza i lavori pianificati
initScheduledJobs();

// CORS configuration
app.use(
	cors({
		origin: process.env.CLIENT_URL || "https://santamarta-frontend.vercel.app",
		methods: ['GET', 'POST', 'PUT', 'DELETE'],
		credentials: true, // Permette l'invio di cookie
	})
);

app.use(express.json());
app.use(cookieParser());

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
			domain: process.env.CLIENT_URL || "https://santamarta-frontend.vercel.app",
			secure: true,
			httpOnly: true,
			sameSite: "None",
			maxAge: 24 * 60 * 60 * 1000,
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
