// src/App.jsx
import React from 'react';
import JobDescriptionForm from './components/JobDescriptionForm';

const App = () => {
  return (
    <div className="App">
      <h1 className="text-2xl font-bold mb-4">AI-Recruiter</h1>
      <JobDescriptionForm />
    </div>
  );
};

export default App;
