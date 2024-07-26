import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap'; 
import { getCourseContentFeedbackApi } from '../../api/endpoints';

const StudentFeedback = () => {
    const [feedback, setFeedback] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        getFeedbacks();
    }, []);

    const getFeedbacks = () => {
        getCourseContentFeedbackApi()
            .then(data => {
                setFeedback(data);
                setCurrentIndex(0); // Reset index when new data is fetched
                console.log('Feedback data fetched:', data);
            })
            .catch(error => console.error('Error fetching feedback:', error));
    };

    const handleNext = () => {
        if (currentIndex < feedback.length - 1) {
            setCurrentIndex(prevIndex => prevIndex + 1);
            console.log('Next button clicked, currentIndex:', currentIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(prevIndex => prevIndex - 1);
            console.log('Previous button clicked, currentIndex:', currentIndex - 1);
        }
    };

    return (
        <div className='form-ques'>
            <h3>Student Feedback</h3>
            {feedback.length > 0 ? (
                <div>
                    <div>
                        <p><strong>Student Name:</strong> {feedback[currentIndex].student_id}</p>
                        <p><strong>Topic:</strong> {feedback[currentIndex].topic_id}</p>
                        <p><strong>Sub Topic:</strong> {feedback[currentIndex].sub_topic}</p>
                        <p><strong>Trainer Name:</strong> {feedback[currentIndex].trainer_id}</p>
                        <p><strong>Session Date:</strong> {feedback[currentIndex].dtm_session}</p>
                        <p><strong>Feedback:</strong> {feedback[currentIndex].feedback}</p>
                    </div>
                    <div>
                        <Button onClick={handlePrevious} disabled={currentIndex === 0}>
                            Previous
                        </Button>
                        <Button onClick={handleNext} disabled={currentIndex === feedback.length - 1}>
                            Next
                        </Button>
                    </div>
                </div>
            ) : (
                <p>No feedback available</p>
            )}
        </div>
    );
};

export default StudentFeedback;
