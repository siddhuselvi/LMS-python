import React, { useState, useEffect } from 'react';
import { Col, Row, Form, button } from 'react-bootstrap';
import Select from 'react-select';
import { addQuestionpaperApi, gettopic, gettopicApi, gettesttypeApi, getQuestionPaperApi } from '../../api/endpoints';
//import './QuestionPaperCode.css';
//import '../global.css';
import CodeForm from './CodeForm';
import ImportFuncode from './ImportCode'
import Nextarrow from '../../assets/Images/nextarrow.png'
import ErrorModal from '../auth/ErrorModal';
import back from '../../assets/Images/backarrow.png';
import Footer from '../../Footer/Footer';
import ImportCodeWord from './ImportCodeWord';

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


const QuestionPaperCode = () => {
    const [topic, setTopic] = useState('');
    const [subTopic, setSubTopic] = useState('');

    const [showMCQForm, setShowMCQForm] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [uploadType, setUploadType] = useState('Manual');

    const handleUploadTypeChange = (type) => {
        setUploadType(type);
    };


    const [formData, setFormData] = useState({
        question_paper_name: '',
        duration_of_test: '',
        topic: '',
        sub_topic: '',
        no_of_questions: 0, // Initialize with appropriate default value
        upload_type: '', // Initialize with appropriate default value
    });

    const handleCloseError = () => {
        setShowError(false);
    };

    // const [uploadType, setUploadType] = useState(true); // State to track the selected upload type
    const [formSubmitted, setFormSubmitted] = useState(false);
    const handleNextbuttonClick = () => {
        setShowMCQForm(true);
    };
    const handleGoBackClick = () => {
        setShowMCQForm(false);
    };
    const handleUploadTypeChange_OLD = () => {
        setUploadType(true);
    };

    const handleUploadTypeExcelChange = () => {
        setUploadType(false);
    };


    const handleTopicChange = (e) => {
        setTopic(e.target.value);
    };

    const handleSubtopicChange = (e) => {
        setSubTopic(e.target.value);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const isFormValid = () => {
        return (
            formData.question_paper_name !== '' &&
            formData.duration_of_test !== '' &&
            formData.topic !== '' &&
            formData.sub_topic !== ''
        );
    };




    const handleSubmit_OLD = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const CodingTest = "Coding Test";

        // Fetch existing question papers to validate unique topic-subtopic pairs
        getQuestionPaperApi()
            .then((existingQuestionPapers) => {
                const isDuplicate = existingQuestionPapers.some((paper) => {
                    // Check if paper.topic and paper.sub_topic are not null or undefined
                    const paperTopic = paper.topic ? paper.topic.toLowerCase() : '';
                    console.log('paperTopic: ', paperTopic);

                    const paperSubTopic = paper.sub_topic ? paper.sub_topic.toLowerCase() : '';
                    console.log('paperSubTopic: ', paperSubTopic);


                    const formTopic = formData.get('topic') ? formData.get('topic').toLowerCase() : '';
                    console.log('formTopic: ', formTopic);

                    const formSubTopic = formData.get('sub_topic') ? formData.get('sub_topic').toLowerCase() : '';
                    console.log('formSubTopic: ', formSubTopic);


                    return paperTopic === formTopic && paperSubTopic === formSubTopic;
                });

                console.log('isduplicate: ', isDuplicate);

                if (isDuplicate) {
                    setErrorMessage('Duplicate topic-subtopic pair is not allowed.');
                    setShowError(true);
                    return;
                }


                const question = {
                    test_type: CodingTest,
                    topic: formData.get('topic'),
                    sub_topic: formData.get('sub_topic'),
                    question_paper_name: formData.get('question_paper_name'),

                    no_of_questions: formData.get('no_of_questions'),
                    upload_type: formData.get('upload_type'),
                    duration_of_test: formData.get('duration_of_test'),

                };

                console.log("Result: ", question)

                addQuestionpaperApi(question)
                    .then((result) => {
                        //window.alert("Question Paper added successfully");
                        //  setErrorMessage('QuestionPaper Added Successfully');
                        // setShowError(true);
                        setTimeout(() => {
                            setFormSubmitted(true); // Set formSubmitted to true after successful submission
                            if (uploadType) {
                                handleNextbuttonClick(); // Call handleNextButtonClick if uploadType is true (Manual)
                            }
                        }, 1000);
                        e.target.reset();


                    })
                    .catch((error) => {
                        console.error("Failed to Add Data", error);  // Log the error to the console
                        alert("Failed to Add. Check console for details.");
                    });
            })
            .catch((error) => {
                console.error("Failed to fetch existing question papers", error);
                alert("Failed to fetch existing question papers. Check console for details.");
            });
    };


    const handleSubmit = (e, formData) => {
        if (e && e.preventDefault) e.preventDefault();

        const MCQTest = "Coding Test";

        // Fetch existing question papers to validate unique topic-subtopic pairs
        getQuestionPaperApi()
            .then((existingQuestionPapers) => {
                const isDuplicate = existingQuestionPapers.some((paper) => {
                    const paperTopic = paper.topic ? paper.topic.toLowerCase() : '';
                    const paperSubTopic = paper.sub_topic ? paper.sub_topic.toLowerCase() : '';

                    const formTopic = formData.topic ? formData.topic.toLowerCase() : '';
                    const formSubTopic = formData.sub_topic ? formData.sub_topic.toLowerCase() : '';

                    return paperTopic === formTopic && paperSubTopic === formSubTopic;
                });

                if (isDuplicate) {
                    setErrorMessage('Duplicate topic-subtopic pair is not allowed.');
                    setShowError(true);
                    return;
                }

                const question = {
                    test_type: MCQTest,
                    topic: formData.topic,
                    sub_topic: formData.sub_topic,
                    question_paper_name: formData.question_paper_name,
                    no_of_questions: formData.no_of_questions,
                    upload_type: formData.upload_type,
                    duration_of_test: formData.duration_of_test,
                };

                addQuestionpaperApi(question)
                    .then((result) => {
                        setTimeout(() => {
                            setFormSubmitted(true);
                            if (uploadType === 'Manual') {
                                handleNextbuttonClick();
                            }
                        }, 1000);
                        // e.target.reset();
                    })
                    .catch((error) => {
                        console.error("Failed to Add Data", error);
                        alert("Failed to Add. Check console for details.");
                    });
            })
            .catch((error) => {
                console.error("Failed to fetch existing question papers", error);
                alert("Failed to fetch existing question papers. Check console for details.");
            });
    };



    return (
        <div className='start'>
            <div className="form-ques">
                {!showMCQForm ? (
                    <div>
                        <div>
                            <Row>
                                <Col>
                                    <Form className='form-ques' onSubmit={(e) => handleSubmit(e, formData)} >

                                        <Row md={12}>

                                            <Col>
                                                <div className='questionName' controlId='question_paper_name'>
                                                    <label className='label6-ques'>Question Paper Name</label><p></p>
                                                    <input
                                                        type="text"
                                                        className='input-ques'
                                                        name="question_paper_name"
                                                        required
                                                        placeholder=""
                                                        autocomplete="off"
                                                        onChange={handleInputChange}
                                                    />   </div>
                                            </Col>

                                            <Col >
                                                <div className='duration' controlId='duration_of_test'>
                                                    <label className='label7-ques' >Duration of the Test</label><p></p>
                                                    <input
                                                        type="number"
                                                        name="duration_of_test"
                                                        required
                                                        placeholder=""
                                                        autocomplete="off"
                                                        className='input-ques'
                                                        min="0"
                                                        onChange={handleInputChange}
                                                    />

                                                </div>
                                            </Col>
                                        </Row><p></p>

                                        <Row md={12}>

                                            <Col>
                                                <div controlId='topic'>
                                                    <label className='label6-ques'>Topic</label>

                                                    <input
                                                        type="text"
                                                        autocomplete="off"
                                                        name="topic"
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder=""
                                                        className='input-ques'
                                                    />
                                                </div>
                                            </Col>
                                            <Col >
                                                <div controlId='selectedSubTopic'>
                                                    <label className='label7-ques'>  Sub Topic</label>

                                                    <input
                                                        type="text"
                                                        autocomplete="off"
                                                        name="sub_topic"
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder=""
                                                        className='input-ques'
                                                    />
                                                </div>
                                            </Col>


                                        </Row><p ></p><p></p>

                                        <Row md={12} >
                                            <Col>
                                                <div controlId='upload_type'>
                                                    <label className='label6-ques'>Upload Questions</label><p></p>
                                                    <div className="custom-radio-group">
                                                        <label className="custom-radio" style={{ marginLeft: "10px" }}>
                                                            <input
                                                                type="radio"
                                                                name="upload_type"
                                                                value="Manual"
                                                                // onChange={() => handleUploadTypeChange('Manual')}
                                                                onChange={(e) => {
                                                                    handleUploadTypeChange('Manual');  // Call handleUploadTypeChange with the value 'Manual'
                                                                    handleInputChange(e);  // Call handleInputChange with the event object e
                                                                }}
                                                                required
                                                            />
                                                            <span className="custom-radio-label" style={{ color: "white", marginLeft: "10px" }}>Manual</span>
                                                        </label>
                                                        <label className="custom-radio" style={{ marginLeft: "10px", }}>
                                                            <input
                                                                type="radio"
                                                                name="upload_type"
                                                                value="Excel"
                                                                onChange={(e) => {
                                                                    handleUploadTypeChange('Excel');  // Call handleUploadTypeChange with the value 'Manual'
                                                                    handleInputChange(e);  // Call handleInputChange with the event object e
                                                                }}
                                                                required
                                                            // disabled={!isFormValid()}
                                                            />
                                                            <span className="custom-radio-label" style={{ color: "white", marginLeft: "10px" }}>Excel</span>
                                                        </label>
                                                        <label className="custom-radio" style={{ marginLeft: "10px" }}>
                                                            <input
                                                                type="radio"
                                                                name="upload_type"
                                                                value="Word"
                                                                onChange={(e) => {
                                                                    handleUploadTypeChange('Word');  // Call handleUploadTypeChange with the value 'Manual'
                                                                    handleInputChange(e);  // Call handleInputChange with the event object e
                                                                }}
                                                                required
                                                            //  disabled={!isFormValid()}
                                                            />
                                                            <span className="custom-radio-label" style={{ color: "white", marginLeft: "10px" }}>Word</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </Col>
                                            {uploadType === 'Manual' && (
                                                <React.Fragment>
                                                    < Col>
                                                        <div className='status' controlId='no_of_questions'>
                                                            <label className='label7-ques'>No of Questions</label><p></p>
                                                            <input
                                                                type="number"
                                                                autocomplete="off"
                                                                name="no_of_questions"
                                                                required
                                                                placeholder=""
                                                                min="0"
                                                                className='input-ques'
                                                                onChange={handleInputChange}
                                                            />

                                                        </div>
                                                    </Col></React.Fragment>
                                            )}

                                        </Row><p><p></p></p>




                                        <Row>
                                            <Col>
                                                {uploadType === 'Manual' && (
                                                    <React.Fragment>
                                                        <p style={{ height: "50px" }}></p>

                                                        <div className="button-container-lms">
                                                            <button

                                                                className="button-ques-save1 btn btn-secondary back-button-lms"
                                                                style={{ float: "left", width: "100px", color: 'black', height: '50px', backgroundColor: '#F1A128', cursor: 'not-allowed' }}
                                                                disabled
                                                            ><img src={back} className='nextarrow' ></img>
                                                                <span className="button-text">Back</span>
                                                            </button>
                                                            <button type="submit" className="button-ques-save save-button-lms" style={{ width: "100px" }}  >
                                                                Save
                                                            </button>
                                                            {!formSubmitted && (
                                                                <button onClick={handleNextbuttonClick} className="button-ques-save btn btn-secondary next-button-lms" disabled style={{ float: "right", width: "100px", backgroundColor: "#F1A128", cursor: 'not-allowed', width: "100px", color: 'black', height: '50px', }} >
                                                                    <span className="button-text">Next</span> <img src={Nextarrow} className='nextarrow' style={{ color: "#6E6D6C" }}></img>
                                                                </button>)}

                                                            {formSubmitted && (
                                                                <button onClick={handleNextbuttonClick} className="button-ques-save next-button-lms" style={{ float: "right", width: "100px" }} >
                                                                    <span className="button-text">Next</span> <img src={Nextarrow} className='nextarrow'></img>
                                                                </button>)}

                                                        </div>

                                                        <p style={{ height: "50px" }}></p>
                                                    </React.Fragment>
                                                )}

                                            </Col>
                                        </Row>
                                    </Form>
                                </Col>

                            </Row> <p></p>
                        </div>


                        {uploadType === 'Excel' && (
                            <div style={{ marginLeft: '0px' }}>
                                <div style={{ height: "280px" }}>
                                    <ImportFuncode isFormValid={isFormValid} formData={formData} handleSubmit={handleSubmit} />
                                </div>
                                <p style={{ height: "50px" }}></p>
                            </div>
                        )}

                        {uploadType === 'Word' && (
                            <div style={{ marginLeft: '0px' }}>
                                <div style={{ height: "280px" }}>
                                    <ImportCodeWord isFormValid={isFormValid} formData={formData} />
                                </div>
                                <p style={{ height: "50px" }}></p>
                            </div>
                        )}

                        <div  >{!uploadType && !showMCQForm && <div style={{ height: "280px" }}> <ImportFuncode isFormValid={isFormValid} formData={formData} /></div>}</div>
                        <p style={{ height: "50px" }}></p>

                    </div>) :
                    (
                        <div>
                            {/*}  <button className="button-ques-save" style={{width:"100px"}} onClick={handleGoBackClick}><img src={back} className='nextarrow' ></img>
                        <span>Back</span></button>*/}

                            <CodeForm />

                        </div>)}


            </div>
            <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

        </div>
    );

};

export default QuestionPaperCode;