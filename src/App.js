import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import JobListings from './JobListings';
import ViewJobDetails from './ViewJobDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<JobListings />} />
        <Route path="/view/:jobId" element={<ViewJobDetails />} />
      </Routes>
    </Router>
  );
};

export default App;
