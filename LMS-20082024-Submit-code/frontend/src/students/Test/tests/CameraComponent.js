import React, { useEffect, useState, useRef } from 'react';
import { getTestcandidateCameraApi } from "../../../api/endpoints";

const CameraComponent = ({ id }) => {
  const [isCameraOn, setIsCameraOn] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    const fetchTestCandidateData = async () => {
      try {
        const data = await getTestcandidateCameraApi(id); // Fetch the test candidate data
        console.log("Fetched test candidate data:", data); // Log the fetched data

        // Make sure to access the correct object
        if (data && data[0].is_camera_on) {
          setIsCameraOn(data[0].is_camera_on); // Set camera status based on API response
          console.log("Camera should be ON, is_camera_on value:", data[0].is_camera_on);
        } else {
          setIsCameraOn(false);
          console.log("Camera should be OFF, is_camera_on value:", data[0]?.is_camera_on);
        }
      } catch (error) {
        console.error('Error fetching test candidate data:', error);
      }
    };

    fetchTestCandidateData();
  }, [id]); // Make sure the effect depends on `id`

  useEffect(() => {
    const startCamera = async () => {
      if (isCameraOn) {
        console.log("Starting camera...");
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true });
          console.log("Camera stream started successfully:", stream);
          if (videoRef.current) {
            videoRef.current.srcObject = stream; // Show the video stream
            console.log("Video stream set on the video element.");
          }
        } catch (err) {
          console.error('Error accessing the camera:', err);
        }
      } else {
        console.log("Camera is OFF.");
        if (videoRef.current && videoRef.current.srcObject) {
          const tracks = videoRef.current.srcObject.getTracks();
          tracks.forEach((track) => {
            track.stop();
            console.log("Camera stream stopped.");
          }); // Stop the camera stream
          videoRef.current.srcObject = null;
          console.log("Video element's srcObject set to null.");
        }
      }
    };

    startCamera(); // Trigger the camera start/stop based on `isCameraOn`

    // Cleanup the camera stream on unmount
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = videoRef.current.srcObject.getTracks();
        tracks.forEach((track) => {
          track.stop();
          console.log("Component unmounting: Camera stream stopped.");
        });
      }
    };
  }, [isCameraOn]); // Re-run this effect when `isCameraOn` changes

  return (
    <div>
      <p>Camera is {isCameraOn ? 'ON' : 'OFF'}</p>

      {/* Display video if the camera is on */}
      {isCameraOn && (
        <div>
          <video ref={videoRef} autoPlay playsInline style={{ width: '100px', height: '100px' }} />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
