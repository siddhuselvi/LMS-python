import React, { useState, useEffect } from 'react';
import { Col, Row, Form, button } from 'react-bootstrap';
import Select from 'react-select';
import { addQuestionpaperApi, gettopic, gettopicApi, gettesttypeApi } from '../../api/endpoints';
//import './QuestionPaperCode.css';
//import '../global.css';
import CodeForm from './CodeForm';
import ImportMCQ from './ImportMCQ';
import ImportFuncode from './ImportCode'
import Nextarrow from '../../assets/Images/nextarrow.png'
import ErrorModal from '../auth/ErrorModal';
import back from '../../assets/Images/backarrow.png';
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
const QuestionPaperCode = () => {
    const [subtopic, setsubtopic] = useState([]);
    const [topic, settopic] = useState([]);

    const [selectedTopic, setSelectedtopic] = useState(null);
    const [selectedsubtopic, setSelectedsubtopic] = useState(null);
    const [showMCQForm, setShowMCQForm] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseError = () => {
        setShowError(false);
    };
    const [uploadType, setUploadType] = useState(true); // State to track the selected upload type
    const [formSubmitted, setFormSubmitted] = useState(false);
    const handleNextbuttonClick = () => {
        setShowMCQForm(true);
    };
    const handleGoBackClick = () => {
        setShowMCQForm(false);
    };
    const handleUploadTypeChange = () => {
        setUploadType(true);
    };

    const handleUploadTypeExcelChange = () => {
        setUploadType(false);
    };

    useEffect(() => {
        //Fetch Tests  


        gettopic()
            .then(data => {
                console.log("Received topic data:", data);
                // Map data to include both topic and subtopic
                const topic = data.topics.map(item => ({
                    value: item,
                    label: item,
                    // topic: item.sub_topic // Store the corresponding topic
                }));
                settopic(topic);
            })
            .catch(error => console.error('Error fetching topics:', error));


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



    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const CodingTest = "Coding Test";
        const question = {
            test_type: CodingTest,
            topic_id: selectedsubtopic ? selectedsubtopic.value : null,
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
                //setShowMCQForm(true);
                setSelectedtopic(null);
                //setSelectedTestType(null);
                setSelectedsubtopic(null); // Clear selected subtopic
                e.target.reset();


            })
            .catch((error) => {
                console.error("Failed to Add Data", error);  // Log the error to the console
                alert("Failed to Add. Check console for details.");
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
                                    <Form className='form-ques' onSubmit={handleSubmit}>

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
                                                    />

                                                </div>
                                            </Col>
                                        </Row><p></p>

                                        <Row md={12}>

                                            <Col>
                                                <div controlId='topic'>
                                                    <label className='label6-ques'>Topic</label>

                                                    <Select
                                                        style={{
                                                            backgroundColor: "#343a40",
                                                            color: "white",
                                                            border: "1px solid #495057"
                                                        }}
                                                        options={topic}
                                                        value={selectedTopic}
                                                        onChange={handleTopicChange}
                                                        placeholder="Select Topic"

                                                        styles={customStyles}
                                                        className='inp-que'
                                                    />
                                                </div>
                                            </Col>
                                            <Col >
                                                <div controlId='selectedSubTopic'>
                                                    <label className='label7-ques'>  Sub Topic</label>

                                                    <Select
                                                        options={subtopic}
                                                        value={selectedsubtopic}
                                                        onChange={setSelectedsubtopic}
                                                        placeholder="Select Subtopic"

                                                        styles={customStyles}
                                                        className='inp-que'
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
                                                                onChange={handleUploadTypeChange}
                                                                required
                                                            />
                                                            <span className="custom-radio-label" style={{ color: "white", marginLeft: "10px" }}>Manual</span>
                                                        </label>
                                                        <label className="custom-radio" style={{ marginLeft: "10px",  }}>
                                                            <input
                                                                type="radio"
                                                                name="upload_type"
                                                                value="Excel"
                                                                onChange={handleUploadTypeExcelChange}
                                                                required
                                                            />
                                                            <span className="custom-radio-label" style={{ color: "white", marginLeft: "10px" }}>Excel</span>
                                                        </label>
                                                    </div>
                                                </div>
                                            </Col>
                                            {uploadType ? (
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
                                                            />

                                                        </div>
                                                    </Col></React.Fragment>) : null}

                                        </Row><p><p></p></p>




                                        <Row>
                                            <Col>
                                                {uploadType ? (<React.Fragment>
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
                                                </React.Fragment>) : null}

                                            </Col>
                                        </Row>


                                        <div  >{!uploadType && !showMCQForm && <div style={{ height: "280px" }}> <ImportFuncode /></div>}</div>
                                        <p style={{ height: "50px" }}></p>

                                    </Form>


                                </Col>

                            </Row> <p></p>
                        </div>
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