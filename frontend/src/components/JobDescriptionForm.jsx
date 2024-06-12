// src/JobDescriptionForm.jsx
import { useState } from 'react';
import axios from 'axios';

const JobDescriptionForm = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('jobDescription', jobDescription);
    if (file) {
      formData.append('file', file);
    }

    try {
      const response = await axios.post('/api/job-description', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting the job description:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center space-y-4 p-4 border rounded shadow-lg">
      <textarea
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        placeholder="Enter job description"
        rows="10"
        cols="50"
        className="w-full max-w-lg p-2 border rounded"
      />
      <input type="file" onChange={handleFileChange} className="w-full max-w-lg" />
      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700">
        Submit
      </button>
    </form>
  );
};

export default JobDescriptionForm;
