import React, { useState, useEffect, useContext } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import Nextarrow from '../../assets/Images/nextarrow.png'
import back from '../../assets/Images/backarrow.png'

import moment from 'moment';

import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";
import { addcontentApi, gettopic, gettopicApi, getSkilltypeApi, getqstntypeApi } from '../../api/endpoints';
import { TestTypeContext, TestTypeCategoriesContext, QuestionTypeContext, SkillTypeContext } from '../Test/context/TestTypeContext';
import Footer from '../../Footer/Footer';
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

const FormModal = ({ onNextButtonClick }) => {
    
    const { selectedQuestionType } = useContext(QuestionTypeContext);
    const { selectedSkillType } = useContext(SkillTypeContext);

    const [subtopic, setsubtopic] = useState([]);
    const [topic, settopic] = useState([]);
    const [skilltype, setskilltype] = useState([]);
    const [questtionTypes, setQuestionTypes] = useState([]);

    const [selectedTopic, setSelectedtopic] = useState(null);
    const [selectedsubtopic, setSelectedsubtopic] = useState(null);
    const [dtmValidity, setDtmValidity] = useState(null);
    useEffect(() => {
        gettopic()
            .then(data => {
                const topics = data.topics.map(item => ({
                    value: item,
                    label: item
                }));
                settopic(topics);
            })
            .catch(error => console.error('Error fetching topics:', error));

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

    const handleTopicChange = selectedOption => {
        setSelectedtopic(selectedOption);
        console.log('selectedOption: ', selectedOption);
    
        gettopicApi()
            .then(data => {
                console.log("Received subtopics data:", data);
                const filteredSubtopics = data.filter(item => item.topic === selectedOption.value);
                const subtopics = filteredSubtopics.map(item => ({
                    value: item.id, // Adjust the property name accordingly
                    label: item.sub_topic, // Adjust the property name accordingly
                }));
                setsubtopic(subtopics);
                setSelectedsubtopic(null); // Reset selected subtopic
            })
            .catch(error => console.error('Error fetching subtopics:', error));
    };
/*
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace('T', ' ');

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
                    content_url: formData.get('content_url'),
                    actual_content: formData.get('actual_content'),
                    status: formData.get('status'),
                    topic_id: selectedsubtopic ? selectedsubtopic.value : null,
                    dtm_active_from: formattedDate,
                    dtm_validity: dtmValidity ? dtmValidity.format("YYYY-MM-DD HH:mm:ss") : null
                    //dtm_validity: formData.get('dtm_validity')
                };

                console.log('contentmaster: ', contentmaster);

                addcontentApi(contentmaster)
                    .then((result) => {
                        console.log('Result:', result);
                        console.log('Content master:', contentmaster);
                        window.alert("Content added successfully");
                        // Reset the form fields
                        e.target.reset();
                        setSelectedsubtopic(null);
                        setSelectedtopic(null);
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

    // Replace existing width and height attributes and add scrolling attribute in iframe HTML
    const adjustedContent = content
        .replace(/width="\d+"/, `width="${width}"`)
        .replace(/height="\d+"/, `height="${height}"`)
        .replace(/<iframe([^>]*?)>/, `<iframe$1 scrolling="yes">`);
  
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
                    topic_id: selectedsubtopic ? selectedsubtopic.value : null,
                    dtm_active_from: formattedDate,
                    dtm_validity: dtmValidity ? dtmValidity.format("YYYY-MM-DD HH:mm:ss") : null
                };
    
                console.log('contentmaster: ', contentmaster);
    
                addcontentApi(contentmaster)
                    .then((result) => {
                        console.log('Result:', result);
                        console.log('Content master:', contentmaster);
                        window.alert("Content added successfully");
                        // Reset the form fields
                        e.target.reset();
                        setSelectedsubtopic(null);
                        setSelectedtopic(null);
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
        <div>
        <div className='form-ques'>
            <div >
                <Form onSubmit={handleSubmit} className='form-ques'>
                    <Row>
                        <div><p></p></div>
                      {/* <Row md={12} >
                            <Col >
                                <div controlId='question_type'>
                                    <label className='label6-ques'>Question Type</label><p></p>
                                    <input readOnly value={selectedQuestionType} className="input-ques"  />
                                </div>
                            </Col>

                            <Col >
                                <div controlId='skill_type'>
                                    <label className='label7-ques'>Skill Type</label><p></p>
                                    <input readOnly value={selectedSkillType} className="input-ques"  />
                                </div>
                            </Col>
                        </Row>
                        <p></p> */} 
                      

                        <Row md={12}>
                            <Col >
                                <div controlId='topic'>
                                    <label className='label6-ques'>Topic</label><p></p>
                                    <Select
                                        options={topic}
                                        value={selectedTopic}
                                        onChange={handleTopicChange}
                                        placeholder="Select Topic"
                                       
                                        styles={customStyles}
                                    />
                                </div>
                            </Col>

                            <Col >
                                <div controlId='selectedSubTopic'>
                                    <label className='label6-ques'>Sub Topic</label><p></p>
                                    <Select
                                        options={subtopic}
                                        value={selectedsubtopic}
                                        onChange={setSelectedsubtopic}
                                        placeholder="Select Subtopic"
                                         
                                         styles={customStyles}
                                    />
                                </div>
                            </Col>
                        </Row>
                        <p></p>
                        <Row md={12}>
                            <Col >
                                <div controlId='content_type'>
                                    <label className='label6-ques'>Content Type</label><p></p>
                                    <input type="text" name="content_type" required placeholder="" className="input-ques" />
                                </div>
                            </Col>

                            <Col >
                                <div controlId='content_url'>
                                    <label className='label6-ques'>Content URL</label><p></p>
                                    <input type="text" name="content_url" placeholder="" className="input-ques" />
                                </div>
                            </Col>
                        </Row>
                        <p></p>
                    </Row>
                    <p></p>
                    <Row md={12}>
                        <Col>
                            <div controlId='actual_content'>
                                <label className='label6-ques'>Actual Content</label><p></p>
                                <input type="text" style={{width:"385px"}} name="actual_content" required placeholder="" className="input-ques" />
                            </div>
                        </Col>
                        <Col >
                            <div controlId='dtm_validity'>
                                <label className='label6-ques' style={{marginLeft:"-7px"}}>Date of Validity</label><p></p>
                                <Datetime
            value={dtmValidity}
            onChange={setDtmValidity}
            dateFormat="YYYY-MM-DD"
            timeFormat="hh:mm A"
           
            className='input-date-picker' // Use a custom class name
            inputProps={{ className: 'input-date', name: 'dtm_validity', required: true }}
        />
                            </div>
                        </Col>
                        
                    </Row>
                    <p></p>
                    <Row md={12}>
                      
                        <Col>
                            <div controlId='status'>
                                <label className='label6-ques'>Status</label><p></p>
                                <input type="text" name="status" required placeholder="" className="input-ques" />
                            </div>
                        </Col>
                    </Row>
                    <p></p>
                    <p></p>
                    <br />
                    <Row>
                        <Col ></Col>
                        <Col >
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <button type="submit" className='button-ques-save' style={{ width: "100px", marginLeft: '-30px' }}>
                                    Save
                                </button>
                                <button className='button-ques-save' onClick={onNextButtonClick} style={{ width: "100px" }}> Next <img src={Nextarrow} className='nextarrow'></img></button>
                            </div>
                        </Col>
                    </Row>
                    <p></p>
                </Form>
            </div>
           
        </div><p style={{height:"50px"}}></p>
       {/*  <Footer></Footer>*/}</div>
    ); 

};

export default FormModal;
