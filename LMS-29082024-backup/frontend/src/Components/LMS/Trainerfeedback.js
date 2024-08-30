import React, { useState, useEffect } from 'react';
import { getTrainerReportApi } from '../../../src/api/endpoints';
import '../../Styles/global.css';
import back from '../../assets/Images/backarrow.png'

import Next from '../../assets/Images/nextarrow.png'
const TrainerFeedback = () => {
  const [feedback, setfeedback] = useState([]);
  const [currentTrainerIndex, setCurrentTrainerIndex] = useState(0); // Track the index of the currently displayed trainer
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch trainer data when the component mounts
    fetchfeedback();
  }, []);

  const fetchfeedback = async () => {
    try {
      const response = await getTrainerReportApi();
      setfeedback(response); // Set the trainer data to the state
    } catch (error) {
      setError('Failed to fetch trainer data');
      console.error(error);
    }
  };

  // Handle Next and Back navigation
  const nextTrainer = () => {
    if (currentTrainerIndex < feedback.length - 1) {
      setCurrentTrainerIndex(currentTrainerIndex + 1);
    }
  };

  const prevTrainer = () => {
    if (currentTrainerIndex > 0) {
      setCurrentTrainerIndex(currentTrainerIndex - 1);
    }
  };

  // Get the current trainer based on the current index
  const currentTrainer = feedback[currentTrainerIndex];

  return (
    <div className="form-ques">
      <h5>Trainers Report</h5>
      {error && <p>{error}</p>}
      <div className="form-ques">
        {feedback.length > 0 && currentTrainer ? (
          <div className="trainer-card">
            <p><strong>College Name:</strong> {currentTrainer.college_name}</p>
            <p><strong>Department:</strong> {currentTrainer.department_name}</p>
            <p><strong>Year:</strong> {currentTrainer.year}</p>
           
            <p><strong>Topic:</strong> {currentTrainer.topic}</p>
            <p><strong>Sub Topic:</strong> {currentTrainer.sub_topic}</p>
            <p><strong>Trainer name:</strong> {currentTrainer.trainer_name}</p>
            <p><strong>Session Date:</strong> {currentTrainer.dtm_of_training}</p>
            <p><strong>Status</strong>{currentTrainer.status}</p>
            <p><strong>Comments</strong>{currentTrainer.comments}</p>
            
            <p><strong>Students Feedback:</strong> {currentTrainer.student_feedback}</p>
            <p><strong>Infrastructure Feedback:</strong> {currentTrainer.infrastructure_feedback}</p>
            <p><strong>Activities Done</strong>{currentTrainer.activities_done}</p>
            <p><strong>No of Question Solved</strong>{currentTrainer.no_of_question_solved}</p>
           
            <p><strong>Remarks:</strong> {currentTrainer.remarks}</p>
           
            
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
    disabled={currentTrainerIndex === feedback.length - 1}
    style={{
      backgroundColor: currentTrainerIndex === feedback.length - 1 ? 'f3de59' : '#F1A128', // Gray if disabled, otherwise orange
      cursor: currentTrainerIndex === feedback.length - 1 ? 'not-allowed' : 'pointer' // Change cursor if disabled
    }}
  >
    <img src={Next} className='nextarrow' alt="Next Arrow" />
  </button>
  
  <p>
    Showing Feedback {currentTrainerIndex + 1} of {feedback.length}
  </p>
</div>

          </div>
        ) : (
          <p>No feedback found</p>
        )}
      </div>
    </div>
  );
};

export default TrainerFeedback;
