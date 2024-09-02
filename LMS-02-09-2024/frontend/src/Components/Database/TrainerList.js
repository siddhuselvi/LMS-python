import React, { useState, useEffect } from 'react';
import { getTrainerApi } from '../../../src/api/endpoints';
import '../../Styles/global.css';
import back from '../../assets/Images/backarrow.png'

import Next from '../../assets/Images/nextarrow.png'
const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [currentTrainerIndex, setCurrentTrainerIndex] = useState(0); // Track the index of the currently displayed trainer
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch trainer data when the component mounts
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await getTrainerApi();
      setTrainers(response); // Set the trainer data to the state
    } catch (error) {
      setError('Failed to fetch trainer data');
      console.error(error);
    }
  };

  // Handle Next and Back navigation
  const nextTrainer = () => {
    if (currentTrainerIndex < trainers.length - 1) {
      setCurrentTrainerIndex(currentTrainerIndex + 1);
    }
  };

  const prevTrainer = () => {
    if (currentTrainerIndex > 0) {
      setCurrentTrainerIndex(currentTrainerIndex - 1);
    }
  };

  // Get the current trainer based on the current index
  const currentTrainer = trainers[currentTrainerIndex];

  return (
    <div className="form-ques">
      <h2>Trainer Details</h2>
      {error && <p>{error}</p>}
      <div className="form-ques">
        {trainers.length > 0 && currentTrainer ? (
          <div className="trainer-card">
            <h3>{currentTrainer.trainer_name}</h3>
            <p><strong>City:</strong> {currentTrainer.city || 'N/A'}</p>
            <p><strong>State:</strong> {currentTrainer.state}</p>
            <p><strong>Qualification:</strong> {currentTrainer.qualification}</p>
            <p><strong>Experience:</strong> {currentTrainer.experience}</p>
            <p><strong>Mobile No:</strong> {currentTrainer.mobile_no}</p>
            <p><strong>Email ID:</strong> {currentTrainer.email_id}</p>
            <p><strong>Skills:</strong> {currentTrainer.skill_id.join(', ')}</p>
            <p><strong>Languages Known:</strong> {currentTrainer.languages_known}</p>
            <p><strong>Bank Name:</strong> {currentTrainer.bank_name}</p>
            <p><strong>IFSC Code:</strong> {currentTrainer.ifsc_code}</p>
            <p><strong>Branch Name:</strong> {currentTrainer.branch_name}</p>
            <p><strong>Account No:</strong> {currentTrainer.account_no}</p>
            {currentTrainer.resume_url && (
              <a href={currentTrainer.resume_url} target="_blank" rel="noopener noreferrer">
                View Resume
              </a>
            )}
            <p><strong>Username:</strong> {currentTrainer.user_name}</p>

            {/* Pagination controls aligned to the right */}
            <div className="pagi-container">
  <button 
    onClick={prevTrainer} 
    disabled={currentTrainerIndex === 0}
    style={{
      backgroundColor: currentTrainerIndex === 0 ? 'f3de59' : '#F1A128', // Gray if disabled, otherwise orange
      cursor: currentTrainerIndex === 0 ? 'not-allowed' : 'pointer' // Change cursor if disabled
    }}
  >
    <img src={back} className='nextarrow' alt="Back Arrow" />
  </button>
  
  <button 
    onClick={nextTrainer} 
    disabled={currentTrainerIndex === trainers.length - 1}
    style={{
      backgroundColor: currentTrainerIndex === trainers.length - 1 ? 'f3de59' : '#F1A128', // Gray if disabled, otherwise orange
      cursor: currentTrainerIndex === trainers.length - 1 ? 'not-allowed' : 'pointer' // Change cursor if disabled
    }}
  >
    <img src={Next} className='nextarrow' alt="Next Arrow" />
  </button>
  
  <p>
    Showing trainer {currentTrainerIndex + 1} of {trainers.length}
  </p>
</div>

          </div>
        ) : (
          <p>No trainers found</p>
        )}
      </div>
    </div>
  );
};

export default TrainerList;
