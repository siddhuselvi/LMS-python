import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
//import './uploadstudent.css'
import { getcollegeApi, getdepartmentApi, getcompanyApi, addcompanyApi, getcandidatesApi, getSkillApi, addjobApi } from '../../api/endpoints';
//import AddQuestionPage from '../Test/question/AddQuestionPage'
import Select from 'react-select';
import Uploadstudentdata from './uploadtable';

import * as XLSX from "xlsx";
import back from '../../assets/Images/backarrow.png'
import '../../Styles/global.css';

import ErrorModal from '../auth/ErrorModal';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datetime/css/react-datetime.css";
import Footer from '../../Footer/Footer';
import Next from '../../assets/Images/nextarrow.png'
import CustomOption from '../Test/CustomOption';
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
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffff' // Text color for selected value
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#39444e' : state.isFocused ? '#39444e' : '#39444e',
        color: '#ffff', // Text color
        '&:hover': {
            backgroundColor: '#39444e', // Background color on hover
            color: '#ffff' // Text color on hover
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#39444e'
    })
};


const Uploadjoboffers = ({ collegeName, institute }) => {



    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');


    const handleCloseError = () => {
        setShowError(false);
    };


    const [college, setCollege] = useState([]);

    const [department, setDepartment] = useState([]);
    // const [company, setcompany] = useState([]);

    //const [selectedcompany, setSelectedcompany] = useState(null);
    const [skill, setskill] = useState([]);

    const [selectedskill, setSelectedskill] = useState([]);

    const [selectedCollege, setSelectedCollege] = useState(null);
    // const [selectedCourseName, setSelectedCourseName] = useState(null);
    const [selectedDepartment, setSelectedDepartment] = useState(null);

    const [showAddstudent, setshowAddstudent] = useState(false); // State variable to track visibility
    const [marks10th, setMarks10th] = useState(0);
    const [marks12th, setMarks12th] = useState(0);
    const [cgpa, setCgpa] = useState(0);
    const [interviewDate, setinterviewDate] = useState('');
    const navigate = useNavigate();
    const years = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' },
    ];
    const [selectedYear, setSelectedYear] = useState(null);

    const [oncampus, setoncampus] = useState(false);

    const handleNextButtonClick = () => {
        setshowAddstudent(true); // Show the Add Student form
    };

    const handlePreviousButtonClick = () => {
        setshowAddstudent(false); // Show the table
    };
    const handleCheckboxChange = (checked, setter) => {
        setter(checked);
    };



    useEffect(() => {

        getcompanyApi()
            .then(data => {
                // setcompany(data.map(item => ({ value: item.id, label: item.company_name })));
            })
            .catch(error => console.error('Error fetching Company:', error));

        getcollegeApi()
            .then(data => {
                setCollege(data.map(item => ({ value: item.id, label: item.college })));
            })
            .catch(error => console.error('Error fetching College:', error));

        getSkillApi()
            .then(data => {
                setskill(data.map(item => ({ value: item.id, label: item.skill_name })));
            })
            .catch(error => console.error('Error fetching skill:', error));



        //Fetch Department  
        getdepartmentApi()
            .then(data => {
                console.log("Department data:", data); // Log received data
                setDepartment(data.map(item => ({ value: item.id, label: item.department })));
            })
            .catch(error => console.error('Error fetching  Department :', error));




    }, [collegeName]);
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        console.log('Skills: ', selectedskill);
        let skill_values = selectedskill ? selectedskill.map(skill => skill.value) : null;

        console.log('skill_value: ', skill_values);

        // Create job offers data
        const joboffers = {
            company_name: formData.get('company_name'),
            company_profile: formData.get('company_profile'),
            post_name: formData.get('post_name') || null,
            skill_id: skill_values || null,
            gender: formData.get('gender') || null,
            college_id: institute || null,
            cgpa: cgpa || null,
            interview_date: moment(interviewDate).format('YYYY-MM-DD HH:mm:ss'),
            year: selectedYear.value,

            // intrview_date: formData.get('interview_date'),

            intern_fulltime: formData.get('intern_fulltime') || null,
            department_id: selectedDepartment ? selectedDepartment.value : null,
            marks_10th: marks10th || null,
            marks_12th: marks12th || null,
            history_of_arrears: formData.get('history_of_arrears') || null,
            on_off_campus: oncampus,
            standing_arrears: formData.get('standing_arrears') || null,
            location: formData.get('location') || null,
        };

        // Create company data
        const companyData = {
            company_name: formData.get('company_name'),
            company_profile: formData.get('company_profile'),
        };

        console.log("Job Offers Data: ", joboffers);
        console.log("Company Data: ", companyData);

        // Submit to addjobApi
        addjobApi(joboffers)
            .then((jobResponse) => {
                console.log("addjobApi Response: ", jobResponse);

                // Submit to addcompanyApi
                return addcompanyApi(companyData);
            })
            .then((companyResponse) => {
                console.log("addcompanyApi Response: ", companyResponse);
                setErrorMessage('Job Offer Uploaded Successfully');
                setShowError(true);
               
                // Both submissions were successful
                //  window.alert("Job offer and company added successfully");
                e.target.reset(); // Clear the form fields
                setSelectedCollege(null); // Clear selected college
                setSelectedDepartment(null); // Clear selected department
                setMarks10th(0); // Reset slider value
                setMarks12th(0);
                setCgpa(0);
                setoncampus(null);
                setSelectedskill([]);
                 handleNextButtonClick();
            })
            .catch((error) => {
                console.error("Failed to Add Data", error); // Log the error to the console
                alert("Failed to Add. Check console for details.");
            });
    };

    return (
        <div>
            <div>
                {!showAddstudent ? (
                    <div >

                        <div className='form-ques'>
                            <div className='header'>
                                <h4 className='h4'>Add Job Offer</h4>
                            </div>
                            <p></p>
                            <div className='boxshadow'>


                                <Form onSubmit={handleSubmit} className='form-ques'>
                                    <p></p>


                                    <Row >
                                        <Col>
                                            <div controlId='company_name'>
                                                <label className='label6-ques'>Company Name</label><p></p>
                                                <input type="text" className="input-ques" min="0" name="company_name" placeholder="" autoComplete='off' />

                                            </div>
                                        </Col>
                                        <Col>
                                            <div controlId='company_profile'>
                                                <label className='label6-ques'> Company Profile</label><p></p>
                                                <input type="text" className="input-ques" min="0" name="company_profile" placeholder="" autoComplete='off' />

                                            </div>
                                        </Col>
                                        <Col>
                                            <div controlId='post_name'>
                                                <label className='label6-ques'>Designation</label><p></p>
                                                <input type="text" className="input-ques" min="0" name="post_name" placeholder="" autoComplete='off' />
                                            </div>
                                        </Col>




                                    </Row>
                                    <p></p>
                                    <Row>
                                        <Col>
                                            <div controlId='intern_fulltime'>
                                                <label className='label6-ques'>Job Type</label> <p></p>
                                                <select as="select" name="intern_fulltime" className="input-ques" >
                                                    <option value="">Select </option>
                                                    <option value="Internship">Internship</option>
                                                    <option value="Fulltime">Full Time</option>


                                                </select>

                                            </div>
                                        </Col>

                                        <Col>
                                            <div controlId='department'>
                                                <label className='label6-ques'>Department</label><p></p>
                                                <Select
                                                    options={department}
                                                    value={selectedDepartment}
                                                    onChange={setSelectedDepartment}
                                                    placeholder="Select department"

                                                    styles={customStyles}
                                                />
                                            </div>
                                        </Col>
                                        <Col>
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


                                    </Row>
                                    <p></p>
                                    <Row >



                                        <Col>
                                            <div controlId='marks_10th'>
                                                <label className='label6-ques'>10th Mark</label><p></p>
                                                <input
                                                    type="range"
                                                    name="marks_10th"
                                                    min="0"
                                                    max="100"
                                                    value={marks10th}
                                                    onChange={(e) => setMarks10th(e.target.value)}
                                                />
                                                <Form.Text style={{ color: "#94a0ad" }}>{marks10th}</Form.Text>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div controlId='marks_12th'>
                                                <label className='label7-ques'>12th Mark</label><p></p>
                                                <input
                                                    type="range"
                                                    name="marks_12th"
                                                    min="0"
                                                    max="100"
                                                    value={marks12th}
                                                    onChange={(e) => setMarks12th(e.target.value)}
                                                />
                                                <Form.Text style={{ color: "#94a0ad" }}>{marks12th}</Form.Text>
                                            </div>
                                        </Col>
                                        <Col>
                                            <div controlId='cgpa'>
                                                <label className='label6-ques'>CGPA</label><p></p>
                                                <input
                                                    type="range"
                                                    name="cgpa"
                                                    min="0"
                                                    max="10"
                                                    step="0.1"
                                                    value={cgpa}
                                                    onChange={(e) => setCgpa(e.target.value)}
                                                />
                                                <Form.Text style={{ color: "#94a0ad" }}>{cgpa}</Form.Text>
                                            </div>
                                        </Col>
                                    </Row>

                                    <p></p>
                                    <Row >
                                        <Col>
                                            <div controlId='skill_id'>
                                                <label className='label6-ques'>Skill Name</label><p></p>
                                                <Select
                                                    options={skill}
                                                    value={selectedskill}
                                                    onChange={setSelectedskill}
                                                    placeholder="Select skill"
                                                    isMulti
                                                    styles={customStyles}  // Verify that customStyles is not causing issues
                                                    components={{ Option: CustomOption }}
                                                    closeMenuOnSelect={false} // Keep the menu open when selecting multiple options
                                                />
                                            </div>
                                        </Col>


                                        <Col>
                                            <div controlId='history_of_arrears'>
                                                <label className='label6-ques'>History of Arrears</label><p></p>
                                                <input type="number" className="input-ques" min="0" name="history_of_arrears" placeholder="" autoComplete="off" />
                                            </div>
                                        </Col>
                                        <Col>
                                            <div controlId='standing_arrears'>
                                                <label className='label7-ques'>Standing Arrears</label><p></p>
                                                <input type="number" className="input-ques" min="0" name="standing_arrears" placeholder="" autoComplete="off" />
                                            </div>
                                        </Col>
                                    </Row>
                                    <p></p>
                                    <Row >
                                        <Col>
                                            <div controlId='gender'>
                                                <label className='label6-ques'>Gender</label> <p></p>
                                                <select name="gender" className="input-ques" >
                                                    <option value="">Select Gender</option>
                                                   
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                </select>

                                            </div>
                                        </Col>
                                        <Col >
                                            <div >
                                                <label className='label5-ques'>Interview Date</label><p></p>

                                                <DatePicker
                                                    name='dtm_start'
                                                    selected={interviewDate}
                                                    onChange={(date) => setinterviewDate(date)}
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
                                            <div controlId='on_off_campus' >
                                                <label className='label5-ques' >On/Off Campus</label><p></p>
                                                <div >
                                                    <input type="checkbox" id="on_off_campus" checked={oncampus} onChange={(e) => handleCheckboxChange(e.target.checked, setoncampus)} />
                                                    <label htmlFor="on_off_campus_checkbox"></label>
                                                </div>
                                            </div>
                                        </Col>

                                    </Row>
                                    <p></p>

                                    <Row>
                                        <Col>
                                            <div controlId='location'>
                                                <label className='label7-ques'>Location</label> <p></p>
                                                <input type="text" className="input-ques" min="0" name="location" placeholder="" autoComplete="off" />
                                            </div>
                                        </Col>

                                        <Col></Col>
                                        <Col></Col>
                                    </Row>
                                    <p style={{ height: "40px" }}></p><p></p><p></p>

                                    <Row >

                                        <Col >

                                            <div className="button-container-lms-update">

                                                <button

                                                    className="button-ques-save btn btn-secondary back-button-lms"
                                                    style={{
                                                        width: "100px",
                                                        color: 'black',
                                                        height: '50px',
                                                        backgroundColor: '#F1A128',
                                                        cursor: 'not-allowed'
                                                    }}
                                                    disabled
                                                ><img src={back} className='nextarrow' ></img>
                                                    <span className="button-text">Back</span>
                                                </button>


                                                <button variant="primary" type="submit" style={{ width: "100px" }} className='button-ques-save'>
                                                    Save
                                                </button>


                                                <button
                                                    className="button-data button-spacing"
                                                    onClick={handleNextButtonClick}
                                                    style={{ width: "100px" }}>
                                                    <span>Next</span>
                                                    <img src={Next} className='nextarrow'></img>
                                                </button>
                                            </div>
                                        </Col>
                                    </Row>
                                    <p></p>
                                </Form>

                                <p></p>
                            </div>
                        </div>


                    </div>
                ) : (
                    <div >
                        <button onClick={handlePreviousButtonClick} className='button-ques-save'><img src={back} className='nextarrow' ></img>
                            <span>Back</span></button>
                        <Uploadstudentdata institute={institute} />
                    </div>
                )}
            </div><ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

        </div>

    );

};

export default Uploadjoboffers;