import React, { useEffect, useState, useRef, useContext } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select, { components } from 'react-select';
import CustomOption from '../Test/CustomOption';
import {
    addlmsApiBatch,
    gettopicApi,
    getcollegeApi,
    getTrainerApi,
    getdepartmentApi,
    gettopic,
    getSubTopic_API,
    getcandidatesApi,
    get_department_info_LMS_API
} from '../../api/endpoints'

import Next from '../../assets/Images/nextarrow.png'
import Back from '../../assets/Images/backarrow.png'
import ErrorModal from '../auth/ErrorModal'
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import "react-datetime/css/react-datetime.css";
import '../../Styles/global.css'
import { useNavigate } from 'react-router-dom';

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

const LMSMap = ({ onNextButtonClick }) => {
    const navigate = useNavigate();

    const selectOptionRef = useRef(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseError = () => {
        setShowError(false);
    };
    const [college, setCollege] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [trainer, setTrainer] = useState([]);
    const [selectedTrainers, setSelectedTrainers] = useState(null);
    const [topic, setTopic] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);

    const [selectedColleges, setSelectedColleges] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);

    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [subtopic, setSubtopic] = useState([]);
    const [selectedSubtopic, setSelectedSubtopic] = useState([]);
    // const [selectedTrainers, setSelectedTrainers] = useState([]);
    const [trainerEndDateTime, setTrainerEndDateTime] = useState('');
    const [trainerStartDateTime, setTrainerStartDateTime] = useState('');

    const [trainerTrainingDateTime, setTrainerTrainingDateTime] = useState('');

    useEffect(() => {
        getcollegeApi()
            .then(data => {
                const collegeOptions = data.map(item => ({ value: item.id, label: item.college }));
                setCollege([{ value: 'all', label: 'All' }, ...collegeOptions]);
            })
            .catch(error => console.error('Error fetching College:', error));

        // getdepartmentApi()
        // .then(data => {
        // const departmentOptions = data.map(item => ({ value: item.id, label: item.department }));
        // setDepartments([{ value: 'all', label: 'All' }, ...departmentOptions]);
        // })
        // .catch(error => console.error('Error fetching departments:', error));


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
            .catch(error => console.error('Error fetching trainers:', error));
    }, []);

    // Fetch department data when selectedColleges changes
    useEffect(() => {
        const filteredColleges = selectedColleges.filter(college => college.value !== 'all');
        const collegeIds = filteredColleges.map(college => college.value);
        // console.log('collegeIDs: ', collegeIds);

        get_department_info_LMS_API(collegeIds)
            .then(data => {
                const departmentOptions = data.map(item => ({
                    value: item.department_id_value,
                    label: item.department_name_value
                }));
                setDepartments([{ value: 'all', label: 'All' }, ...departmentOptions]);
            })
            .catch(error => console.error('Error fetching departments:', error));
    }, [selectedColleges]); // Dependency array includes selectedColleges

    useEffect(() => {
        if (trainerTrainingDateTime) {
            setStartDateTime(trainerTrainingDateTime);
            setEndDateTime(moment(trainerTrainingDateTime).add(1, 'year').toDate());
            setTrainerStartDateTime(moment(trainerTrainingDateTime).subtract(3, 'days').toDate());
            setTrainerEndDateTime(moment(trainerTrainingDateTime).set({ hour: 18, minute: 0 }).toDate());
            // setTrainerEndDateTime(moment(trainerTrainingDateTime).set({ hour: 14, minute: 40 }).toDate());
        }
    }, [trainerTrainingDateTime]);

    const handleCollegeChange = (selectedOptions) => {
        if (selectedOptions.some(option => option.value === 'all')) {
            setSelectedColleges(college.filter(option => option.value !== 'all'));
        } else {
            setSelectedColleges(selectedOptions);
        }
    };

    const handleDepartmentsChange = (selectedOptions) => {
        if (selectedOptions.some(option => option.value === 'all')) {
            setSelectedDepartments(departments.filter(option => option.value !== 'all'));
        } else {
            setSelectedDepartments(selectedOptions);
        }
    };

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
        if (selectedOptions.some(option => option.value === 'all')) {
            setSelectedSubtopic(subtopic.filter(option => option.value !== 'all'));
        } else {
            setSelectedSubtopic(selectedOptions);
        }
    };
    const handleTrainerChange = (selectedOptions) => {
        if (selectedOptions.some(option => option.value === 'all')) {
            setSelectedTrainers(trainer.filter(option => option.value !== 'all'));
        } else {
            console.log('Trainer selectedOptions: ', selectedOptions)
            setSelectedTrainers(selectedOptions);
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);

        try {
            const filteredColleges = selectedColleges.filter(college => college.value !== 'all');
            const filteredDepartments = selectedDepartments.filter(department => department.value !== 'all');
            const filteredSubtopics = selectedSubtopic.filter(subtopics => subtopics.value !== 'all');
            const filteredTrainers = selectedTrainers.filter(trainer => trainer.value !== 'all');
            const year = formData.get('year');

            const MappingResult = {
                college_id: filteredColleges.map(college => college.value),
                department_id: filteredDepartments.map(department => department.value),
                year: year,
                trainer_id: filteredTrainers.map(trainer => trainer.value), // Array of trainer IDs
                //  trainer_id: selectedTrainer.value,
                topic_id: filteredSubtopics.map(subtopics => subtopics.value),
                dtm_start_student: moment(startDateTime).format('YYYY-MM-DD HH:mm:ss'),
                dtm_end_student: moment(endDateTime).format('YYYY-MM-DD HH:mm:ss'),
                dtm_start_trainer: moment(trainerStartDateTime).format('YYYY-MM-DD HH:mm:ss'),
                dtm_end_trainer: moment(trainerEndDateTime).format('YYYY-MM-DD HH:mm:ss'),
                dtm_of_training: moment(trainerTrainingDateTime).format('YYYY-MM-DD HH:mm:ss'),
            };

            console.log('MappingResult: ', MappingResult);

            await addlmsApiBatch(MappingResult);
            // alert('LMS Mapping Successfully');
            setErrorMessage('LMS Mapped Successfully');
            setShowError(true);
            setSelectedColleges([]);
            setSelectedDepartments([]);
            setEndDateTime(null);
            setStartDateTime(null);
            e.target.reset();
            navigate('/lms/table/')
        } catch (error) {
            setErrorMessage('LMS Not Mapped');
            setShowError(true);
            console.error("An error occurred while assigning the test:", error);
            // alert('LMS Not Mapped');
        }
    };

    return (
        <div className='start'>
            <div className='form-ques'>
                <div>
                    <Row>
                        <Col>
                            <form onSubmit={handleSubmit} className='form-ques'>
                                <br />
                                <Row md={12}>
                                    <Col>
                                        <div className='CollegeName' controlId='college_name'>
                                            <label className='label5-ques'>College Name</label><p></p>
                                            <Select
                                                isMulti
                                                options={college}
                                                value={selectedColleges}
                                                onChange={handleCollegeChange}
                                                styles={customStyles}
                                                components={{ Option: CustomOption }}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='DepartmentName' controlId='department_name'>
                                            <label className='label5-ques'>Department Name</label><p></p>
                                            <Select
                                                isMulti
                                                options={departments}
                                                value={selectedDepartments}
                                                onChange={handleDepartmentsChange}
                                                styles={customStyles}
                                                components={{ Option: CustomOption }}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='year' controlId="year">
                                            <label className='label5-ques'>Year</label><p></p>
                                            <select name="year" required className="input-ques">
                                                <option value="">Select Year</option>
                                                <option value="1">1</option>
                                                <option value="2">2</option>
                                                <option value="3">3</option>
                                                <option value="4">4</option>
                                            </select>
                                        </div>
                                    </Col>
                                </Row>
                                <p></p>
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
                                            <label className='label5-ques'>Sub Topic</label><p></p>
                                            <Select
                                                isMulti
                                                options={subtopic}
                                                value={selectedSubtopic}
                                                onChange={handleSubTopicsChange}
                                                placeholder="Select Sub Topic"
                                                styles={customStyles}
                                                components={{ Option: CustomOption }}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </Col>
                                    {/*} <Col>
                                        <div className='trainer' controlId='trainer_id'>
                                            <label className='label5-ques'>Trainer Name</label><p></p>
                                            <Select
                                                options={trainer}
                                                value={selectedTrainer}
                                                onChange={setSelectedTrainer}
                                                placeholder="Select Trainer"
                                                styles={customStyles}
                                            />
                                        </div>
                                    </Col>*/}

                                    <Col>
                                        <div className='trainer' controlId='trainer_id'>
                                            <label className='label5-ques'>Trainer Name</label><p></p>
                                            <Select
                                                isMulti
                                                options={trainer}
                                                value={selectedTrainers}
                                                onChange={handleTrainerChange}
                                                placeholder="Select Trainer"
                                                styles={customStyles}
                                                components={{ Option: CustomOption }}
                                                closeMenuOnSelect={false}
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <p></p>
                                <Row md={12}>
                                    <Col>
                                        <div className='datetime' controlId='dtm_of_training'>
                                            <label className='label5-ques'>Date of Training</label><p></p>
                                            <DatePicker
                                                selected={trainerTrainingDateTime}
                                                onChange={(date) => setTrainerTrainingDateTime(date)}
                                                showTimeSelect
                                                timeFormat='hh:mm aa'
                                                timeIntervals={15}
                                                dateFormat="dd-MM-yyyy, h:mm aa"
                                                className='input-date-custom'
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='datetime' controlId='dtm_start_student'>
                                            <label className='label5-ques'>Students Start Date</label><p></p>
                                            <DatePicker
                                                selected={startDateTime}
                                                onChange={(date) => setStartDateTime(date)}
                                                showTimeSelect
                                                timeFormat='hh:mm aa'
                                                timeIntervals={15}
                                                dateFormat="dd-MM-yyyy, h:mm aa"
                                                className='input-date-custom'
                                                required
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='datetime' controlId='dtm_end_student'>
                                            <label className='label5-ques'> Students End Date</label><p></p>
                                            <DatePicker
                                                selected={endDateTime}
                                                onChange={(date) => setEndDateTime(date)}
                                                showTimeSelect
                                                timeFormat='hh:mm aa'
                                                timeIntervals={15}
                                                dateFormat="dd-MM-yyyy, h:mm aa"
                                                className='input-date-custom'
                                                required
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <p></p>
                                <Row md={12}>
                                    <Col>
                                        <div className='datetime' controlId='dtm_start_trainer'>
                                            <label className='label5-ques'>Trainer Start Date</label><p></p>
                                            <DatePicker
                                                selected={trainerStartDateTime}
                                                onChange={(date) => setTrainerStartDateTime(date)}
                                                showTimeSelect
                                                timeFormat='hh:mm aa'
                                                timeIntervals={15}
                                                dateFormat="dd-MM-yyyy, h:mm aa"
                                                className='input-date-custom'
                                                required
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                    <Col>
                                        <div className='datetime' controlId='dtm_end_trainer'>
                                            <label className='label5-ques'>Trainer End Date</label><p></p>
                                            <DatePicker
                                                selected={trainerEndDateTime}
                                                onChange={(date) => setTrainerEndDateTime(date)}
                                                showTimeSelect
                                                timeFormat='hh:mm aa'
                                                timeIntervals={15}
                                                dateFormat="dd-MM-yyyy, h:mm aa"
                                                className='input-date-custom'
                                                required
                                                readOnly
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <p style={{ height: "50px" }}></p><p></p>
                                <Row>
                                    <Col>

                                        <div className="button-container-lms">
                                            <button

                                                className="button-ques-back btn btn-secondary back-button-lms"
                                                style={{ width: "100px", color: 'black', height: '50px', backgroundColor: '#F1A128', cursor: 'not-allowed' }}
                                                disabled
                                            ><img src={Back} className='nextarrow' ></img>
                                                <span className="button-text">Back</span>
                                            </button>
                                            <button type="submit" className='button-ques-save save-button-lms' style={{ width: "100px" }}>
                                                Save
                                            </button>
                                            <button onClick={onNextButtonClick} className="button-ques-back btn btn-secondary back-button-lms"
                                                style={{ width: "100px", color: 'black', height: '50px', backgroundColor: '#F1A128', cursor: 'not-allowed' }}
                                                disabled >
                                                <span className="button-text">Next</span><img src={Next} className='nextarrow'></img>

                                            </button>
                                        </div>
                                    </Col>
                                </Row>
                                <p></p>
                            </form>
                        </Col>
                    </Row>
                </div>
            </div>
            <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

        </div>
    );
};

export default LMSMap;