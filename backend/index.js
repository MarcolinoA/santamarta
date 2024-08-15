import express from 'express';
import cors from 'cors'
import mongoose from 'mongoose';
import { PORT, mongoDBURL } from './config.js';
import homeImageRoute from "./routes/imageRoute.js";
import usersRoute from "./routes/usersRoute.js";
const app = express();

app.use(cors());
app.use(express.json());

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