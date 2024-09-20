import express from 'express';
import bodyParser from 'body-parser';
import bookRoutes from './routes/bookRoutes';
import dotenv from 'dotenv';
import { initializeDatabase } from './config/database';
import cors from "cors"
dotenv.config();

const app = express();
app.use(cors({
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

app.use(bodyParser.json());
app.use('/api', bookRoutes);
const PORT = process.env.PORT || 5030;
 
initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to initialize the database:', error);
});
