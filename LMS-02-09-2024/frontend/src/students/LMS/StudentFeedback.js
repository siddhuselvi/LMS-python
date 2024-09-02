import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { addCourseContentFeedbackApi, getcollegeApi, getcandidatesApi, getTrainerApi, gettopicApi,  gettopic,
    getSubTopic_API, } from '../../api/endpoints';
import ErrorModal from '../../Components/auth/ErrorModal';
import Select from 'react-select';
import '../../Styles/global.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datetime/css/react-datetime.css";
import CustomOption from '../../Components/Test/CustomOption';
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#39444e',
        color: '#fff',
        borderColor: state.isFocused ? '' : '#ffff',
        boxShadow: 'none',
        '&:hover': {
            borderColor: state.isFocused ? '#ffff' : '#ffff'
        },
        '@media (max-width: 768px)': {
            fontSize: '12px',
            width: '70%'
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffff',
        '@media (max-width: 768px)': {
            fontSize: '12px'
        }
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#39444e' : state.isFocused ? '#39444e' : '#39444e',
        color: '#ffff',
        '&:hover': {
            backgroundColor: '#39444e',
            color: '#ffff'
        },
        '@media (max-width: 768px)': {
            fontSize: '12px',
            width: '70%'
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#39444e',
        '@media (max-width: 768px)': {
            fontSize: '12px'
        }
    })
};

const feedbackOptions = [
    { value: 'Good', label: 'Good' },
    { value: 'Poor', label: 'Poor' },
    { value: 'Average', label: 'Average' },
    { value: 'Excellent', label: 'Excellent' }
];

