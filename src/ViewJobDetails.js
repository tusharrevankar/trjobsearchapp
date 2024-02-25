import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './ViewJobDetails.css';

const ViewJobDetails = () => {
  const { jobId } = useParams();
  const [jobDetails, setJobDetails] = useState(null);
  const [otherJobs, setOtherJobs] = useState([]);

  useEffect(() => {
    fetch(`https://demo.jobsoid.com/api/v1/jobs/${jobId}`)
      .then(response => response.json())
      .then(data => {
        setJobDetails(data);
      })
      .catch(error => {
        console.error('Error fetching job details:', error);
      });
     // Fetch other jobs for ads
     fetch('https://demo.jobsoid.com/api/v1/jobs')
     .then(response => response.json())
     .then(data => {
       setOtherJobs(data);
     })
     .catch(error => {
       console.error('Error fetching other jobs:', error);
     });
 }, [jobId]);

  if (!jobDetails) {
    return <p>Loading...</p>;
  }

  const shareUrl = `https://demo.jobsoid.com/JobDetails/${jobId}`;
  const shareText = `Check out this job: ${jobDetails.title} at ${jobDetails.company}`;


  return (
    <div className='container'>
      <div className='card'>
        <div className="job-details">
          {/* Title and Location Section */}
          <div className="title-section">
            <h2 className="job-title">{jobDetails.title}</h2>
            <p className="location">
              <i className="pi pi-map-marker location-icon" />
              {jobDetails.location && jobDetails.location.city},{' '}
              {jobDetails.location && jobDetails.location.state},{' '}
              {jobDetails.location && jobDetails.location.country}
            </p>
          </div>

          {/* Job Content Section */}
          <div className="job-content">
            <div className="info-section">
              <strong className="posted-date">
                Posted Date: {new Date(jobDetails.postedDate).toLocaleDateString()}
              </strong>
              <strong className="positions">Positions: {jobDetails.positions}</strong>
              <strong className="location">
                <i className="pi pi-map-marker location-icon" />
                Location: {jobDetails.location && jobDetails.location.city},{' '}
                {jobDetails.location && jobDetails.location.state},{' '}
                {jobDetails.location && jobDetails.location.country}
              </strong>
            </div>

            {/* Job Description */}
            <div className="description-section">
              <div dangerouslySetInnerHTML={{ __html: jobDetails.description }} />
              <a href={jobDetails.applyUrl} target="_blank" rel="noopener noreferrer" className="apply-button">
                Apply Now
              </a>
            </div>

                  {/* Ads Section */}
      <div className="ads-section">
        <h3>Other Job Openings</h3>
        {otherJobs.map(adJob => (
          <div key={adJob.id} className="ad-job">
            <a href={`/view/${adJob.id}`} className="ad-job-title">
              {adJob.title}
            </a>
            <p className="ad-job-location">
            <i className="pi pi-map-marker location-icon" />
              {adJob.location && adJob.location.city},{' '}
              {adJob.location && adJob.location.state}
            </p>
          </div>
        ))}
      </div>
    


            {/* Social Media Share */}
            <div className="share-section align justify-content-between">
              <h3>Share this job:</h3>
              <div className="social-icons">
                <a href={`https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareText}`} target="_blank" rel="noopener noreferrer">
                  <i className="pi pi-twitter" />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`} target="_blank" rel="noopener noreferrer">
                  <i className="pi pi-facebook" />
                </a>
                <a href={`https://www.linkedin.com/shareArticle?url=${shareUrl}&title=${shareText}`} target="_blank" rel="noopener noreferrer">
                  <i className="pi pi-linkedin" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default ViewJobDetails;
