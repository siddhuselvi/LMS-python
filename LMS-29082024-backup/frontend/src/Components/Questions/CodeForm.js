import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../Styles/global.css'
import { Row, Col, Form, Button } from 'react-bootstrap';
import { getLastQuestionPaperApi, addQuestionCodeApi, addQuestionApi_code } from '../../api/endpoints'
import QuestionPaperMCQ from './QuestionPaperMCQ';
import QuesPaperTb from './QuesPaperTb';
import Nextarrow from '../../assets/Images/nextarrow.png'
import ErrorModal from '../auth/ErrorModal';
import back from '../../assets/Images/backarrow.png';
const CodeForm = () => {
  const [formData, setFormData] = useState([
    {
      questionText: '',
      questionTextImage: null,
      mark: '',
      correctAnswer: '',
      explainAnswer: '',
      inputformat: "",
    },
  ]);
  const [fileNames, setFileNames] = useState({
    questionTextImage: '',
  });
  const [errors, setErrors] = useState({});
  const [currentForm, setCurrentForm] = useState(0);
  const [totalForms, setTotalForms] = useState(0);
  const [lastQuestionPaper, setLastQuestionPaper] = useState(null);
  const [lastQuestionPaperID, setLastQuestionPaperID] = useState(null);
  const [showQuestionPaper, setShowQuestionPaper] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseError = () => {
    setShowError(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getLastQuestionPaperApi();
        setLastQuestionPaper(response);
        setTotalForms(response.no_of_questions);
        setLastQuestionPaperID(response.id);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = value;
    setFormData(updatedFormData);
  };
  const handleFileChange = (e, index) => {
    const { name, files } = e.target;
    if (!formData[index]) return;
    const updatedFormData = [...formData];
    updatedFormData[index][name] = files[0];
    setFormData(updatedFormData);
    setFileNames({ ...fileNames, [name]: files[0] ? files[0].name : '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentData = formData[currentForm];
    const form = new FormData();
    for (const key in currentData) {
      form.append(key, currentData[key]);
    }

    try {
      const dataToSubmit = {
        'question_name_id': lastQuestionPaperID,
        'question_text': form.get('questionText'),
        'question_image_data': form.get('questionTextImage'),

        'answer': form.get('correctAnswer'),
        'mark': form.get('mark'),
        'explain_answer': form.get('explainAnswer'),
        'input_format': form.get('inputformat')
      };

      console.log('Data to Submit: ', dataToSubmit);

      addQuestionApi_code(dataToSubmit)
        .then(() => {
          // alert('Data saved successfully');
          setErrorMessage('Data Added Successfully');
          setShowError(true);
          setFileNames({
            questionTextImage: '',
            optionAImage: '',
            optionBImage: '',
            optionCImage: '',
            optionDImage: ''
          });
          moveToNextForm();

        })
        .catch(error => {
          console.error("Failed to Add Data", error);
          alert("Failed to Add. Check console for details.");

        });
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const moveToNextForm = () => {
    if (currentForm < totalForms - 1) {
      setCurrentForm(currentForm + 1);
      if (formData.length <= currentForm + 1) {
        setFormData([...formData, {
          questionText: '',
          questionTextImage: null,
          mark: '',
          correctAnswer: '',
          explainAnswer: '',
          inputformat:'',
        }]);
      }
    } else if (currentForm >= totalForms - 1) {
      setShowQuestionPaper(true);
    }
  };

  const currentData = formData[currentForm];
  const totalCount = currentForm + 1;

  return (
    <div className='questions'>
      {showQuestionPaper ? (
        <QuesPaperTb />
      ) : (
        <form onSubmit={handleSubmit} className='form-ques-mcq'>
          <div className='header'>
            <h5 >Question Number: {totalCount}</h5>
          </div>

          <div className='attach-code'>
            <label className='label6-ques'>Question Text<span style={{ color: '#F1A128' }}>**</span></label>
            <br />
            <input
              type="text"
              autocomplete="off"
              name="questionText"
              value={currentData.questionText}
              onChange={(e) => handleChange(e, currentForm)}
              className='input-ques-mcq'
              style={{ width: '50%' }}
            />

            <label htmlFor="questionTextImage" className="input-button-ques-mcq" >Attachment</label>
            <input
              type="file"
              id="questionTextImage"
              name="questionTextImage"
              onChange={(e) => handleFileChange(e, currentForm)}
              className="input-file-ques-mcq"
            />
            {fileNames.questionTextImage && <span className="file-name">{fileNames.questionTextImage}</span>}
            {errors.questionText && <p className='error-text'>{errors.questionText}</p>}


          </div><p></p>

          <Row md={12}>
            <Col>
              <div className='code-form'>
                <label className='label5-ques'>Mark<span style={{ color: '#F1A128' }}>**</span></label><p></p>
                <input
                  type="number"
                  name="mark"
                  autocomplete="off"
                  min="0"
                  value={currentData.mark}
                  onChange={(e) => handleChange(e, currentForm)}
                  className='input-ques'
                />

              </div>
            </Col>


            <Col>
              <div className='code-form'>
                <label className='label5-ques'>Correct Answer<span style={{ color: '#F1A128' }}>**</span></label><p></p>
                <input
                  type="text"
                  name="correctAnswer"
                  autocomplete="off"

                  value={currentData.correctAnswer}
                  onChange={(e) => handleChange(e, currentForm)}
                  className='input-ques'
                />
              </div>
            </Col>
            <Col>
              <div className='code-form'>
                <label className='label5-ques'>Explain Answer<span style={{ color: '#F1A128' }}>**</span></label><p></p>
                <textarea
                  type="text"
                  name="explainAnswer"
                  autocomplete="off"
                  value={currentData.explainAnswer}
                  onChange={(e) => handleChange(e, currentForm)}
                  className='input-ques'
                />
              </div>
            </Col>

          </Row>

          <Row md={12}>
            <Col>
              <div className='code-form' >
                <label className='label5-ques'>Input Format</label><p></p>
                <textarea
                  type="text"
                  name="inputformat"
                  autocomplete="off"
                  value={currentData.inputformat}
                  onChange={(e) => handleChange(e, currentForm)}
                  className='input-ques'
                />
              </div>
            </Col>
            <Col></Col>
            <Col></Col>


          </Row><p></p>

          <Row md={12}>

            <Col>
              <div className="button-container-lms">
                <button

                  className="button-ques-save btn btn-secondary back-button-lms"
                  style={{
                    width: "100px",
                    color: 'black',
                    height: '50px',
                    backgroundColor: '#F1A128',
                    cursor: 'not-allowed',
                  }}
                  disabled
                ><img src={back} className='nextarrow' ></img>
                  <span className="button-text">Back</span>
                </button>


                <button className='button-ques-save'
                  style={{
                    width: "100px"
                  }} type="submit">Save </button>


                <button className="button-ques-next btn btn-secondary next-button-lms"
                  disabled
                  style={{
                    width: "100px",
                    backgroundColor: "#F1A128",
                    cursor: 'not-allowed',
                    width: "100px",
                    color: 'black',
                    height: '50px',
                  }} >
                  <span className="button-text">Next</span>
                  <img src={Nextarrow} className='nextarrow' style={{ color: "#6E6D6C" }}></img>
                </button>
              </div>
            </Col>

          </Row>
        </form>
      )}
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

    </div>
  );
};

export default CodeForm;
