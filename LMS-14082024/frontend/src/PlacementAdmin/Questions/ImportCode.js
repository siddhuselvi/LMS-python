import React, { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { useDropzone } from 'react-dropzone';
import { QuestionsExportCodeAPI } from '../../api/endpoints';
import '../../Styles/global.css'
import ErrorModal from '../auth/ErrorModal';
import ExcelJS from 'exceljs';

const exportCodeToExcel = (questions) => {
  // Create a new workbook and worksheet
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Questions-Code');

  const header = [
    { header: 'Questions**', key: 'question_text', width: 40 },
    { header: 'Answer**', key: 'answer', width: 25 },
    { header: 'Mark**', key: 'mark', width: 10 },
    { header: 'Explain Answer**', key: 'explain_answer', width: 40 },
    { header: 'Input Format', key: 'input_format', width: 30 },
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
  questions.forEach(({ id, option_a, option_b, option_c, option_d, view_hint, question_id, negative_mark, ...rest }) => {
    worksheet.addRow(rest);
  });

  // Ensure the width is set for the data rows
  worksheet.columns.forEach(column => {
    column.width = column.width || 20; // Default width if not specified
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
    question_text: 'Multiply two float numbers and print the result',
    answer: 'Product of 1.20 and 3.40 is 4.0',
    mark: '25',
    explain_answer: 'printf("Hello, World!\n");',
    input_format: 'Here is a sample linae of code that can be executed in Python:print("Hello, World!"),You can just as easily store a string as a variable and then print it to stdout:, my_string = "Hello, World!"print(my_string)'
  }
];

function ImportFuncode() {
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
      const response = await QuestionsExportCodeAPI(formData);
      const numberOfQuestions = response.data.length;
      setErrorMessage(`${numberOfQuestions} questions uploaded successfully`);
      setShowError(true);
    } catch (error) {
      console.error('Error uploading file:', error);
      setErrorMessage('Error uploading file. Please try again.');
      setShowError(true);
    }
  };

  const handleExportCode = () => {
    // Export the constant sample question
    exportCodeToExcel(sampleQuestion);
  };

  return (
    <div>
      <div {...getRootProps()} className="dropzone">
        <input {...getInputProps()} />
        <svg  className="up-arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="48" height="48">
          <path fill="none" d="M0 0h24v24H0z" />
          <path fill="currentColor" d="M13 7.828V20h-2V7.828l-4.95 4.95-1.414-1.414L12 3l7.364 7.364-1.414 1.414z" />
        </svg>
        <p >Drop files here or click to upload.</p>
      </div><br></br>
      <div className="button-container-lms1">
        <button className='button-ques-save' onClick={handleUpload} style={{ width: "100px" }}>
          Upload
        </button>
        <button className='button-ques-save-add' onClick={handleExportCode} style={{ width: "100px" }}>
          Download
        </button>
      </div>
      {file && <p style={{ color: 'orange' }}>Selected file: {file.name}</p>}
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
    </div>
  );
}

export default ImportFuncode;
