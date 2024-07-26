import React, { useState } from 'react';
import axios from 'axios';
import { CandidateExportAPI } from '../../api/endpoints';
import Download from '../../assets/Images/download.png'
import Upload from '../../assets/Images/upload.png'
import ErrorModal from '../auth/ErrorModal';
function ImportCandidate() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  // const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  //const [errorMessage, setErrorMessage] = useState('');

  const handleCloseError = () => {
    setShowError(false);
  };
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('Please select a file');
      //alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await CandidateExportAPI(formData);
      // setErrorMessage('');  // Clear any previous error messages
      setErrorMessage('Data uploaded Successfully');
      setShowError(true);
      // alert('File uploaded successfully');
    } catch (error) {
      let errorMsg = 'An unexpected error occurred.';

      if (error.response) {
        const errorData = error.response.data;

        if (Array.isArray(errorData) && errorData.length > 0) {
          // Adjust this line according to your actual error structure
          errorMsg = errorData[0].user_name[0] || 'Error message not found.';
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (errorData.error) {
          errorMsg = errorData.error;
        } else if (Array.isArray(errorData)) {
          errorMsg = errorData.map(err => err.message).join(', ');
        } else if (typeof errorData === 'object') {
          errorMsg = Object.values(errorData).flat().join(', ');
        }
      } else {
        errorMsg = 'Error uploading file. Please try again.';
      }

      setErrorMessage(errorMsg);
      setShowError(true);
      //setErrorMessage(errorMsg);
      // alert(errorMsg);
    }
};



return (
  <div className='sp-inner-div' >
    <input className='file-chosen' type="file" onChange={handleFileChange} />
    <button onClick={handleUpload} className="button-data  upload-button" style={{ width: "102px" }} ><img className='nextarrow' src={Upload}></img><span>Upload</span></button>
    <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

  </div>
);
}

export default ImportCandidate;