import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { addCourseContentFeedbackApi, getcollegeApi, getcandidatesApi, getTrainerApi, gettopicApi, gettopic } from '../../api/endpoints';
import ErrorModal from '../../Components/auth/ErrorModal';
import Select from 'react-select';
import '../../Styles/global.css';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datetime/css/react-datetime.css";

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
    const [subtopic, setSubtopic] = useState([]);
    const [topic, setTopic] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedSubtopic, setSelectedSubtopic] = useState(null);
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
        getcandidatesApi()
            .then(data => {
                const studentData = data.map(item => ({ value: item.id, label: item.students_name, user_name: item.user_name }));
                setStudent(studentData);

                const matchedStudent = studentData.find(item => item.user_name === username);
                if (matchedStudent) {
                    setSelectedStudent(matchedStudent);
                }
            })
            .catch(error => console.error('Error fetching candidates:', error));

        gettopic()
            .then(data => {
                const topics = data.topics.map(item => ({
                    value: item,
                    label: item
                }));
                setTopic(topics);
            })
            .catch(error => console.error('Error fetching topics:', error));

        getTrainerApi()
            .then(data => {
                setTrainer(data.map(item => ({ value: item.id, label: item.trainer_name })));
            })
            .catch(error => console.error('Error fetching trainer:', error));
    }, [username]);

    const handleTopicChange = selectedOption => {
        setSelectedTopic(selectedOption);

        gettopicApi()
            .then(data => {
                const filteredSubtopics = data.filter(item => item.topic === selectedOption.value);
                const subtopics = filteredSubtopics.map(item => ({
                    value: item.id,
                    label: item.sub_topic,
                }));
                setSubtopic(subtopics);
                setSelectedSubtopic(null);
            })
            .catch(error => console.error('Error fetching subtopics:', error));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const feedbacksadd = {
            student_id: selectedStudent ? selectedStudent.value : null,
            topic_id: selectedSubtopic ? selectedSubtopic.value : null,
            trainer_id: selectedTrainer ? selectedTrainer.value : null,
            students_count: formData.get('students'),
            dtm_session: dtmValidity ? moment(dtmValidity).format("YYYY-MM-DD HH:mm:ss") : null,
            feedback: selectedFeedback ? selectedFeedback.value : null,
        };

        console.log("Result: ", feedbacksadd);

        addCourseContentFeedbackApi(feedbacksadd)
            .then((result) => {
                console.log("Success:", result);
                setErrorMessage('Feedback Updated Successfully');
                setShowError(true);
                setSelectedCourseName(null);
            })
            .catch((error) => {
                console.error("Failed to Add Data", error);
                alert("Failed to Add. Check console for details.");
            });
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
                                    <div controlId='topic'>
                                        <label className='label6-ques'>Topic</label>
                                        <p></p>
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
                                    <div controlId='selectedSubTopic'>
                                        <label className='label6-ques'>Sub Topic</label>
                                        <p></p>
                                        <Select
                                            options={subtopic}
                                            value={selectedSubtopic}
                                            onChange={setSelectedSubtopic}
                                            placeholder="Select Subtopic"
                                            styles={customStyles}
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
                                <Col></Col>
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
