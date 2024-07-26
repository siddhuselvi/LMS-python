import React, { useEffect, useState, useRef, useContext } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import {
    addNonDatabaseTest_API,
    getcandidatesApi,
    getQuestionPaperApi,
    getrulesApi,
    addTestsApi,
    getTestsApi,
    gettesttypeApi,
    getSkilltypeApi,
    getqstntypeApi,

} from '../../api/endpoints';
import { TestTypeContext, TestTypeCategoriesContext, QuestionTypeContext, SkillTypeContext } from './context/TestTypeContext';
import Footer from '../../Footer/Footer';
import ErrorModal from '../auth/ErrorModal';
import { Link } from 'react-router-dom';
import Next from '../../assets/Images/nextarrow.png'
import Back from '../../assets/Images/backarrow.png'
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


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
const NonDatabaseForm = () => {
    const navigate = useNavigate();
    const { selectedTestType } = useContext(TestTypeContext);
    const { selectedTestTypeCategory } = useContext(TestTypeCategoriesContext);
    const { selectedQuestionType } = useContext(QuestionTypeContext);
    const { selectedSkillType } = useContext(SkillTypeContext);

    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [rules, setRules] = useState([]);
    const [selectedRulesId, setSelectedRulesId] = useState(null);
    const [needCandidateInfo, setNeedCandidateInfo] = useState(false);
    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [durationType, setDurationType] = useState('');
    const [duration, setDuration] = useState(0);
    const [isActualTest, setIsActualTest] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseError = () => {
        setShowError(false);
    };
    const handleNextbuttonClick = () => {
        // setShowMCQForm(true);
        navigate('/testschedule');
    };

    const handleGoBackClick = () => {
        // setShowMCQForm(false);
        navigate('/testaccess');
    };
 const handleDurationTypeChange = (event) => {
        const { value } = event.target;
        setDurationType(value);

        console.log('Duration type: ', value);

        // Reset the duration when switching duration types
        //setDuration('');
    };

    useEffect(() => {

        getrulesApi()
            .then(data => {
                setRules(data.map(item => ({ value: item.id, label: item.rule_name })));
            })
            .catch(error => console.error('Error fetching rules:', error));


        getQuestionPaperApi()
            .then(data => {
                // Map and filter the data
                const filteredQuestions = data
                    .map(item => {
                        return { value: item.id, label: item.question_paper_name, test_type: item.test_type };
                    })
                    .filter(item => {
                        return item.test_type === selectedTestType.trim();
                    });

                setQuestions(filteredQuestions);

                // Only set duration type if it's 'QuestionTime'
                if (durationType === 'QuestionTime') {
                    setDurationType(data.map(item => ({ value: item.id, label: item.duration_of_test })));
                }
            })
            .catch(error => console.error('Error fetching question paper:', error));




    }, [selectedTestType, selectedTestTypeCategory, selectedQuestionType, selectedSkillType, duration]);



    const handleSubmit = (e) => {
        e.preventDefault();

        getqstntypeApi()
            .then(qstnTypes => {
                return getSkilltypeApi().then(skillTypes => ({ qstnTypes, skillTypes }));
            })
            .then(({ qstnTypes, skillTypes }) => {
                return gettesttypeApi().then(testTypes => ({ qstnTypes, skillTypes, testTypes }));
            })
            .then(({ qstnTypes, skillTypes, testTypes }) => {
                const formData = new FormData(e.target);

                console.log('Selected Data:');
                console.log('questiontype: ', selectedQuestionType);
                console.log('selectedSkillType: ', selectedSkillType);
                console.log('selectedTestType: ', selectedTestType);
                console.log('test_type_categories: ', selectedTestTypeCategory);

                console.log('API Data:');
                console.log('qstnTypes:', qstnTypes);
                console.log('skillTypes:', skillTypes);
                console.log('testTypes:', testTypes);

                const questionTypeData = qstnTypes.find(item => item.question_type === selectedQuestionType);
                const skillTypeData = skillTypes.find(item => item.skill_type === selectedSkillType);
                const testtypeData = testTypes.find(item => item.test_type === selectedTestType && item.test_type_categories === selectedTestTypeCategory);

                console.log('Found Data:');
                console.log('testtypeData: ', testtypeData);

                const questypeID = questionTypeData ? questionTypeData.id : null;
                const skillTypeID = skillTypeData ? skillTypeData.id : null;
                const testTypeID = testtypeData ? testtypeData.id : null;

                const testMaster = {
                    test_name: formData.get('test_name'),
                    test_type_id: testTypeID,
                    question_type_id: questypeID,
                    skill_type_id: skillTypeID,
                };

                console.log('testMaster:', testMaster);

                // Check for null IDs and abort if any are null
                if (!testTypeID || !questypeID || !skillTypeID) {
                    console.error('One or more IDs are null. Aborting submission.');
                    if (!testTypeID) console.error('testTypeID is null');
                    if (!questypeID) console.error('questypeID is null');
                    if (!skillTypeID) console.error('skillTypeID is null');
                    return;
                }

                // Check if test name already exists before adding the testMaster
                return getTestsApi().then(existingTests => {
                    const testExists = existingTests.some(test => test.test_name === testMaster.test_name);

                    if (testExists) {
                        setErrorMessage("Test name already exists. Please choose a different test name.");
                        setShowError(true);
                        // alert("Test name already exists. Please choose a different test name.");
                        return;
                    } else {
                        // Attempt to add testMaster
                        return addTestsApi(testMaster)
                            .then(result => {
                                console.log('Result:', result);
                                console.log("Test master added successfully");


                                const formData = new FormData(e.target);
                                const year = formData.get('year');
                                let durations = 0;
                                let durationValue = 0;

                                const submitForm = (durationN) => {
                                    const pracOnlineTest = {
                                        test_name: formData.get('test_name'),
                                        question_id: selectedQuestions.value,
                                        dtm_start: moment(startDateTime).format('YYYY-MM-DD HH:mm:ss'),
                                        dtm_end: moment(endDateTime).format('YYYY-MM-DD HH:mm:ss'),

                                        // dtm_start: moment(startDateTime).format('YYYY-MM-DD HH:mm:ss'),
                                        // dtm_end: moment(endDateTime).format('YYYY-MM-DD HH:mm:ss'),

                                        is_actual_test: isActualTest,
                                        duration: durationN,
                                        duration_type: durationType,
                                        rules_id: selectedRulesId.value,
                                        need_candidate_info: needCandidateInfo,
                                    };

                                    console.log('result: ', pracOnlineTest);
                                    console.log('dtm_start: ', pracOnlineTest.dtm_start);
                                    console.log('dtm_end: ', pracOnlineTest.dtm_end);
                                    console.log('year: ', year);

                                    addNonDatabaseTest_API(pracOnlineTest)
                                        .then(() => {
                                            setErrorMessage('Test candidates mapped added successfully');
                                            setShowError(true);
                                            // window.alert("Test candidates mapped added successfully");
                                            setSelectedQuestions(null);
                                            setIsActualTest(false);
                                            setSelectedRulesId(null);
                                            setNeedCandidateInfo(false);
                                            setEndDateTime(null);
                                            setStartDateTime(null);
                                            // Reset the form fields
                                            e.target.reset();
                                            navigate('/test/test-schedules/');
                                        })
                                        .catch(error => {
                                            console.error("Failed to Add Data", error);
                                            setErrorMessage("Failed to Add. Check console for details.");
                                            setShowError(true);
                                            //  alert("Failed to Add. Check console for details.");
                                        });
                                };

                                if (durationType === 'Start&EndTime') {
                                    const dtm_start = formData.get('dtm_start');
                                    const dtm_end = formData.get('dtm_end');
                                    console.log('dtm_start: ', dtm_start);
                                    console.log('dtm_end: ', dtm_end);

                                    // Define a function to parse the date string in the expected format
                                    const parseDate = (dateStr) => {
                                        const [date, time] = dateStr.split(', ');
                                        const [day, month, year] = date.split('-');
                                        const [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
                                        let hours24 = parseInt(hours, 10);

                                        // Convert to 24-hour format
                                        if (period === 'PM' && hours24 !== 12) {
                                            hours24 += 12;
                                        } else if (period === 'AM' && hours24 === 12) {
                                            hours24 = 0;
                                        }

                                        return new Date(year, month - 1, day, hours24, minutes);
                                    };

                                    // Use the function to parse the start and end dates
                                    const start = parseDate(dtm_start);
                                    const end = parseDate(dtm_end);
                                    console.log('start: ', start);
                                    console.log('end: ', end);

                                    // Calculate duration in minutes, rounded up
                                    const durations = Math.ceil((end - start) / (1000 * 60));
                                    console.log('Start&End Duration: ', durations);

                                    submitForm(durations);
                                } else if (durationType === 'QuestionTime') {
                                    getQuestionPaperApi()
                                        .then(data => {
                                            console.log("Data: ", data);

                                            const matchingDuration = data.find(dur =>
                                                dur.id === selectedQuestions.value
                                            );
                                            console.log('matching durations: ', matchingDuration);
                                            console.log('selectedQuestions.value: ', selectedQuestions.value);

                                            durationValue = matchingDuration ? matchingDuration.duration_of_test : 0;
                                            console.log('matchingDuration.duration_of_test: ', matchingDuration.duration_of_test);
                                            console.log('question Time Duration: ', durationValue);

                                            submitForm(durationValue);
                                        })
                                        .catch(error => {
                                            console.error("Failed to fetch question paper data", error);
                                            alert("Failed to fetch question paper data. Check console for details.");
                                        });
                                }
                            })
                            .catch(error => {
                                console.error("Error adding testMaster:", error);
                            });
                    }
                });
            })
            .catch(error => {
                console.error("Error adding testMaster:", error);
            });
    };

    const handleCheckboxChange = (checked, setter) => {
        setter(checked);
    };

    return (
        <div>
            <div className='form-ques'>
                <div>
                    <div className='form-ques'>
                        <Row>
                            <Col>
                                <form onSubmit={handleSubmit}>
                                    <br />
                                    <Row md={12}>
                                        <Col >
                                            <div className='TestName' controlId='test_name' >
                                                <label className='label5-ques'>Test Name</label><p></p>
                                                <input type="text" className='input-ques'  autocomplete="off" name="test_name" required placeholder="" />

                                            </div>
                                        </Col>
                                        <Col>
                                            <div className='QuestionName-non' controlId='question_name' >
                                                <label className='label5-ques' >Question Name</label><p></p>
                                                <Select style={{ width: "600px" }}
                                                    options={questions}
                                                    value={selectedQuestions}
                                                    onChange={setSelectedQuestions}
                                                    placeholder="Select Question Name"

                                                    styles={customStyles}

                                                />



                                            </div>
                                        </Col>

                                    </Row>
                                    <p></p>
                                    <Row md={12}>
                                        <Col >
                                            <div >
                                                <label className='label5-ques'>Start Date</label><p></p>

                                                <DatePicker
                                                    name='dtm_start'
                                                    selected={startDateTime}
                                                    styles={customStyles}
                                                    onChange={(date) => setStartDateTime(date)}
                                                    showTimeSelect
                                                    timeFormat="hh:mm aa"
                                                    timeIntervals={15}
                                                    dateFormat="dd-MM-yyyy, h:mm aa"
                                                    timeCaption="Time"
                                                    className='input-date-custom'
                                                    required
                                                />
                                            </div>
                                        </Col>
                                        <Col >
                                            <div >
                                                <label className='label5-ques'>End Date</label><p></p>
                                                <DatePicker
                                                    name='dtm_end'
                                                    selected={endDateTime}
                                                    onChange={(date) => setEndDateTime(date)}
                                                    showTimeSelect
                                                    timeFormat="hh:mm aa"
                                                    timeIntervals={15}
                                                    dateFormat="dd-MM-yyyy, h:mm aa"
                                                    timeCaption="Time"
                                                    className='input-date-custom'
                                                    styles={customStyles}
                                                    required
                                                />
                                            </div>
                                        </Col>
                                    </Row>
                                    <p></p>

                                    <Row md={12}>
                                        <Col  >
                                            <div >
                                                <Form.Group controlId='duration'>
                                                    <label className='label5-ques'>Duration</label><p></p>
                                                    <div className="custom-radio-grouping" style={{ marginLeft: "50px" }}>
                                                        <label className="custom-radios">
                                                            <input
                                                                type="radio"
                                                                name="duration"
                                                                value="QuestionTime"
                                                                onChange={handleDurationTypeChange}
                                                                required
                                                            />
                                                            <span className="custom-radio-labels" style={{ marginLeft: "10px", color: "white" }} >QuestionTime</span>
                                                        </label><p></p>
                                                        <label className="custom-radios" >
                                                            <input
                                                                type="radio"
                                                                name="duration"
                                                                value="Start&EndTime"
                                                                onChange={handleDurationTypeChange}
                                                                required
                                                            />
                                                            <span className="custom-radio-labels" style={{ marginLeft: "10px", color: "white" }} >Start&End Time</span>
                                                        </label>
                                                    </div>
                                                </Form.Group>
                                            </div>
                                        </Col>
                                        <Col >
                                            <div controlId='need_candidate_info' >
                                                <label className='label5-ques'>Need Candidate Info</label><p></p>
                                                <div>
                                                    <input type="checkbox" id="need_candidate_info_checkbox" checked={needCandidateInfo} onChange={(e) => handleCheckboxChange(e.target.checked, setNeedCandidateInfo)} />
                                                    <label htmlFor="need_candidate_info_checkbox"></label>
                                                </div>
                                            </div>
                                        </Col>


                                    </Row><p></p>

                                    <Row md={12}>


                                        <Col>
                                            <div className='RulesName-non' controlId='rule_id' >
                                                <label className='label5-ques' >Rule Name</label><p></p>
                                                <Select
                                                    options={rules}
                                                    value={selectedRulesId}
                                                    onChange={setSelectedRulesId}
                                                    placeholder="Select rule"

                                                    styles={customStyles}
                                                />

                                            </div>
                                        </Col>
                                        <Col>

                                        </Col>

                                    </Row>

                                    <p style={{ height: "50px" }}></p><p></p>
                                    <Row>
                                        <Col>
                                            <div className="button-container-lms">
                                                <button onClick={handleGoBackClick} style={{ float: "left", width: "100px", }} className="button-ques-save  back-button-lms">
                                                    <img src={Back} className='nextarrow'></img> <span className="button-text">Back</span>

                                                </button>
                                                <button type="submit" className="button-ques-save save-button-lms" style={{ width: "100px", }}>
                                                    Save
                                                </button>

                                                <button onClick={handleNextbuttonClick} className="button-ques-next  next-button-lms" style={{ float: "right", backgroundColor: "#F1A128", width: "100px", color: 'black', height: '50px', }} >
                                                <span className="button-text">Next</span> <img src={Next} className='nextarrow' style={{ color: "#6E6D6C" }}></img>
                                                </button>


                                            </div>

                                        </Col>
                                    </Row>   </form>

                            </Col>
                        </Row>
                        <p></p>


                    </div>
                </div>
            </div><ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

        </div>
    );
};

export default NonDatabaseForm;