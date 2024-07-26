import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { QuestionsExportAPI } from '../../api/endpoints';
import '../../Styles/global.css';
import ErrorModal from '../auth/ErrorModal';
import ExcelJS from 'exceljs';

const exportMCQToExcel = (questions) => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Questions');


  const header = [
    { header: 'Questions**', key: 'question_text', width: 40 },
    { header: 'Option A**', key: 'option_a', width: 20 },
    { header: 'Option B**', key: 'option_b', width: 20 },
    { header: 'Option C**', key: 'option_c', width: 20 },
    { header: 'Option D**', key: 'option_d', width: 20 },
    { header: 'Answer**', key: 'answer', width: 15 },
    { header: 'Mark**', key: 'mark', width: 15 },
    { header: 'Explain Answer', key: 'explain_answer', width: 40 },
  ];


  // Add the header row
  worksheet.columns = header;

  // Apply orange background color and black text color to header cells
  worksheet.getRow(1).eachCell(cell => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFA500' } // Orange color
    };
    cell.font = {
      color: { argb: '00000000' }, // Black color
      bold: true
    };
    cell.border = {
      top: { style: 'thin', color: { argb: 'FF000000' } }, // Black border
      left: { style: 'thin', color: { argb: 'FF000000' } },
      bottom: { style: 'thin', color: { argb: 'FF000000' } },
      right: { style: 'thin', color: { argb: 'FF000000' } }
    };
  });

  // Filter out unwanted fields and add rows to the worksheet
  questions.forEach(({ id, input_format, view_hint, question_id, negative_mark, ...rest }) => {
    worksheet.addRow(rest);
  });

  // Save workbook as Excel file
  workbook.xlsx.writeBuffer().then(buffer => {
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Questions.xlsx';
    a.click();
    window.URL.revokeObjectURL(url);
  }).catch(error => {
    console.error('Error exporting to Excel:', error);
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

function ImportMCQ() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

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
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file. Please try again.');
      setShowError(true);
    }
  };

  const handleExportMCQ = async () => {
    try {
      exportMCQToExcel(sampleQuestion); // Use sampleQuestion for export
    } catch (error) {
      console.error('Error exporting code:', error);
    }
  };

  return (
    <div style={{ marginLeft: "50px" }}>
     <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <svg className="up-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="none" d="M0 0h24v24H0z" />
          <path fill="currentColor" d="M13 7.828V20h-2V7.828l-4.95 4.95-1.414-1.414L12 3l7.364 7.364-1.414 1.414z" />
        </svg>
        <p>Drop files here or click to upload.</p>
      </div><br />

      <div className="button-container-lms1">
        <button className='button-ques-save' style={{ width: "100px" }} onClick={handleUpload}>Upload</button>
        <button className='button-ques-save-add' style={{ width: "100px" }} onClick={handleExportMCQ}>Download</button>
      </div>
      {file && <p style={{ color: 'orange' }}>Selected file: {file.name}</p>}

      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
    </div>
  );
}

export default ImportMCQ;
