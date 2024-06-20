import express from 'express';
import cors from 'cors';
import jobDescriptionRoutes from './routes/jobDescriptionRoutes.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

app.use('/api', jobDescriptionRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
