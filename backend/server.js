// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const port = 5000;

// Middleware to handle JSON and CORS
app.use(express.json());
app.use(cors());

// Endpoint to handle job description submissions
app.post('/api/job-description', (req, res) => {
  const { jobDescription } = req.body;
  // Handle job description and file processing here
  res.send({ message: 'Job description received', jobDescription });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
