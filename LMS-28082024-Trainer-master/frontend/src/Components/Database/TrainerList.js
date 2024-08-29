import React, { useState, useEffect } from "react";
import { getTrainerApi } from "../../../src/api/endpoints";
import "../../Styles/global.css";
import back from "../../assets/Images/backarrow.png";
import next from "../../assets/Images/nextarrow.png";

const TrainerList = () => {
  const [trainers, setTrainers] = useState([]);
  const [currentTrainerIndex, setCurrentTrainerIndex] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrainers();
  }, []);

  const fetchTrainers = async () => {
    try {
      const response = await getTrainerApi();
      setTrainers(response);
    } catch (error) {
      setError("Failed to fetch trainer data");
      console.error(error);
    }
  };

  const nextTrainer = () => {
    if (currentTrainerIndex < trainers.length - 1) {
      setCurrentTrainerIndex(currentTrainerIndex + 1);
    }
  };

  const prevTrainer = () => {
    if (currentTrainerIndex > 0) {
      setCurrentTrainerIndex(currentTrainerIndex - 1);
    }
  };

  const currentTrainer = trainers[currentTrainerIndex];

  return (
    <div className="form-ques">
      <h2>Trainer Details</h2>
      {error && <p>{error}</p>}
      <div className="form-ques">
        {trainers.length > 0 && currentTrainer ? (
          <div className="trainer-card">
            <h3>{currentTrainer.trainer_name}</h3>
            <p>
              <strong>City:</strong> {currentTrainer.city || "N/A"}
            </p>
            <p>
              <strong>State:</strong> {currentTrainer.state}
            </p>
            <p>
              <strong>Qualification:</strong> {currentTrainer.qualification}
            </p>
            <p>
              <strong>Experience:</strong> {currentTrainer.experience}
            </p>
            <p>
              <strong>Mobile No:</strong> {currentTrainer.mobile_no}
            </p>
            <p>
              <strong>Email ID:</strong> {currentTrainer.email_id}
            </p>
            <p>
              <strong>Skills:</strong> {currentTrainer.skill_id.join(", ")}
            </p>
            <p>
              <strong>Languages Known:</strong> {currentTrainer.languages_known}
            </p>
            <p>
              <strong>Bank Name:</strong> {currentTrainer.bank_name}
            </p>
            <p>
              <strong>IFSC Code:</strong> {currentTrainer.ifsc_code}
            </p>
            <p>
              <strong>Branch Name:</strong> {currentTrainer.branch_name}
            </p>
            <p>
              <strong>Account No:</strong> {currentTrainer.account_no}
            </p>
            <p>
              <strong>GST:</strong> {currentTrainer.gst}
            </p>
            <p>
              <strong>Address:</strong> {currentTrainer.address}
            </p>
            <p>
              <strong>Pan Number:</strong> {currentTrainer.pan_number}
            </p>
            <p>
              <strong>Certifications:</strong> {currentTrainer.certification}
            </p>
            {currentTrainer.resume && (
              <a
                href={currentTrainer.resume}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Resume
              </a>
            )}
            <p></p>
            {currentTrainer.photo && (
              <a
                href={currentTrainer.photo}
                target="_blank"
                rel="noopener noreferrer"
              >
                View Photo
              </a>
            )}

            <p>
              <strong>Username:</strong> {currentTrainer.user_name}
            </p>

            {/* Pagination controls aligned to the right */}
            <div className="pagi-container">
              <button
                onClick={prevTrainer}
                disabled={currentTrainerIndex === 0}
                style={{
                  backgroundColor:
                    currentTrainerIndex === 0 ? "#f3de59" : "#F1A128",
                  cursor: currentTrainerIndex === 0 ? "not-allowed" : "pointer",
                }}
              >
                <img src={back} className="nextarrow" alt="Back Arrow" />
              </button>

              <button
                onClick={nextTrainer}
                disabled={currentTrainerIndex === trainers.length - 1}
                style={{
                  backgroundColor:
                    currentTrainerIndex === trainers.length - 1
                      ? "#f3de59"
                      : "#F1A128",
                  cursor:
                    currentTrainerIndex === trainers.length - 1
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                <img src={next} className="nextarrow" alt="Next Arrow" />
              </button>

              <p>
                Showing trainer {currentTrainerIndex + 1} of {trainers.length}
              </p>
            </div>
          </div>
        ) : (
          <p>No trainers found</p>
        )}
      </div>
    </div>
  );
};

export default TrainerList;
