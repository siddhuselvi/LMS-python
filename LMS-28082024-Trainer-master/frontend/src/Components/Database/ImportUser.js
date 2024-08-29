import React, { useState } from 'react';
import axios from 'axios';
import { CandidateuserExportAPI } from '../../api/endpoints';
import Upload from '../../assets/Images/upload.png'
import ErrorModal from '../auth/ErrorModal';
function Importuser() {
  const [file, setFile] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
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
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await CandidateuserExportAPI(formData);
      setErrorMessage('Data uploaded Successfully');
      setShowError(true);

     // alert('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);

      // Check if error response is available
      if (error.response) {
        // Extract the detailed error message from the response
        const errorData = error.response.data;
        let errorMsg = 'Error uploading file. Check the Foreign Key data.';
        if (errorData.error) {
          errorMsg = errorData.error;
        } else if (typeof errorData === 'string') {
          errorMsg = errorData;
        } else if (Array.isArray(errorData) && errorData.length > 0) {
          errorMsg = errorData[0].user_name[0]; // Adjust based on your specific error structure
        }
        setErrorMessage(errorMsg);
        setShowError(true);
        //setErrorMessage(errorMsg);
       // alert(errorMsg);
      } else {
        setErrorMessage('Error uploading file. Please try again.');
        setShowError(true);
        //setErrorMessage('Error uploading file. Please try again.');
        //alert('Error uploading file. Please try again.');
      }
    }
  };

  return (
    <div className="sp-inner-div" >
      <input className='file-chosen'  type="file" onChange={handleFileChange}  />
      <button onClick={handleUpload} className="button-data upload-button" style={{ width: "114px" }} ><img className='nextarrow' src={Upload}></img><span>Upload</span></button>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
      </div>
  );
}

export default Importuser;