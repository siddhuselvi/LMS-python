import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { FaPlay, FaExpand, FaCompress } from 'react-icons/fa';
import './dummy.css';
import Nextarrow from '../../assets/Images/nextarrow.png';
import back from '../../assets/Images/backarrow.png';
import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorModal from '../auth/ErrorModal';
import { button, Table, Form, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import {
    getcontentApi,
    getLMSIDApi,
    getqstntypeApi,
    getSkilltypeApi,
    getLMS_Topic_IDApi,
    updatecontentApi,
    gettopicApi,
    gettopic,
} from '../../api/endpoints';
import PropTypes from 'prop-types';
import { parse, format } from 'date-fns';

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

const UpdateLMS = ({ lmsId, onNextButtonClick }) => {
    const [updateDataLms, setUpdateDataLms] = useState([]);
    const [dtmValidity, setDtmValidity] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseError = () => {
        setShowError(false);
    };

    useEffect(() => {
        getLMSIDApi(lmsId)
            .then(data => {
                console.log('API Response:', data);
                setUpdateDataLms([data]); // Wrap the response in an array

                // Parse the formatted date string to a Date object
                const dtmValidityDate = parse(data.dtm_validity_formatted, 'dd-MM-yyyy hh:mm a', new Date());

                // Set the parsed Date object to the state
                setDtmValidity(dtmValidityDate);
            })
            .catch(error => console.error('Error fetching update IDs:', error));
    }, [lmsId]);

    const handleInputChange = (index, field, value) => {
        const updatedLMSData = [...updateDataLms];
        updatedLMSData[index][field] = value;
        setUpdateDataLms(updatedLMSData);
    };

    const handleUpdateLMS = async (e, index) => {
        e.preventDefault();
        const lms = updateDataLms[index];
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

        // Adjusted width and height for iframe
        const width = "1100px";
        const height = "450px";

        // Get the content from the form
        const content = lms.actual_content;

        // Replace existing width and height attributes and add scrolling attribute in iframe HTML
        const adjustedContent = content
            .replace(/width="\d+"/, `width="${width}"`)
            .replace(/height="\d+"/, `height="${height}"`)
            .replace(/<iframe([^>]*?)>/, `<iframe$1 scrolling="yes">`);

        const contentmaster = {
            content_type: lms.content_type,
            content_url: lms.content_url || '',
            actual_content: adjustedContent,
            status: lms.status,
            topic: lms.topic, // Now a plain text field
            sub_topic: lms.sub_topic, // Now a plain text field
            dtm_active_from: formattedDate,
            dtm_validity: dtmValidity ? moment(dtmValidity).format("YYYY-MM-DD HH:mm:ss") : null
        };

        console.log('contentmaster: ', contentmaster);

        updatecontentApi(lmsId, contentmaster)
            .then((result) => {
                console.log('Result:', result);
                console.log('Content master:', contentmaster);
                setErrorMessage('Data Updated Successfully');
                setShowError(true);
            })
            .catch((error) => {
                console.error("Failed to update data", error);
                alert("Failed to update. Check console for details.");
            });
    };

    return (
        <div className="form-ques">
            <div className="header"><h5>Update Content</h5></div><br />
            <div className='form-ques' style={{ height: "600px" }}>
                {Array.isArray(updateDataLms) && updateDataLms.map((lms, index) => (
                    <Form key={index} onSubmit={(e) => handleUpdateLMS(e, index)}>
                        <Row>
                            <Col md={6}>
                                <Form.Group className='lms-update' controlId='topic'>
                                    <label className='label6-ques'>Topic</label><p></p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="input-ques"
                                        value={lms.topic}
                                        onChange={(e) => handleInputChange(index, 'topic', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className='lms-update' controlId='sub_topic'>
                                    <label className='label6-ques'>Sub Topic</label><p></p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="input-ques"
                                        value={lms.sub_topic}
                                        onChange={(e) => handleInputChange(index, 'sub_topic', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <p></p>

                        <Row>
                            <Col md={6}>
                                <Form.Group className='lms-update' controlId='content_type'>
                                    <label className='label6-ques'>Content Type</label><p></p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="input-ques"
                                        value={lms.content_type}
                                        onChange={(e) => handleInputChange(index, 'content_type', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className='lms-update' controlId='content_url'>
                                    <label className='label6-ques'>Video URL</label><p></p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="input-ques"
                                        value={lms.content_url}
                                        onChange={(e) => handleInputChange(index, 'content_url', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <p></p>

                        <Row>
                            <Col md={6}>
                                <Form.Group className='lms-update' controlId='actual_content'>
                                    <label className='label6-ques'>Content Url</label><p></p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="input-ques"
                                        value={lms.actual_content}
                                        onChange={(e) => handleInputChange(index, 'actual_content', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group controlId='dtm_validity'>
                                    <label className='label6-ques'>Validity Date</label><p></p>
                                    <DatePicker
                                        selected={dtmValidity}
                                        onChange={(date) => setDtmValidity(date)}
                                        showTimeSelect
                                        timeFormat="hh:mm aa"
                                        timeIntervals={15}
                                        dateFormat="dd-MM-yyyy, h:mm aa"
                                        timeCaption="Time"
                                        className='input-date-custom12'
                                        required
                                    />
                                </Form.Group>
                            </Col>
                        </Row>

                        <p></p>
                        <Row>
                            <Col md={6}>
                                <Form.Group className='lms-update' controlId='status'>
                                    <label className='label6-ques'>Status</label><p></p>
                                    <input
                                        type="text"
                                        autoComplete="off"
                                        className="input-ques"
                                        value={lms.status}
                                        onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <p style={{ height: "50px" }}></p>

                        <Row>
                            <Col>
                                <div className="button-container-lms-update">
                                    <button
                                        type="button"
                                        className='button-ques-save back-button-lms'
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (typeof onNextButtonClick === 'function') {
                                                onNextButtonClick();
                                            } else {
                                                console.error('onNextButtonClick is not a function');
                                            }
                                        }}
                                        style={{ width: "100px" }}
                                    >
                                        <img src={back} className='nextarrow' alt="Back" />
                                        <span className="button-text">Back</span>
                                    </button>
                                    <button type="submit" className='button-ques-save save-button-lms' style={{ width: "100px" }}>
                                        Update
                                    </button>
                                    <button className="button-ques-next btn btn-secondary next-button-lms" disabled style={{ float: "right", backgroundColor: "#F1A128", cursor: 'not-allowed',height:"50px", width: "100px", color: 'black' }}>
                                        <span className="button-text">Next</span>
                                        <img src={Nextarrow} className='nextarrow' alt="Next" />
                                    </button>
                                </div>
                            </Col>
                        </Row>

                        <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
                    </Form>
                ))}
            </div>
        </div>
    );
};

UpdateLMS.propTypes = {
    lmsId: PropTypes.string.isRequired,
    onNextButtonClick: PropTypes.func.isRequired
};

export default UpdateLMS;

