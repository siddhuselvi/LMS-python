import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { 
  getTestcandidateCameraApi,
  addCameraScreenshots_API
 } from "../../../api/endpoints";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import ErrorModal from "../../../Components/auth/ErrorModal";
const API_URL = "http://localhost:8000";



const CameraComponent = ({ id }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [userConfirmed, setUserConfirmed] = useState(null);
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const [intervalId, setIntervalId] = useState(null);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchTestCandidateData = async () => {
      try {
        const data = await getTestcandidateCameraApi(id);
        if (data && data[0]?.is_camera_on !== undefined) {
          setIsCameraOn(data[0].is_camera_on);
        } else {
          setIsCameraOn(false);
        }
      } catch (error) {
        console.error("Error fetching test candidate data:", error);
        setIsCameraOn(false);
      }
    };

    fetchTestCandidateData();
  }, [id]);

  useEffect(() => {
    if (isCameraOn && userConfirmed === null) {
      const confirmUserChoice = window.confirm(
        "This test requires access to your camera. Do you want to enable it?"
      );
      setUserConfirmed(confirmUserChoice);
      if (!confirmUserChoice) {
        navigate(-1);
      }
    }
  }, [isCameraOn, userConfirmed, navigate]);

  useEffect(() => {
    if (isCameraOn && userConfirmed && webcamRef.current) {
      // Capture screenshot every 1 minute
      const captureInterval = setInterval(() => {
        captureScreenshot();
      }, 1800000); // Adjust the interval as needed

      setIntervalId(captureInterval);

      return () => {
        clearInterval(captureInterval);
      };
    }
  }, [isCameraOn, userConfirmed]);

  const captureScreenshot = () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        console.log("Screenshot captured");
        // Upload the screenshot to the server
        uploadScreenshot(imageSrc);
      } else {
        console.error("Failed to capture screenshot");
      }
    }
  };

  const uploadScreenshot_OLD = async (imageSrc) => {
    try {
      const formData = new FormData();
      const blob = await imageSrcToBlob(imageSrc);
      formData.append("screenshots", blob, "screenshot.jpg");

      const response = await axios.post(
        `${API_URL}/api/upload-screenshot/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        console.log("Screenshot uploaded successfully");
      } else {
        console.error("Failed to upload screenshot");
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
    }
  };

  const uploadScreenshot = async (imageSrc) => {
    try {
      const formData = new FormData();
      const blob = await imageSrcToBlob(imageSrc);
      formData.append("screenshots", blob, "screenshot.jpg");
  
      // Call the API function to upload the screenshot
      const response = await addCameraScreenshots_API(id, formData);
  
      if (response) {
        console.log("Screenshot uploaded successfully:", response);
      } else {
        console.error("Failed to upload screenshot");
      }
    } catch (error) {
      console.error("Error uploading screenshot:", error);
    }
  };
  

  const imageSrcToBlob = (imageSrc) => {
    return fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => blob);
  };

  return (
    <div>
      <p>Camera is {isCameraOn && userConfirmed ? "ON" : "OFF"}</p>

      {isCameraOn && userConfirmed && (
        <div>
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            videoConstraints={{
              width: 200,
              height: 200,
              facingMode: "user",
            }}
            style={{ width: "50px", height: "50px" }}
          />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
