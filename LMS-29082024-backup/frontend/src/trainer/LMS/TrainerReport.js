import React, { useState, useEffect } from 'react';
import { addTrainerReportApi, getTrainers_topic_API } from '../../api/endpoints';
import { Col, Row ,Form} from 'react-bootstrap';
import ErrorModal from '../../Components/auth/ErrorModal';
function TrainerReportForm({ username }) {
    const [formData, setFormData] = useState({
        course_schedule_id:null,
        topic: '', // Topic selected
        sub_topic: '', // Subtopic selected
        no_of_question_solved: '',
        comments: '',
        status: '', // Default option
        student_feedback: '', // Default option
        infrastructure_feedback: '', // Default option
        remarks: ''
      });
      const [error, setError] = useState(null);
      const [showError, setShowError] = useState(false);
      const [errorMessage, setErrorMessage] = useState('');
     
      const handleCloseError = () => {
        setShowError(false);
      };
    
      const [topics, setTopics] = useState([]);
      const [selectedTopic, setSelectedTopic] = useState(null);
      const [subtopics, setSubtopics] = useState([]);
      const [activities_done, setActive] = useState(false);
      const [courseScheduleId, setCourseScheduleId] = useState(null); // Store the course_schedule_id
      
      console.log("username", username);
    
      // Fetch topics and subtopics based on the username when the component mounts
      useEffect(() => {
        getTrainers_topic_API(username)
          .then((data) => {
            console.log('Fetched data:', data); // Log the data fetched from the API
            const topicsData = data.map((item) => ({
              id: item.course_schedule_id, // Assuming this is the course_schedule_id
              value: item.topic,
              label: item.topic,
              subTopics: item.sub_topic // Store subtopics within the topic object
            }));
            console.log('Formatted topics data:', topicsData); // Log the formatted topics data
            setTopics(topicsData);
          })
          .catch((error) => console.error('Error fetching topics:', error));
      }, [username]);
    
      // Handle form input changes
      const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log('Input change detected:', name, value); // Log the input name and value
        setFormData((prevFormData) => ({
          ...prevFormData,
          [name]: value
        }));
      };
    
      // Handle topic selection
      const handleTopicChange = (e) => {
        const selectedTopic = topics.find((topic) => topic.value === e.target.value);
        console.log('Selected topic:', selectedTopic); // Check selected topic object
    
        // If subTopics is not an array, convert it into an array
        const subTopics = selectedTopic && Array.isArray(selectedTopic.subTopics)
          ? selectedTopic.subTopics
          : selectedTopic && selectedTopic.subTopics
            ? [selectedTopic.subTopics] // Convert to array if it's a single value
            : [];
      
        console.log('Subtopics:', subTopics); // Log the subtopics to verify
    
        setSelectedTopic(selectedTopic);
        setSubtopics(subTopics);
    
        // Set the course_schedule_id for the selected topic
        setCourseScheduleId(selectedTopic ? selectedTopic.id : null);
        console.log("selectedTopic.id",selectedTopic.id)
    
        setFormData((prevFormData) => ({
          ...prevFormData,
          topic: selectedTopic ? selectedTopic.value : '',
          sub_topic: '' // Reset subtopic when topic changes
        }));
      };
    
      // Handle subtopic selection
      const handleSubTopicChange = (e) => {
        console.log('Selected subtopic value:', e.target.value); // Log the selected subtopic value
        setFormData((prevFormData) => ({
          ...prevFormData,
          sub_topic: e.target.value
        }));
      };
    
     
      // Assuming the API returns data with a structure that includes the `id` field on success
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        console.log("Form submission started");
        console.log("Form data before processing:", formData);
      
        const trainerReportData = {
          ...formData,
          course_schedule_id: courseScheduleId,
          activities_done,
        };
      
        console.log("Final data to submit:", trainerReportData);
      
        try {
          console.log("Attempting to submit data to the API...");
          const result = await addTrainerReportApi(trainerReportData);
      
          console.log("API response:", result);
      
          // Check if the response contains the expected `id` or any other success criteria
          if (result.id) {
            console.log("Form submitted successfully");
            setErrorMessage('Form submitted successfully');
            setShowError(true);
      
            // Reset form data and other states after successful submission
            setFormData({
              course_schedule_id: null,
              topic: '',
              sub_topic: '',
              no_of_question_solved: '',
              comments: '',
              status: '',
              student_feedback: '',
              infrastructure_feedback: '',
              remarks: ''
            });
            setSelectedTopic(null);
            setSubtopics([]);
            setCourseScheduleId(null);
            setActive(false);
          } else {
            console.log("Form submission failed - API returned an error");
            setErrorMessage('Form submission failed - API returned an error');
            setShowError(true);
          }
        } catch (error) {
          console.error("Error submitting form:", error);
          setErrorMessage(`Error submitting form: ${error.message}`);
          setShowError(true);
        }
      
        console.log("Form submission completed");
      };
      
      
  return (
    <div className='form-ques'>
      <h5>Trainer Report Form</h5>
      <form onSubmit={handleSubmit} className='form-ques'>
        <Row md={12}>
          <Col>
            <div>
              <label htmlFor="topic" className='label5-ques'>Topic:</label><p></p>
              <select
                id="topic"
                name="topic"
                className="input-ques"
                value={formData.topic}
                onChange={handleTopicChange}
                required
              >
                <option value="">Select Topic</option>
                {topics.map((topic) => (
                  <option key={topic.value} value={topic.value}>
                    {topic.label}
                  </option>
                ))}
              </select>
            </div>
          </Col>
          <Col>
            <div>
              <label htmlFor="sub_topic" className='label5-ques'>Subtopic:</label><p></p>
              <select
  id="sub_topic"
  name="sub_topic"
  className="input-ques"
  value={formData.sub_topic}
  onChange={handleSubTopicChange}
  required
>
  <option value="">Select Subtopic</option>
  {subtopics.map((subTopic, index) => (
    <option key={index} value={subTopic}>
      {subTopic}
    </option>
  ))}
</select>

            </div>
          </Col>
          <Col>
            <div>
              <label htmlFor="no_of_question_solved" className='label5-ques'>Number of Questions Solved:</label>
              <p></p>
              <input
                type="number"
                autoComplete='off'
                min='0'
               
                className="input-ques"
                id="no_of_question_solved"
                name="no_of_question_solved"
                value={formData.no_of_question_solved}
                onChange={handleInputChange}
                required
              />
            </div>
          </Col>

        </Row><p></p>

        <Row md={12}>
        <Col>
            <div>
              <label htmlFor="status" className='label5-ques'>Status:</label><p></p>
              <select
                id="status"
                name="status"
                className="input-ques"
                value={formData.status}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Yet Not Started">Yet Not Started</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </Col>
         
          <Col>
            <div>
              <label htmlFor="comments" className='label5-ques'>Comments:</label><p></p>
              <input
                id="comments"
                className="input-ques"
                name="comments"
                autoComplete='off'
                value={formData.comments}
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col>
          <div controlId="activities_done">
                    <label className="label5-ques">Activities Done</label>
                    <p></p>
                    <Form.Check
  type="switch"
  className="custom-switch"
  id="custom-switch"
  label=""
  checked={activities_done}
  onChange={(e) => setActive(e.target.checked)}
/>

                  </div>
          </Col>
        
        </Row><p></p>

        

        <Row md={12}>
          <Col>
            <div>
              <label htmlFor="student_feedback" className='label5-ques'>Student Feedback:</label><p></p>
              <select
                id="student_feedback"
                name="student_feedback"
                className="input-ques"
                value={formData.student_feedback}
                onChange={handleInputChange}
                required
              >
                <option value="">Select...</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </Col>

          <Col>
            <div>
              <label htmlFor="infrastructure_feedback" className='label5-ques'>Infrastructure Feedback:</label>
              <p></p>             
               <select
                id="infrastructure_feedback"
                name="infrastructure_feedback"
                className="input-ques"
                value={formData.infrastructure_feedback}
                onChange={handleInputChange}
                required
              >
                <option value="">Select...</option>
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Average">Average</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
          </Col>
        

      
          <Col>
            <div>
              <label htmlFor="remarks" className='label5-ques'>Remarks:</label><p></p>
              <input
                id="remarks"
                name="remarks"
                className="input-ques"
                value={formData.remarks}
                autoComplete='off'
                onChange={handleInputChange}
              />
            </div>
          </Col>
        </Row><p style={{height:"50px"}}></p>
<Row>
    <Col></Col>
    <Col>
    <button type="submit" className='button-ques-save' style={{marginLeft:"100px"}}>Submit</button></Col>
    <Col></Col>
</Row>
        
      </form>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

        </div>
  );
}

export default TrainerReportForm;
