import React, { useEffect, useState, useRef, useContext } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select, { components } from 'react-select';
import CustomOption from './CustomOption';
import {
    addTestcandidateApiBatch,
    getTestsApi,
    getrulesApi,
    getcollegeApi,
    getquestionApi,
    getcandidatesApi,
    getdepartmentApi,
    getQuestionPaperApi,
    addTestsApi,
    gettesttypeApi,
    getSkilltypeApi,
    getqstntypeApi,
    get_department_info_API
} from '../../api/endpoints';
import { TestTypeContext, TestTypeCategoriesContext, QuestionTypeContext, SkillTypeContext } from './context/TestTypeContext';
//import './Test.css';
import Next from '../../assets/Images/nextarrow.png'
import Back from '../../assets/Images/backarrow.png'
import ErrorModal from '../auth/ErrorModal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datetime/css/react-datetime.css";
import { Link } from 'react-router-dom';
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
const TestaccessForm = ({ onNextButtonClick }) => {

    const { selectedTestType } = useContext(TestTypeContext);
    const { selectedTestTypeCategory } = useContext(TestTypeCategoriesContext);
    const { selectedQuestionType } = useContext(QuestionTypeContext);
    const { selectedSkillType } = useContext(SkillTypeContext);
    const navigate = useNavigate();

    const selectOptionRef = useRef(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseError = () => {
        setShowError(false);
    };
    const [tests, setTests] = useState([]);
    // const [batchNo, setBatchNo] = useState([]);
    const [college, setCollege] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [rules, setRules] = useState([]);
    const [selectedRulesId, setSelectedRulesId] = useState(null);

    const [selectedCollege, setSelectedCollege] = useState(null);
    const [selectedQuestions, setSelectedQuestions] = useState([]);
    const [isActualTest, setIsActualTest] = useState(false);
    const [needCandidateInfo, setNeedCandidateInfo] = useState(false);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [selectedColleges, setSelectedColleges] = useState([]);

    const [startDateTime, setStartDateTime] = useState('');
    const [endDateTime, setEndDateTime] = useState('');
    const [durationType, setDurationType] = useState('');
    const [duration, setDuration] = useState(0);
    const years = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
    ];
    const [selectedYear, setSelectedYear] = useState(null);

    const handleDurationTypeChange = (event) => {
        const { value } = event.target;
        setDurationType(value);

        console.log('Duration type: ', value);

        // Reset the duration when switching duration types
        //setDuration('');
    };

    const handleDurationChange = (event) => {
        const { value } = event.target;
        setDurationType(value);

        // Reset the duration when switching duration types
        // setDuration('');

    };
    const handleDepartmentsChangeOLD = selectedOptions => {
        setSelectedDepartments(selectedOptions);
    };

    useEffect(() => {
        getcollegeApi()
            .then(data => {
                const collegeOptions = data.map(item => ({ value: item.id, label: item.college }));
                setCollege([{ value: 'all', label: 'All' }, ...collegeOptions]);
            })
            .catch(error => console.error('Error fetching College:', error));

        // getdepartmentApi()
        //     .then(data => {
        //         const departmentOptions = data.map(item => ({ value: item.id, label: item.department }));
        //         setDepartments([{ value: 'all', label: 'All' }, ...departmentOptions]);
        //     })
        //     .catch(error => console.error('Error fetching departments:', error));


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


    // Fetch department data when selectedColleges changes
    useEffect(() => {
        const filteredColleges = selectedColleges.filter(college => college.value !== 'all');
        const collegeIds = filteredColleges.map(college => college.value);
        // console.log('collegeIDs: ', collegeIds);

        get_department_info_API(collegeIds)
            .then(data => {
                const departmentOptions = data.map(item => ({
                    value: item.department_id_value,
                    label: item.department_name_value
                }));
                setDepartments([{ value: 'all', label: 'All' }, ...departmentOptions]);
            })
            .catch(error => console.error('Error fetching departments:', error));
    }, [selectedColleges]); // Dependency array includes selectedColleges




    const handleCheckboxChange = (checked, setter) => {
        setter(checked);
    };




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




    const handleSubmit_OLD = (e) => {
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

                                const year = formData.get('year');
                                let durations = 0;
                                let durationValue = 0;

                                const submitForm = (durationN) => {
                                    const filteredColleges = selectedColleges.filter(college => college.value !== 'all');
                                    const filteredDepartments = selectedDepartments.filter(department => department.value !== 'all');

                                    const pracOnlineTest = {
                                        college_id: filteredColleges.map(college => college.value),
                                        department_id: filteredDepartments.map(department => department.value),
                                        year: year,
                                        test_name: formData.get('test_name'),
                                        question_id: selectedQuestions.value,
                                        dtm_start: moment(startDateTime).format('YYYY-MM-DD HH:mm:ss'),
                                        dtm_end: moment(endDateTime).format('YYYY-MM-DD HH:mm:ss'),
                                        is_actual_test: isActualTest,
                                        duration: durationN,
                                        duration_type: durationType,
                                        rules_id: selectedRulesId.value,
                                        need_candidate_info: needCandidateInfo,
                                    };

                                    console.log('PracOnlineTest: ', pracOnlineTest);

                                    addTestcandidateApiBatch(pracOnlineTest)
                                        .then(() => {
                                            setErrorMessage("Test Assigned successfully");
                                            setShowError(true);
                                            // alert("Test Assigned successfully");

                                            // Reset form and states after submission
                                            setSelectedCollege(null);
                                            setSelectedDepartments([]);
                                            setSelectedColleges([]);
                                            setSelectedRulesId(null);
                                            setEndDateTime(null);
                                            setStartDateTime(null);
                                            e.target.reset();
                                            navigate('/test/test-schedules/');
                                        })
                                        .catch(error => {
                                            console.error("An error occurred while assigning the test:", error);
                                            // alert("An error occurred while assigning the test. Please try again later.");
                                            setErrorMessage("An error occurred while assigning the test. Please try again later.");
                                            setShowError(true);
                                        });
                                };


                                if (durationType === 'Start&EndTime') {
                                    const dtm_start = formData.get('dtm_start');
                                    const dtm_end = formData.get('dtm_end');
                                    console.log('dtm_start: ', dtm_start)
                                    console.log('dtm_end: ', dtm_end)

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

                                    durations = Math.ceil((end - start) / (1000 * 60)); // Duration in minutes, rounded up
                                    console.log('Start&End Duration: ', durations);
                                    submitForm(durations);
                                } else if (durationType === 'QuestionTime') {
                                    getQuestionPaperApi()
                                        .then(data => {
                                            const matchingDuration = data.find(dur => dur.id === selectedQuestions.value);
                                            durationValue = matchingDuration ? matchingDuration.duration_of_test : 0;
                                            console.log('Question Time Duration: ', durationValue);
                                            submitForm(durationValue);
                                        })
                                        .catch(error => {
                                            console.error("An error occurred while fetching question paper data:", error);
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


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const [qstnTypes, skillTypes] = await Promise.all([getqstntypeApi(), getSkilltypeApi()]);
            const testTypes = await gettesttypeApi();

            const formData = new FormData(e.target);

            const questionTypeData = qstnTypes.find(item => item.question_type === selectedQuestionType);
            const skillTypeData = skillTypes.find(item => item.skill_type === selectedSkillType);
            const testtypeData = testTypes.find(item => item.test_type === selectedTestType && item.test_type_categories === selectedTestTypeCategory);


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

            if (!testTypeID || !questypeID) {
                console.error('One or more IDs are null. Aborting submission.');
                if (!testTypeID) console.error('testTypeID is null');
                if (!questypeID) console.error('questypeID is null');
                //   if (!skillTypeID) console.error('skillTypeID is null');
                return;
            }

            const existingTests = await getTestsApi();
            const testExists = existingTests.some(test => test.test_name === testMaster.test_name);

            if (testExists) {
                setErrorMessage("Test name already exists. Please choose a different test name.");
                setShowError(true);
                return;
            }

            const year = formData.get('year');
            const filteredColleges = selectedColleges.filter(college => college.value !== 'all');
            const filteredDepartments = selectedDepartments.filter(department => department.value !== 'all');

            const pracOnlineTest = {
                college_id: filteredColleges.map(college => college.value),
                department_id: filteredDepartments.map(department => department.value),
                year: selectedYear.value,
                test_name: formData.get('test_name'),
                question_id: selectedQuestions.value,
                dtm_start: moment(startDateTime).format('YYYY-MM-DD HH:mm:ss'),
                dtm_end: moment(endDateTime).format('YYYY-MM-DD HH:mm:ss'),
                is_actual_test: isActualTest,
                duration: 0, // Will be updated later
                duration_type: durationType,
                rules_id: selectedRulesId.value,
                need_candidate_info: needCandidateInfo,
                test_type_id: testTypeID,
                question_type_id: questypeID,
                skill_type_id: skillTypeID,
            };

            const submitForm = async (durationN) => {
                pracOnlineTest.duration = durationN;

                console.log('PracOnlineTest:', pracOnlineTest);

                try {
                    await addTestcandidateApiBatch(pracOnlineTest);
                    setErrorMessage("Test Assigned successfully");
                    setShowError(true);

                    // Reset form and states after submission
                    setSelectedCollege(null);
                    setSelectedDepartments([]);
                    setSelectedColleges([]);
                    setSelectedRulesId(null);
                    setEndDateTime(null);
                    setStartDateTime(null);
                    e.target.reset();
                    navigate('/test/test-schedules/');
                } catch (error) {
                    console.error("An error occurred while assigning the test:", error);
                    setErrorMessage("An error occurred while assigning the test. Please try again later.");
                    setShowError(true);
                }
            };

            if (durationType === 'Start&EndTime') {
                const parseDate = (dateStr) => {
                    const [date, time] = dateStr.split(', ');
                    const [day, month, year] = date.split('-');
                    const [hours, minutes, period] = time.match(/(\d+):(\d+) (\w+)/).slice(1);
                    let hours24 = parseInt(hours, 10);

                    if (period === 'PM' && hours24 !== 12) hours24 += 12;
                    if (period === 'AM' && hours24 === 12) hours24 = 0;

                    return new Date(year, month - 1, day, hours24, minutes);
                };

                const start = parseDate(formData.get('dtm_start'));
                const end = parseDate(formData.get('dtm_end'));
                const durations = Math.ceil((end - start) / (1000 * 60)); // Duration in minutes, rounded up
                console.log('Start&End Duration:', durations);
                await submitForm(durations);
            } else if (durationType === 'QuestionTime') {
                const data = await getQuestionPaperApi();
                const matchingDuration = data.find(dur => dur.id === selectedQuestions.value);
                const durationValue = matchingDuration ? matchingDuration.duration_of_test : 0;
                console.log('Question Time Duration:', durationValue);
                await submitForm(durationValue);
            }
        } catch (error) {
            console.error("Error during submission:", error);
        }
    };




    return (
        <div className='start'>
            <div className='form-ques'>
                <div className='non-db-btn'>
                    <button className='button-ques-save  save-button-lms'>  <Link to='/test-access/non-db/' style={{ color: "black", textDecoration: "none" }}>Non DB</Link></button>

                </div>
                <br />

                <div>
                    <Row>
                        <Col>
                            <form onSubmit={handleSubmit} className='form-ques'>
                                <br />
                                <Row md={12}>
                                    <Col >
                                        <div className='TestName' controlId='test_name'>
                                            <label className='label5-ques' >Test Name</label><p></p>
                                            <input type="text" className='input-ques' name="test_name" required placeholder="" autocomplete="off" />

                                        </div>
                                    </Col>

                                    <Col >
                                        <div className='QuestionName' controlId='question_name' >
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
                                                onChange={(date) => setStartDateTime(date)}
                                                showTimeSelect
                                                timeFormat="hh:mm aa"
                                                timeIntervals={15}
                                                dateFormat="dd-MM-yyyy, h:mm aa"
                                                timeCaption="Time"

                                                className='input-date-custom'
                                                styles={customStyles}
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </Col>
                                    <Col >
                                        <div >
                                            <label className='label5-ques' >End Date</label><p></p>

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
                                                autoComplete="off"
                                                required
                                            />
                                        </div>
                                    </Col>
                                </Row>
                                <p></p>
                                <Row md={12}>
                                    <Col >
                                        <div className='CollegeName' controlId='college_name' >
                                            <label className='label5-ques'  >College Name</label><p></p>
                                            <Select
                                                isMulti
                                                options={college}
                                                value={selectedColleges}
                                                onChange={handleCollegeChange}
                                                styles={customStyles}
                                                components={{ Option: CustomOption }}
                                                closeMenuOnSelect={false} // Keep the menu open when selecting multiple options
                                            />
                                        </div>
                                    </Col>
                                    <Col >
                                        <div className='DepartmentName' controlId='department_name' >
                                            <label className='label5-ques' >Department Name</label><p></p>
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


                                </Row>
                                <p></p>
                                <Row md={12}>
                                    <Col >
                                        <div className='year' controlId="year" >
                                            <label className='label5-ques' >Year</label><p></p>
                                            <Select
                                                options={years}
                                                value={selectedYear}
                                                onChange={setSelectedYear}
                                                placeholder="Select year"
                                                styles={customStyles}
                                            />
                                        </div>

                                    </Col>

                                    <Col>
                                        <div className='RulesName' controlId='rule_id' >
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

                                    
                                </Row>
                                <p></p>

                                <Row md={12}>

                                    <Col>
                                        <div controlId='need_candidate_info' style={{ marginLeft: "-198px" }}>
                                            <label className='label5-ques' style={{ marginLeft: "200px" }}>Need Candidate Info</label><p></p>
                                            <div style={{ marginLeft: "200px" }}>
                                                <input type="checkbox" id="need_candidate_info_checkbox" checked={needCandidateInfo} onChange={(e) => handleCheckboxChange(e.target.checked, setNeedCandidateInfo)} />
                                                <label htmlFor="need_candidate_info_checkbox"></label>
                                            </div>
                                        </div>
                                    </Col>

                                    <Col >
                                        <Form.Group controlId='duration'>
                                            <label className='label5-ques' >Duration</label><p></p>
                                            <div className="custom-radio-grouping" style={{}}>
                                                <label className="custom-radios">
                                                    <input
                                                        type="radio"
                                                        name="duration"
                                                        value="QuestionTime"
                                                        onChange={handleDurationTypeChange}
                                                        required
                                                    />
                                                    <span className="custom-radio-labels" style={{ marginLeft: "10px", color: "white" }} >QuestionTime</span>
                                                </label>
                                                <label className="custom-radios" style={{ marginLeft: "20px" }} >
                                                    <input
                                                        type="radio"
                                                        name="duration"
                                                        value="Start&EndTime"
                                                        onChange={handleDurationTypeChange}
                                                        required
                                                    />
                                                    <span className="custom-radio-labels" style={{ marginLeft: "10px", color: "white" }}  >Start&End Time</span>
                                                </label>
                                            </div>
                                        </Form.Group>
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
                            </form><br></br>
                        </Col>
                    </Row>
                    <p></p>


                </div>
            </div>
            <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />


        </div>
    );
};

export default TestaccessForm;