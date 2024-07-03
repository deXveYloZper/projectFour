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
      console.error('There was an error submitting the job description!', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Enter job description"
          rows="10"
          cols="50"
        />
      </div>
      <div>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default JobDescriptionForm;
