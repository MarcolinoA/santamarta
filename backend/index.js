import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import cookieParser from 'cookie-parser';
import { PORT, mongoDBURL } from './config.js';
import homeImageRoute from "./routes/imageRoute.js";
import usersRoute from "./routes/usersRoute.js";
import dotenv from 'dotenv';
dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3001', // Cambia con l'URL del tuo client
  credentials: true // Permette l'invio di cookie
}));
app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: process.env.SECRET_KEY || 'default-secret-key',
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: mongoDBURL,
    collectionName: 'sessions'
  }),
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Assicura che il cookie sia trasmesso solo su HTTPS in produzione
    // httpOnly: true, // Non accessibile tramite JavaScript
    // sameSite: 'strict', // Maggiore sicurezza per prevenire attacchi CSRF
    maxAge: 24 * 60 * 60 * 1000 // 1 giorno
  }
}));

app.use('/homeImage', homeImageRoute);
app.use('/users', usersRoute);

app.get('/', (request, response) => {
  console.log(request);
  return response.status(234).send('Welcome to Santamarta site');
});

mongoose
  .connect(mongoDBURL)
  .then(() => {
    console.log('App connected to database');
    app.listen(PORT, () => {
      console.log(`App is listening to port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });