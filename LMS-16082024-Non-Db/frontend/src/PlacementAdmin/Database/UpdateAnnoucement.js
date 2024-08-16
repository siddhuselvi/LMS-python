import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select'; 
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import "react-datetime/css/react-datetime.css";
import { Link } from 'react-router-dom';
import '../../Styles/global.css'
import CustomOption from '../Test/CustomOption';
import ErrorModal from '../auth/ErrorModal';
import { addAnnouncementMasterApi, updateAnnouncementMasterApi, getdepartmentApi, getcollegeApi } from '../../api/endpoints';

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
            width: '98%'
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
            width: '98%'
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

const Updateannouncement = ({ announcement, onSave, onClose }) => {
    const [college, setCollege] = useState([]);
    const [contentName, setContent] = useState(announcement ? announcement.content : '');
    const [selectedCollege, setSelectedCollege] = useState(announcement ? { value: announcement.college_id, label: announcement.college_name } : null);
    const [is_active, setActive] = useState(announcement ? announcement.is_active : false);
    const [startDateTime, setStartDateTime] = useState(announcement ? new Date(announcement.dtm_start) : '');
    const [endDateTime, setEndDateTime] = useState(announcement ? new Date(announcement.dtm_end) : '');
    const [departments, setDepartments] = useState([]);
    const [selectedDepartments, setSelectedDepartments] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [showError, setShowError] = useState(false);

    const handleCloseError = () => {
        setShowError(false);
    };

    useEffect(() => {
        getdepartmentApi()
            .then(data => {
                const departmentOptions = data.map(item => ({ value: item.id, label: item.department }));
                setDepartments([{ value: 'all', label: 'All' }, ...departmentOptions]);
                if (announcement) {
                    const selectedDept = departmentOptions.filter(dept => announcement.department_id.includes(dept.value));
                    setSelectedDepartments(selectedDept);
                }
            })
            .catch(error => console.error('Error fetching departments:', error));

        getcollegeApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setCollege(data.map(item => ({ value: item.id, label: item.college })));
            })
            .catch(error => console.error('Error fetching course Names:', error));
    }, [announcement]);

    const handleDepartmentsChange = (selectedOptions) => {
        if (selectedOptions.some(option => option.value === 'all')) {
            setSelectedDepartments(departments.filter(option => option.value !== 'all'));
        } else {
            setSelectedDepartments(selectedOptions);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const filteredDepartments = selectedDepartments.filter(department => department.value !== 'all');
        const formData = new FormData(e.target);

        const contentmaster = {
            college_id: selectedCollege ? selectedCollege.value : null,
            department_id: filteredDepartments.map(department => department.value),
            dtm_start: moment(startDateTime).format('YYYY-MM-DD HH:mm:ss'),
            dtm_end: moment(endDateTime).format('YYYY-MM-DD HH:mm:ss'),
            content: formData.get('content'),
            is_active: is_active,
        };

        console.log("Result: ", contentmaster);

        const apiCall = announcement ? updateAnnouncementMasterApi : addAnnouncementMasterApi;

        apiCall(contentmaster)
            .then((result) => {
                setErrorMessage('Data Saved Successfully');
                setShowError(true);
                onSave();
            })
            .catch((error) => {
                console.error("Failed to Save Data", error);  // Log the error to the console
                alert("Failed to Save. Check console for details.");
            });
    };

    return (
        <div>
            <div className='form-ques'>
                <Row>
                    <Col >
                        <form onSubmit={handleSubmit}>
                            <Row md={12}>
                                <Col>
                                    <div className='CollegeName' controlId='college_name'>
                                        <label className='label5-ques'>College Name</label><p></p>
                                        <Select
                                            options={college}
                                            value={selectedCollege}
                                            onChange={setSelectedCollege}
                                            placeholder="Select College"
                                            styles={customStyles}
                                        />
                                    </div>
                                </Col>

                                <Col>
                                    <div className='CollegeName' controlId='department_name'>
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
                            </Row><p></p>

                            <Row md={12}>
                                <Col>
                                    <div>
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
                                            required
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div>
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
                                <Col>
                                    <div className='CollegeName' controlId='content'>
                                        <label className='label5-ques'>Content</label><p></p>
                                        <input
                                            type="text"
                                            name="content"
                                            className='input-ques'
                                            value={contentName}
                                            onChange={(e) => setContent(e.target.value)}
                                            required
                                            placeholder=""
                                        />
                                    </div>
                                </Col>
                                <Col>
                                    <div className='CollegeName' controlId='is_active'>
                                        <label className='label5-ques'>Is Active</label><p></p>
                                        <Form.Check
                                            type="switch"

                                            className="custom-switch"
                                            id="custom-switch"
                                            label=""
                                            checked={is_active}
                                            onChange={(e) => setActive(e.target.checked)}
                                        />
                                    </div>
                                </Col>
                            </Row><p></p>

                            <Row md={12}>
                                
                                    <div className='button-container-lms'>

                                    <button
                                            className="button-ques-save"
                                           
                                            type="submit"
                                        >
                                            Save
                                        </button>
                                        <button
                                            className="button-ques-save"
                                           
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </button>
                                    
                                       
                                    </div>
                               
                            </Row>
                        </form>
                    </Col>
                </Row>
            </div>

            <ErrorModal message={errorMessage} visible={showError} onClose={handleCloseError} />
        </div>
    );
};

export default Updateannouncement;
