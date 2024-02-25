import React, { useState, useEffect } from 'react';
import './JobListings.css';
import './App.css';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { Skeleton } from 'primereact/skeleton';
import { Link } from 'react-router-dom';



const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedJobIds, setExpandedJobIds] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [locations, setLocations] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedFunction, setSelectedFunction] = useState(null);
  const [functions, setFunctions] = useState([]);
  const [skeletonLoading, setSkeletonLoading] = useState(true);

  useEffect(() => {
    fetch('https://demo.jobsoid.com/api/v1/jobs')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data)) {
          setJobs(data);
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching job listings:', error);
        setLoading(false);
      });

    fetch('https://demo.jobsoid.com/api/v1/locations')
      .then(response => response.json())
      .then(data => {
        setLocations(data);
      })
      .catch(error => {
        console.error('Error fetching locations:', error);
      });

    fetch('https://demo.jobsoid.com/api/v1/departments')
      .then(response => response.json())
      .then(data => {
        setDepartments(data);
      })
      .catch(error => {
        console.error('Error fetching departments:', error);
      });

    fetch('https://demo.jobsoid.com/api/v1/functions')
      .then(response => response.json())
      .then(data => {
        setFunctions(data);
      })
      .catch(error => {
        console.error('Error fetching functions:', error);
      });

    const savedSearchQuery = localStorage.getItem('searchQuery');
    const savedLocation = JSON.parse(localStorage.getItem('selectedLocation'));
    const savedDepartment = JSON.parse(localStorage.getItem('selectedDepartment'));
    const savedFunction = JSON.parse(localStorage.getItem('selectedFunction'));


    setSearchQuery(savedSearchQuery || '');
    setSelectedLocation(savedLocation || null);
    setSelectedDepartment(savedDepartment || null);
    setSelectedFunction(savedFunction || null);
  }, []);

  useEffect(() => {

    // Store data in localStorage whenever it changes
    localStorage.setItem('searchQuery', searchQuery);
    localStorage.setItem('selectedLocation', JSON.stringify(selectedLocation));
    localStorage.setItem('selectedDepartment', JSON.stringify(selectedDepartment));
    localStorage.setItem('selectedFunction', JSON.stringify(selectedFunction));

    // ... Update filteredJobs based on search and dropdown selections ...
  }, [searchQuery, selectedLocation, selectedDepartment, selectedFunction]);

  const handleFunctionChange = (e) => {
    setSelectedFunction(e.value);
  };

  const handleDepartmentChange = (e) => {
    setSelectedDepartment(e.value);
  };

  useEffect(() => {
    const skeletonTimer = setTimeout(() => {
      setSkeletonLoading(false);
    }, 3000);

    return () => {
      clearTimeout(skeletonTimer);
    };
  }, []);


  const extractJobOverview = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');
    const jobOverview = doc.getElementById('job-overview');
    return jobOverview ? jobOverview.innerHTML : '';
  };

  const toggleJobExpansion = (jobId) => {
    if (expandedJobIds.includes(jobId)) {
      setExpandedJobIds(expandedJobIds.filter(id => id !== jobId));
    } else {
      setExpandedJobIds([...expandedJobIds, jobId]);
    }
  };
  const handleLocationChange = (e) => {
    setSelectedLocation(e.value);
  };
  const handleClearLocation = () => {
    setSelectedLocation(null);
  };
  const filteredJobs = jobs.filter((job) =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
    (!selectedLocation || job.location.state === selectedLocation.title) &&
    (!selectedDepartment || job.department === selectedDepartment.title) &&
    (!selectedFunction || job.function === selectedFunction.title)
  );
  return (
    <div>
      <div className="a" style={{ backgroundColor: 'rgb(237,241,255)' }}>

        <nav style={{ backgroundColor: 'rgba(0,0,0,0)'}}>
          <div className="nav-wrapper">
            <i className="material-icons left" style={{ backgroundColor: '#0973f8' }}>Tushar Revankar</i> {/* Work icon */}
          </div>
        </nav>
        <div className="container">
          <h2>Job Search Platform</h2>
          <div className="search-bar">

            <input
              type="text"
              placeholder="Search Jobs Opening ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <span className="clear-icon" onClick={() => setSearchQuery('')}>
                <i className="pi pi-times" />
              </span>
            )}
          </div>
          <div className="dropdown-container">
            <Dropdown
              value={selectedLocation}
              options={locations}
              optionLabel="title"
              placeholder="Select a location , country , state "
              onChange={handleLocationChange}
              className="location-dropdown"
              style={{ width: '96%' }}
            />
            {selectedLocation && (
              <Button
                className="p-button-secondary clear-button"
                icon="pi pi-times"
                onClick={handleClearLocation}
                style={{ height: '40px' }}
              />
            )}
          </div>
          {/* Department Dropdown */}
          <div className="dropdown-container">
            <Dropdown
              value={selectedDepartment}
              options={departments}
              optionLabel="title"
              placeholder="Select a department"
              onChange={handleDepartmentChange}
              style={{ width: '96%' }}
            />
            {selectedDepartment && (
              <Button
                className="p-button-secondary clear-button"
                icon="pi pi-times"
                onClick={() => setSelectedDepartment(null)}
                style={{ height: '40px' }}
              />
            )}
          </div>
          {/* Function Dropdown */}
          <div className="dropdown-container">
            <Dropdown
              value={selectedFunction}
              options={functions}
              optionLabel="title"
              placeholder="Select a function"
              onChange={handleFunctionChange}
              style={{ width: '96%' }}
            />
            {selectedFunction && (
              <Button
                className="p-button-secondary clear-button"
                icon="pi pi-times"
                onClick={() => setSelectedFunction(null)}
                style={{ height: '40px' }}
              />
            )}
          </div>

          <div className="card-container">
            <div className="p-grid p-col-gap">
              {loading ? (
                Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="p-col-12 p-md-6 p-lg-4">
                    <div className="p-card p-skeleton">
                      <div className="p-card-body">
                        <Skeleton width="100%" height="1.5rem" style={{ marginBottom: '0.5rem' }} />
                        <Skeleton width="80%" height="1.5rem" style={{ marginBottom: '0.5rem' }} />
                        <Skeleton width="70%" height="1.5rem" style={{ marginBottom: '1rem' }} />
                        <Skeleton width="60%" height="1.5rem" style={{ marginBottom: '0.5rem' }} />
                        <Skeleton width="100%" height="5rem" style={{ marginBottom: '1rem' }} />
                        <Skeleton width="50%" height="2rem" style={{ marginBottom: '1rem' }} />
                        <Skeleton width="60%" height="1.5rem" />
                      </div>
                    </div>
                  </div>
                ))
              ) : filteredJobs.length === 0 ? (
                <p>No records found.</p>
              ) : (
                filteredJobs.map(job => (
                  <div key={job.id} className="p-col-12 p-md-6 p-lg-4">
                    <Card title={job.title} className="p-shadow-3">
                      <p><i className="pi pi-briefcase" /> <strong>Company:</strong> {job.company}</p>
                      <p><i className="pi pi-users" /> <strong>Positions:</strong> {job.positions}</p>
                      <p><i className="pi pi-map-marker" /> <strong>Location:</strong> {job.location.city}, {job.location.state}, {job.location.country}</p>
                      <p><i className="pi pi-calendar" /> <strong>Posted Date:</strong> {new Date(job.postedDate).toLocaleDateString()}</p>
                      {/* Display truncated job overview */}
                      <div
                        className={expandedJobIds.includes(job.id) ? 'expanded' : 'collapsed'}
                        dangerouslySetInnerHTML={{
                          __html: expandedJobIds.includes(job.id)
                            ? extractJobOverview(job.description)
                            : extractJobOverview(job.description).substring(0, 150) + '...'
                        }}
                      />
                      {extractJobOverview(job.description) && (
                        <div style={{ marginBottom: '1rem' }}>
                          <Button
                            label={expandedJobIds.includes(job.id) ? 'Show Less' : 'Show More'}
                            className="p-button-text"
                            onClick={() => toggleJobExpansion(job.id)}
                          />
                        </div>
                      )}
                      {/* Display buttons next to each other with a little space */}
                      <div style={{ display: 'flex' }}>
                        <a
                          href={job.applyUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-button p-button-success shadow-button"

                          style={{ marginRight: '0.5rem', display: 'flex', alignItems: 'center', textDecoration: 'none', backgroundColor: '#0973f8', }}


                        >
                          <i className="pi pi-check" style={{ marginRight: '0.3rem' }} /> Apply
                        </a>
                        <Link
                          to={`/view/${job.id}`}
                          className="p-button p-button-secondary shadow-button"
                          style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}
                        >
                          <i className="pi pi-eye" style={{ marginRight: '0.3rem' }} /> View
                        </Link>
                      </div>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobListings;