const StudentFeedback = ({ collegeName, username, institute }) => {
    const [student, setStudent] = useState([]);
    const [college, setCollege] = useState([]);
    const [courseName, setCourseName] = useState([]);
    const [trainer, setTrainer] = useState([]);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [topic, setTopic] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [subtopic, setSubtopic] = useState([]);
    const [selectedSubtopic, setSelectedSubtopic] = useState([]);
   const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedCourseName, setSelectedCourseName] = useState(null);
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [error, setError] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dtmValidity, setDtmValidity] = useState(null);

    const handleCloseError = () => {
        setShowError(false);
    };

    useEffect(() => {
        // Fetch students
        getcandidatesApi()
            .then(data => {
                const studentData = data.map(item => ({
                    value: item.id, label: item.students_name, user_name: item.user_name
                }));
                setStudent(studentData);

                const matchedStudent = studentData.find(item => item.user_name === username);
                if (matchedStudent) {
                    setSelectedStudent(matchedStudent);
                }
            })
            .catch(error => console.error('Error fetching candidates:', error));

        // Fetch topics and subtopics
        gettopic()
        .then(data => {
            const topics = data.topics.map(item => ({
                value: item,
                label: item
            }));
            setTopic(topics);
        })
        .catch(error => console.error('Error fetching topics:', error));

  
        // Fetch trainers
        getTrainerApi()
            .then(data => {
                setTrainer(data.map(item => ({ value: item.id, label: item.trainer_name })));
            })
            .catch(error => console.error('Error fetching trainer:', error));
    }, [username]);

    const handleTopicChange = selectedOption => {
        setSelectedTopic(selectedOption);
        getSubTopic_API(selectedOption.value)
            .then(data => {
                const subtopics = data.map(item => ({
                    value: item.id, // Adjust the property name accordingly
                    label: item.sub_topic, // Adjust the property name accordingly
                }));
                setSubtopic(subtopics);
                setSelectedSubtopic([]); // Reset selected subtopic
            })
            .catch(error => console.error('Error fetching subtopics:', error));
    };

    const handleSubTopicsChange = (selectedOptions) => {
        console.log("Selected subtopics:", selectedOptions); // Log the selected subtopics
        setSelectedSubtopic(selectedOptions);
    };
    


    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Form submission started.");
        console.log("Selected Topic:", selectedTopic);
        console.log("Selected Subtopic:", selectedSubtopic);
        console.log("Selected Student:", selectedStudent);
        console.log("Selected Trainer:", selectedTrainer);
        console.log("Selected Feedback:", selectedFeedback);
        console.log("Session Date:", dtmValidity);
        
        // Prepare feedback data directly from state variables
        const feedbacksadd = {
            topic_id: selectedSubtopic ? selectedSubtopic.value:null, 
               
            student_id: selectedStudent ? selectedStudent.value : null,
            trainer_id: selectedTrainer ? selectedTrainer.value : null,
         
            dtm_session: dtmValidity ? moment(dtmValidity).format("YYYY-MM-DD HH:mm:ss") : null,
            feedback: selectedFeedback ? selectedFeedback.value : null,
            remarks: e.target.remarks.value // Directly access the remarks input field
        };
        
        console.log("Prepared feedback data:", feedbacksadd);
    
        try {
            const result = await addCourseContentFeedbackApi(feedbacksadd);
            console.log("Feedback submission successful:", result);
            setErrorMessage('Feedback Updated Successfully');
            setShowError(true);
            
            // Reset form states
            setSelectedSubtopic(null);
            setSelectedTrainer(null);
            setSelectedTopic(null);
            setSelectedStudent(null);
            setDtmValidity(null);
            e.target.reset();
        } catch (error) {
            console.error('Failed to Add Data:', error.response ? error.response.data : error);
            alert('Failed to Add. Check console for details.');
        }
    };
    
    

    return (
        <div>
            <div className='form-queslmss'>
                <h5 style={{ marginLeft: "20px" }}>Please submit Your Feedback Here!</h5>
                <p></p>
                <Row>
                    <Col>
                        <form onSubmit={handleSubmit} className='form-queslmss'>
                            <Row md={12}>
                            <Col>
                                        <div className='QuestionName' controlId='topic_id'>
                                            <label className='label5-ques'>Topic</label><p></p>
                                            <Select
                                                options={topic}
                                                value={selectedTopic}
                                                onChange={handleTopicChange}
                                                placeholder="Select Topic"
                                                styles={customStyles}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
    <div className='QuestionName' controlId='topic_id'>
        <label className='label5-ques'>Sub Topic</label>
        <p></p>
        <Select
           
            options={subtopic} // Subtopics to select from
            value={selectedSubtopic} // Currently selected subtopics
            onChange={handleSubTopicsChange} // Handle changes in selection
            placeholder="Select Sub Topic"
            styles={customStyles} // Custom styles if any
           
            
        />
    </div>
</Col>

                                <Col>
                                    <div controlId='trainer'>
                                        <label className='label7-ques'>Trainer Name</label>
                                        <p></p>
                                        <Select
                                            options={trainer}
                                            value={selectedTrainer}
                                            onChange={setSelectedTrainer}
                                            placeholder="Select trainer"
                                            className='select-ques-trainer'
                                            styles={customStyles}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <p></p>
                            <Row md={12}>
                               

                                <Col>
                                    <div className='dtm' controlId='dtm_session' style={{ marginTop: "1px" }}>
                                        <label className='label6-ques'>Session Date</label>
                                        <p></p>
                                        <DatePicker
                                            name='dtm_session'
                                            selected={dtmValidity}
                                            onChange={(date) => setDtmValidity(date)}
                                            showTimeSelect
                                            timeFormat="hh:mm aa"
                                            timeIntervals={15}
                                            dateFormat="dd-MM-yyyy, h:mm aa"
                                            timeCaption="Time"
                                            className='input-date-custom1'
                                            style={{ marginTop: "1px" }}
                                            autoComplete="off"
                                            required
                                        />
                                    </div>
                                </Col>

                                <Col>
                                    <div className='feedback' controlId='feedback'>
                                        <label className='label7-ques'>Feedback</label>
                                        <p></p>
                                        <Select
                                            options={feedbackOptions}
                                            value={selectedFeedback}
                                            onChange={setSelectedFeedback}
                                            placeholder="Select Feedback"
                                            styles={customStyles}
                                        />
                                    </div>
                                </Col>
                                <Col>
                                            <div className='add-profile' controlId='remarks'>
                                                <label className='label6-ques'>Remarks</label> <p></p>

                                                <input type="text" name="remarks" autocomplete="off" className="input-ques" autoComplete='off' />
                                            </div>
                                        </Col>
                            </Row>
                            <p style={{ height: "20px" }}></p>
                            <div>
                                <button type="submit" className='button-ques-save'>
                                    Save
                                </button>
                            </div>
                        </form>
                    </Col>
                </Row>
                <p></p>
            </div>
            <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
        </div>
    );
};

export default StudentFeedback;
