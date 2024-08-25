import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import {
  deleteQuestionPaperLast_API,
  QuestionsExportAPI,
  WordImportMCQ_Api
} from '../../api/endpoints';
import '../../Styles/global.css';
import ErrorModal from '../auth/ErrorModal';
import ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';
import Word from '../../assets/MCQ.V.0.3.docx'


const ImportMCQWord = ({ isFormValid, formData }) => {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const navigate = useNavigate();
  const questionPaperName = formData.question_paper_name;

  const handleCloseError = () => {
    setShowError(false);
  };

  const onDrop = useCallback((acceptedFiles) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });


  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file');
      setShowError(true);
      return;
    }
    const MCQTest = "MCQ Test";

    const formDataToSend = {
      'file': file,
      'question_paper_name': formData.question_paper_name || '', // Default to empty string if undefined
      'duration_of_test': formData.duration_of_test || '',
      'topic': formData.topic || '',
      'sub_topic': formData.sub_topic || '',
      'no_of_questions': formData.no_of_questions || 0,
      'upload_type': formData.upload_type || '',
      'test_type': MCQTest || ''
    }
    console.log('formDataToSend..............1: ', formDataToSend);



    try {
      console.log('formDataToSend: ', formDataToSend);
      const response = await WordImportMCQ_Api(formDataToSend);
      console.log('API Response:', response);
      const numberOfQuestions = Array.isArray(response) ? response.length : 0;
      setErrorMessage(`${numberOfQuestions} questions uploaded successfully`);
      setShowError(true);
      navigate('/question-paper-table');
    } catch (error) {
      handleUploadError(error);
    }
  };


  const handleUploadError = async (error) => {
    console.error('Error uploading file:', error);

    if (error.response) {
      // The response data might still be useful
      const errorData = error.response.data;
      let errorMsg = 'Error uploading file.';
      if (typeof errorData === 'string') {
        errorMsg = errorData;
      } else if (errorData.errors) { // Adjust based on actual server response structure
        errorMsg = Object.values(errorData.errors).join(', ');
      }

      setErrorMessage(errorMsg);
      setShowError(true);
    } else {
      setErrorMessage('An unexpected error occurred.');
      setShowError(true);
    }
  };










  const handleExportMCQ = () => {
    // Path to the document in the public/assets directory
    const documentUrl = Word;

    // Create a temporary link element
    const link = document.createElement('a');
    link.href = documentUrl;
    link.download = 'MCQ.V.0.3.docx';

    // Append the link to the body
    document.body.appendChild(link);

    // Trigger a click on the link to start the download
    link.click();

    // Remove the link from the body
    document.body.removeChild(link);
  };

  return (
    <div >
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <svg className="up-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="none" d="M0 0h24v24H0z" />
          <path fill="currentColor" d="M13 7.828V20h-2V7.828l-4.95 4.95-1.414-1.414L12 3l7.364 7.364-1.414 1.414z" />
        </svg>
        <p>Drop files here or click to upload.</p>
      </div><br />

      <div className="button-container-lms1">
        <button
          className='button-ques-save'
          style={{ width: "100px" }}
          onClick={handleUpload}
          disabled={!isFormValid() || !file}// Disable based on isFormValid

        >
          Upload
        </button>

        <button className='button-ques-save-add' style={{ width: "100px" }} onClick={handleExportMCQ}>Download</button>
      </div>

      {!isFormValid() && (
        <p style={{ color: '#F1A128', marginTop: '10px' }}>
          ensure the form is valid.
        </p>
      )}

      {!file && (
        <p style={{ color: '#F1A128', marginTop: '10px' }}>
          Please select a file
        </p>
      )}

      {file && <p style={{ color: 'orange' }}>Selected file: {file.name}</p>}

      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
    </div>
  );
}

export default ImportMCQWord;
