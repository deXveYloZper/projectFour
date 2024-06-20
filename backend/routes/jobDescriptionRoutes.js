import express from 'express';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({ dest: 'uploads/' });

router.post('/job-description', upload.single('file'), (req, res) => {
    const jobDescription = req.body.jobDescription;

    const pythonProcess = spawn('python', [
        path.join(__dirname, '../openai_processing.py'),
        jobDescription
    ]);

    let pythonOutput = '';
    pythonProcess.stdout.on('data', (data) => {
        pythonOutput += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).json({ error: 'An error occurred during processing.' });
    });

    pythonProcess.on('close', (code) => {
        if (code === 0) {
            try {
                const result = JSON.parse(pythonOutput);
                res.json({ requirements: result }); 
            } catch (error) {
                console.error("Error parsing JSON:", error);
                res.status(500).json({ error: 'Invalid response from Python script.' });
            }
        } else {
            res.status(500).json({ error: 'Python script exited with an error.' });
        }
    });
});

export default router;
