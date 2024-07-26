import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { deleteQuestionPaperLast_API, QuestionsExportAPI } from '../../api/endpoints';
import '../../Styles/global.css';
import ErrorModal from '../auth/ErrorModal';
import ExcelJS from 'exceljs';
import { useNavigate } from 'react-router-dom';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, TextRun } from 'docx';



// Function to export MCQs to a Word document
const exportMCQToWord = (questions) => {
    // Create a new document
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: questions.map((question, index) => {
            return new Paragraph({
              children: [
                new TextRun({
                  text: `${index + 1}. ${question.question_text}`,
                  bold: true,
                  break: 1,
                }),
                new TextRun({
                  text: `A) ${question.option_a}`,
                  break: 1,
                }),
                new TextRun({
                  text: `B) ${question.option_b}`,
                  break: 1,
                }),
                new TextRun({
                  text: `C) ${question.option_c}`,
                  break: 1,
                }),
                new TextRun({
                  text: `D) ${question.option_d}`,
                  break: 1,
                }),
                new TextRun({
                  text: `Answer: ${question.answer}`,
                  break: 1,
                }),
                new TextRun({
                  text: `Mark: ${question.mark}`,
                  break: 1,
                }),
                new TextRun({
                  text: `Explain Answer: ${question.explain_answer}`,
                  break: 2,
                }),
              ],
            });
          }),
        },
      ],
    });
  
    // Generate the document and download it
    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, 'Questions.docx');
    }).catch((error) => {
      console.error('Error exporting to Word:', error);
    });
  };
  

// Define a constant sample question
const sampleQuestion = [
  {
    question_text: 'What is the capital of France?',
    option_a: 'Paris',
    option_b: 'Berlin',
    option_c: 'Madrid',
    option_d: 'Rome',
    answer: 'A',
    mark: '1',
    explain_answer: 'Paris is the capital city of France.'
  }
];

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

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await QuestionsExportAPI(formData);
      const numberOfQuestions = response.data.length;
      setErrorMessage(`${numberOfQuestions} questions uploaded successfully`);
      setShowError(true);
      navigate('/question-paper-table')
    } catch (error) {
      console.error('Error uploading file:', error);


      // Check if error response is available
      if (error.response) {
        // Extract the detailed error message from the response
        const errorData = error.response.data;
        let errorMsg = 'Error uploading file.';
        if (errorData.error) {
          errorMsg = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        }

        setErrorMessage(errorMsg);
        setShowError(true);
        //setErrorMessage(errorMsg);
        // alert(errorMsg);

        // Ensure questionPaperName is defined before calling deleteQuestionPaperLast_API
        if (questionPaperName) {
          try {
            await deleteQuestionPaperLast_API(questionPaperName);
          } catch (deleteError) {
            console.error('Error deleting question paper:', deleteError);
          }
        }

      } else {

        setErrorMessage('Error uploading file. Please try again.');
        setShowError(true);
      }
    }
  };

  const handleExportMCQ = async () => {
    try {
      exportMCQToWord(sampleQuestion); // Use sampleQuestion for export
    } catch (error) {
      console.error('Error exporting code:', error);
    }
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
