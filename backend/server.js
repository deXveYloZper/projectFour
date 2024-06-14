import express from 'express';
import cors from 'cors';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const app = express();
const port = 5000;

// Get the directory name of the current module file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware to handle JSON and CORS
app.use(express.json());
app.use(cors());

// Set up multer for file handling
const upload = multer({ dest: 'uploads/' });

// Simple route to check if the server is running
app.get('/', (req, res) => {
  res.send('Backend server is running!');
});

// Endpoint to handle job description submissions
app.post('/api/job-description', upload.single('file'), (req, res) => {
  const jobDescription = req.body.jobDescription;

  // Call the Python script for NLP processing
  const pythonProcess = spawn('python', [path.join(__dirname, 'nlp_processing.py'), jobDescription]);

  let pythonOutput = '';

  pythonProcess.stdout.on('data', (data) => {
    pythonOutput += data.toString();
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`stderr: ${data}`);
    if (!res.headersSent) {
      res.status(500).send({ error: 'Error processing job description' });
    }
  });

  pythonProcess.on('close', (code) => {
    if (code !== 0) {
      if (!res.headersSent) {
        res.status(500).send({ error: 'Error processing job description' });
      }
    } else {
      try {
        const result = JSON.parse(pythonOutput);
        res.send({ message: 'Job description received', requirements: result });
      } catch (error) {
        if (!res.headersSent) {
          res.status(500).send({ error: 'Error parsing response from Python script' });
        }
      }
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
