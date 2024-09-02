import React, { useState, useEffect, useContext } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import Nextarrow from '../../assets/Images/nextarrow.png'
import back from '../../assets/Images/backarrow.png'

import moment from 'moment';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import ErrorModal from '../auth/ErrorModal';
import { addcontentApi, gettopic, gettopicApi, getSkilltypeApi, getcontentApi, getqstntypeApi } from '../../api/endpoints';
import { TestTypeContext, TestTypeCategoriesContext, QuestionTypeContext, SkillTypeContext } from '../Test/context/TestTypeContext';
import Footer from '../../Footer/Footer';
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



const FormModal = ({ onNextButtonClick }) => {
    const navigate = useNavigate();
    const { selectedQuestionType } = useContext(QuestionTypeContext);
    const { selectedSkillType } = useContext(SkillTypeContext);

    const [skilltype, setskilltype] = useState([]);
    const [questtionTypes, setQuestionTypes] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseError = () => {
        setShowError(false);
    };
    const [dtmValidity, setDtmValidity] = useState(null);
    useEffect(() => {

        getqstntypeApi()
            .then(data => {
                setQuestionTypes(data.map(item => ({ value: item.id, label: item.question_type })));
            })
            .catch(error => console.error('Error fetching question types:', error));

        getSkilltypeApi()
            .then(data => {
                setskilltype(data.map(item => ({ value: item.id, label: item.skill_type })));
            })
            .catch(error => console.error('Error fetching skill types:', error));
    }, []);


    /*
        const handleSubmit = (e) => {
            e.preventDefault();
    
            const formData = new FormData(e.target);
            const currentDate = new Date();
            const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    
            // Adjusted width and height for iframe
            const width = "1100px";
            const height = "450px";
    
            // Get the content from the form
            const content = formData.get('actual_content');
    
           
            const adjustedContent = content
                ? content
                    .replace(/width="\d+"/, `width="${width}"`)
                    .replace(/height="\d+"/, `height="${height}"`)
                    .replace(/<iframe([^>]*?)>/, `<iframe$1 scrolling="yes">`)
                : '';
    
            let questypeID = null;
            let skillTypeID = null;
    
            const fetchData = async () => {
    
                
                try {
                    const qstnTypes = await getqstntypeApi();
                    const skillTypes = await getSkilltypeApi();
    
                    const questionTypeData = qstnTypes.find(item => item.question_type === selectedQuestionType);
                    const skillTypeData = skillTypes.find(item => item.skill_type === selectedSkillType);
    
                    questypeID = questionTypeData ? questionTypeData.id : null;
                    skillTypeID = skillTypeData ? skillTypeData.id : null;
                    
                    const contentmaster = {
                        question_type_id: questypeID,
                        skill_type_id: skillTypeID,
                        content_type: formData.get('content_type'),
                        content_url: formData.get('content_url') || '',
                        actual_content: adjustedContent, // Use adjusted content here
                        status: formData.get('status'),
                       // topic_id: selectedsubtopic ? selectedsubtopic.value : null,
                       topic:formData.get('topic'),
                       sub_topic:formData.get('sub_topic'),
                       
                        dtm_active_from: formattedDate,
                        dtm_validity: dtmValidity ? moment(dtmValidity).format("YYYY-MM-DD HH:mm:ss") : null
                        // dtm_validity: dtmValidity ? dtmValidity.format("YYYY-MM-DD HH:mm:ss") : null
                    };
    
                    console.log('contentmaster: ', contentmaster);
    
                    addcontentApi(contentmaster)
                        .then((result) => {
                            console.log('Result:', result);
                            console.log('Content master:', contentmaster);
                            // window.alert("Content added successfully");
                            setErrorMessage('Data Added Successfully');
                            setShowError(true);
                            // Reset the form fields
                            e.target.reset();
                           // setSelectedsubtopic(null);
                           // setSelectedtopic(null);
                        })
                        .catch((error) => {
                            console.error("Failed to add data", error);
                            alert("Failed to add. Check console for details.");
                        });
                } catch (error) {
                    console.error("Failed to fetch data", error);
                    alert("Failed to fetch data. Check console for details.");
                }
            };
    
            fetchData();
        };*/

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

        // Adjusted width and height for iframe
        const width = "1100px";
        const height = "450px";

        // Get the content from the form
        const content = formData.get('actual_content');

        const adjustedContent = content
            ? content
                .replace(/width="\d+"/, `width="${width}"`)
                .replace(/height="\d+"/, `height="${height}"`)
                .replace(/<iframe([^>]*?)>/, `<iframe$1 scrolling="yes">`)
            : '';

        let questypeID = null;
        let skillTypeID = null;

        const fetchData = async () => {
            try {
                // Fetch existing contents to check for duplicates
                // const existingcontents = await getcontentApi();
                // const isDuplicate = existingcontents.some(
                // (paper) => paper.topic === formData.get('topic') && paper.sub_topic === formData.get('sub_topic')
                // );

                //if (isDuplicate) {
                // setErrorMessage('Duplicate topic-subtopic pair is not allowed.');
                //   setShowError(true);

                //  return;
                // }
                const existingcontents = await getcontentApi();
                const formTopic = formData.get('topic').toLowerCase();
                const formSubTopic = formData.get('sub_topic').toLowerCase();

                const isDuplicate = existingcontents.some((paper) => {
                    const paperTopic = paper.topic ? paper.topic.toLowerCase() : '';
                    const paperSubTopic = paper.sub_topic ? paper.sub_topic.toLowerCase() : '';
                    return paperTopic === formTopic && paperSubTopic === formSubTopic;
                });

                if (isDuplicate) {
                    setErrorMessage('Duplicate topic-subtopic pair is not allowed.');
                    setShowError(true);
                    return;
                }  
                
                const qstnTypes = await getqstntypeApi();
                const skillTypes = await getSkilltypeApi();

                const questionTypeData = qstnTypes.find(item => item.question_type === selectedQuestionType);
                const skillTypeData = skillTypes.find(item => item.skill_type === selectedSkillType);

                questypeID = questionTypeData ? questionTypeData.id : null;
                skillTypeID = skillTypeData ? skillTypeData.id : null;

                const contentmaster = {
                    question_type_id: questypeID,
                    skill_type_id: skillTypeID,
                    content_type: formData.get('content_type'),
                    content_url: formData.get('content_url') || '',
                    actual_content: adjustedContent,
                    status: formData.get('status'),
                    topic: formData.get('topic'),
                    sub_topic: formData.get('sub_topic'),
                    dtm_active_from: formattedDate,
                    dtm_validity: dtmValidity ? moment(dtmValidity).format("YYYY-MM-DD HH:mm:ss") : null
                };

                console.log('contentmaster: ', contentmaster);

                addcontentApi(contentmaster)
                    .then((result) => {
                        console.log('Result:', result);
                        console.log('Content master:', contentmaster);
                        setErrorMessage('Data Added Successfully');
                        setShowError(true);
                        setDtmValidity(null);

                        e.target.reset();
                        navigate('/lms/');
                    })
                    .catch((error) => {
                        console.error("Failed to add data", error);
                        alert("Failed to add. Check console for details.");
                    });
            } catch (error) {
                console.error("Failed to fetch data", error);
                alert("Failed to fetch data. Check console for details.");
            }
        };

        fetchData();
    };

    return (
        <div className='start'>
            <div className='form-ques'>
                <div >
                    <Form onSubmit={handleSubmit} className='form-ques-LMS'>
                        <Row>
                            <div><p></p></div>

                            <Row md={12}>
                                <Col >
                                    <div className='topic' controlId='topic'>
                                        <label className='label6-ques'>Topic</label><p></p>
                                        <input type="text" name="topic" required placeholder="" className="input-ques" autocomplete="off" />
                                    </div>

                                </Col>

                                <Col >
                                    <div className='sub-topic' controlId='sub_opic'>
                                        <label className='label6-ques'>Sub Topic</label><p></p>
                                        <input type="text" name="sub_topic" required placeholder="" className="input-ques" autocomplete="off" />

                                    </div>
                                </Col>
                            </Row>
                            <p></p>
                            <Row md={12}>
                                <Col >
                                    <div className='content' controlId='content_type'>
                                        <label className='label6-ques'>Content Type</label><p></p>
                                        <input type="text" name="content_type" required placeholder="" className="input-ques" autocomplete="off" />
                                    </div>
                                </Col>

                                <Col >
                                    <div className='url' controlId='content_url'>
                                        <label className='label6-ques'>Video URL</label><p></p>
                                        <input type="text" name="content_url" placeholder="" className="input-ques" autocomplete="off" />
                                    </div>
                                </Col>
                            </Row>
                            <p></p>
                            <p></p>
                            <Row md={12}>
                                <Col>
                                    <div className='actual' controlId='actual_content'>
                                        <label className='label6-ques'> Content Url</label><p></p>
                                        <input type="text" name="actual_content" placeholder="" className="input-ques" autocomplete="off" />
                                    </div>
                                </Col>
                                <Col>
                                    <div className='dtm' controlId='dtm_validity'>
                                        <label className='label6-ques' >Date of Validity</label><p></p>

                                        <DatePicker
                                            name='dtm_validity'
                                            selected={dtmValidity}
                                            onChange={(date) => setDtmValidity(date)}
                                            showTimeSelect
                                            timeFormat="hh:mm aa"
                                            timeIntervals={15}
                                            //dateFormat="MMMM d, yyyy h:mm aa"
                                            dateFormat="dd-MM-yyyy, h:mm aa"
                                            timeCaption="Time"
                                            className='input-date-custom1'

                                            styles={customStyles}
                                             autoComplete="off"
                                            required
                                        />
                                    </div>
                                </Col>

                            </Row>
                            <p></p>
                        </Row>
                        <Row md={12}>

                        <Col>
                                <div className='container-sta' controlId='status'>
                                    <label className='label6-ques-sats'>Status</label><p></p>
                                    <input type="text" name="status" required placeholder="" className="input-status-s" autocomplete="off" />
                                </div>
                            </Col>
                        </Row>
                        <p></p>
                        <p></p>
                        <br />
                        <Row>
                            <Col>
                                <div className="button-container-lms">
                                    <button
                                        className="button-ques-save1 btn btn-secondary back-button-lms"
                                        style={{
                                            width: "100px",
                                            color: 'black',
                                            height: '50px',
                                            backgroundColor: '#F1A128',
                                            cursor: 'not-allowed'
                                        }}
                                        disabled
                                    >
                                        <img src={back} className='nextarrow' alt="Back" />
                                        <span className="button-text">Back</span>
                                    </button>

                                    <button
                                        type="submit"
                                        className='button-ques-save save-button-lms'
                                        style={{ width: "100px" }}
                                    >
                                        Save
                                    </button>

                                    <button

                                        className="button-ques-save1 btn btn-secondary back-button-lms"

                                        style={{
                                            width: "100px",
                                            color: 'black',
                                            height: '50px',
                                            backgroundColor: '#F1A128',
                                            cursor: 'not-allowed'
                                        }}
                                        disabled
                                    >
                                        <span className="button-text">Next</span>
                                        <img src={Nextarrow} className='nextarrow' alt="Next" />
                                    </button>
                                </div>
                            </Col>
                        </Row>
                        <p></p>
                    </Form>
                </div>
                <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

            </div><p style={{ height: "50px" }}></p>
            {/*  <Footer></Footer>*/}</div>
    );

};

export default FormModal;
