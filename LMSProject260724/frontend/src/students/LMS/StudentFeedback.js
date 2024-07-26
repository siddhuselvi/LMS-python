import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

import { addCourseContentFeedbackApi, getcollegeApi, getcandidatesApi,  getTrainerApi,gettopicApi,  getcoursemasterApi } from '../../api/endpoints';
import ErrorModal from '../../Components/auth/ErrorModal';
import Select from 'react-select';
import '../../Styles/global.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datetime/css/react-datetime.css";

//import ErrorModal from '../../Components/auth/ErrorModal';
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#39444e',
        color: '#fff', // Text color
        borderColor: state.isFocused ? '' : '#ffff', // Border color on focus
        boxShadow: 'none', // Remove box shadow
        '&:hover': {
            borderColor: state.isFocused ? '#ffff' : '#ffff' // Border color on hover
        },
        '&.css-1a1jibm-control': {
            // Additional styles for the specific class
        },
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px', // Smaller font size

            width: '70%'
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffff', // Text color for selected value
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px' // Smaller font size
        }
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#39444e' : state.isFocused ? '#39444e' : '#39444e',
        color: '#ffff', // Text color
        '&:hover': {
            backgroundColor: '#39444e', // Background color on hover
            color: '#ffff' // Text color on hover
        },
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px',// Smaller font size
            width: '70%'
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#39444e',
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px' // Smaller font size
        }
    })
};
const StudentFeedback = () => {
    const [sudent, setsudent] = useState([]);
    const [topic, setTopic] = useState([]);
    const [college, setCollege] = useState([]);
  
    const [courseName, setCourseName] = useState([]);
    const [trainer, settrainer] = useState([]);
   

    const [selectedstudent, setSelectedstudent] = useState(null);
    const [selectedtopic, setSelectedtopic] = useState(null);
 
    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState(null);
    const [selectedtrainer, setSelectedtrainer] = useState(null);
  
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dtmValidity, setDtmValidity] = useState(null);

    const handleCloseError = () => {
      setShowError(false);
  };
    useEffect(() => {
        getcollegeApi()
            .then(data => {
                setCollege(data.map(item => ({ value: item.id, label: item.college })));
            })
            .catch(error => console.error('Error fetching College:', error));

        //Fetch Tests  
        getcandidatesApi()
            .then(data => {
                setsudent(data.map(item => ({ value: item.id, label: item.students_name })));
            })
            .catch(error => console.error('Error fetching tests  :', error));

      

        //Fetch trainer  
        getTrainerApi()
            .then(data => {
                console.log("trainer data:", data); // Log received data
                settrainer(data.map(item => ({ value: item.id, label: item.trainer_name })));
            })
            .catch(error => console.error('Error fetching  trainer :', error));


        //Fetch Test types  
       gettopicApi()
            .then(data => {
                console.log("Test Types data:", data); // Log received data
                setTopic(data.map(item => ({ value: item.id, label: item.topic })));
            })
            .catch(error => console.error('Error fetching test types:', error));


        //Fetch course  
       // getcoursemasterApi()
           // .then(data => {
               // console.log("Received data:", data); // Log received data
                //setCourseName(data.map(item => ({ value: item.id, label: item.course_name })));
           // })
           // .catch(error => console.error('Error fetching course Names:', error));

    }, []);
    const studentId = selectedstudent ? selectedstudent.value : null;
    const topicId = selectedtopic ? selectedtopic.value : null;
    const collegeId = selectedCollege ? selectedCollege.value : null;
    const courseNameId = selectedCourseName ? selectedCourseName.value : null;
    const trainerId = selectedtrainer ? selectedtrainer.value : null;
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
    
        const feedbacksadd = {
           
            student_id: studentId,
            topic_id: topicId,
            college_id: collegeId,
           // course_id: courseNameId,
          
            trainer_id: trainerId,
            students_count: formData.get('students'),
           // dtm_session: formData.get('dtm_session'),
            dtm_session: dtmValidity ? moment(dtmValidity).format("YYYY-MM-DD HH:mm:ss") : null,
            feedback: formData.get('feedback'),
           
           
        };
    
        console.log("Result: ", feedbacksadd);
    
        addCourseContentFeedbackApi(feedbacksadd)
            .then((result) => {
                console.log("Success:", result);
                setErrorMessage('Feedback Updated Successfully');
                setShowError(true);
          
               // window.alert("student feedback added successfully");
                setSelectedCourseName(null); // Clear selected item
            })
            .catch((error) => {
                console.error("Failed to Add Data", error);
                alert("Failed to Add. Check console for details.");
            });
    };
    
    
    return (
        <div>
            <div className='form-queslmss'>
                <h5 style={{marginLeft:"20px"}}>Please submit Your Feedback Here!</h5>
               <p></p>
                <Row>
                    <Col>
                        <form onSubmit={handleSubmit} className='form-queslmss'>
                            <Row md={12}>
                               
                                <Col >
                                    <div controlId='student_id'>
                                        <label  className='label6-ques'>Student Name</label><p></p>
                                        <Select
                                            options={sudent}
                                            value={selectedstudent}
                                            onChange={setSelectedstudent}
                                            placeholder="Select student"
                                            className='select-ques'
                                            styles={customStyles}
                                        />
                                    </div>
                                </Col>
                                <Col >
                                    <div controlId='college_name'>
                                        <label className='label7-ques'>College Name</label><p></p>
                                        <Select
                                            options={college}
                                            value={selectedCollege}
                                            onChange={setSelectedCollege}
                                            placeholder="Select College"
                                             className='select-ques'
                                             styles={customStyles}
                                        />
                                    </div>
                                </Col>
                               
                                <Col >
                                    <div controlId='topic_id'>
                                        <label className='label6-ques'>Topic</label><p></p>
                                        <Select
                                            options={topic}
                                            value={selectedtopic}
                                            onChange={setSelectedtopic}
                                            placeholder="Select Topic"
                                             className='select-ques'
                                             styles={customStyles}
                                        />
                                    </div>
                                </Col>

                            </Row> <p></p>

                           
                           
                          

                            <Row md={12}>
                           

                               
                                <Col >
                                    <div controlId='trainer'>
                                        <label className='label7-ques'>Trainer</label><p></p>
                                        <Select
                                            options={trainer}
                                            value={selectedtrainer}
                                            onChange={setSelectedtrainer}
                                            placeholder="Select trainer"
                                            className='select-ques-trainer'
                                             styles={customStyles}
                                        />
                                    </div>
                                </Col>
                            
                            <Col >
                                  {/*}  <div className='dtm_session'controlId='dtm_session'>
                                        <label className='label6-ques'>Session Date</label><p></p>
                                        <input type="datetime-local" name="dtm_session" required placeholder="" className='input-ques' />
                                    </div>*/}
                                    <div className='dtm' controlId='dtm_session' style={{marginTop:"1px"}}>
                                        <label className='label6-ques' >Session Date</label><p></p>

                                        <DatePicker
                                            name='dtm_session'
                                            selected={dtmValidity}
                                            onChange={(date) => setDtmValidity(date)}
                                            showTimeSelect
                                            timeFormat="hh:mm aa"
                                            timeIntervals={15}
                                            //dateFormat="MMMM d, yyyy h:mm aa"
                                            dateFormat="dd-MM-yyyy, h:mm aa"
                                            timeCaption="Time"
                                            className='input-date-custom1'
                                            style={{marginTop:"1px"}}
                                           
                                             autoComplete="off"
                                            required
                                        />
                                    </div>
                                </Col> 
                                <Col >
                                    <div className='feedback' controlId='feedback'>
                                        <label className='label7-ques'>Feedback</label><p></p>
                                        <input type="text" name="feedback" required placeholder=""   autocomplete="off" className='input-ques'/>
                                    </div>
                                </Col>
                               
                               
                            </Row> <p style={{height:"20px"}}></p>
                            <div>
                                <button  type="submit" className='button-ques-save'>
                                    Save
                                </button>
                            </div>
                        </form>
                    </Col>
                </Row> <p></p>
            </div>
            <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
      
          
        </div>
    );

};

export default StudentFeedback;