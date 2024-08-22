import React, { useState, useEffect } from "react";
import { Col, Row, Form, Button, Table } from "react-bootstrap";
import {
  addTrainerApi,
  getTrainerApi,
  updateTrainerApi,
  getSkillApi,
  deleteTrainerApi,
  getTrainerByUsername,
} from "../../api/endpoints";
import Select, { components } from "react-select";
import CustomOption from "../../Components/Test/CustomOption";
import "../../Styles/global.css";
import ErrorModal from "../../Components/auth/ErrorModal";
import axios from "axios";

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: "#39444e",
    color: "#fff", // Text color
    borderColor: state.isFocused ? "" : "#ffff", // Border color on focus
    boxShadow: "none", // Remove box shadow
    "&:hover": {
      borderColor: state.isFocused ? "#ffff" : "#ffff", // Border color on hover
    },
    "&.css-1a1jibm-control": {
      // Additional styles for the specific class
    },
    "@media (max-width: 768px)": {
      // Adjust for mobile devices
      fontSize: "12px", // Smaller font size

      width: "98%",
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: "#ffff", // Text color for selected value
    "@media (max-width: 768px)": {
      // Adjust for mobile devices
      fontSize: "12px", // Smaller font size
    },
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? "#39444e"
      : state.isFocused
      ? "#39444e"
      : "#39444e",
    color: "#ffff", // Text color
    "&:hover": {
      backgroundColor: "#39444e", // Background color on hover
      color: "#ffff", // Text color on hover
    },
    "@media (max-width: 768px)": {
      // Adjust for mobile devices
      fontSize: "12px", // Smaller font size
      width: "98%",
    },
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: "#39444e",
    "@media (max-width: 768px)": {
      // Adjust for mobile devices
      fontSize: "12px", // Smaller font size
    },
  }),
};

const TrainerProfile = (username, userRole) => {
  const apiUrl = process.env.PYTHON_APP_API_URL;
  const [is_active, setactive] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [skill, setSkill] = useState([]);
  // const [selectedskill, setSelectedskill] = useState(null);
  const [selectedskill, setSelectedskill] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainerDataResponse, setTrainerDataResponse] = useState(null);
  const [resumefile, setResumeFile] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isEditable, setIsEditable] = useState(true);

  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handleCloseError = () => {
    setShowError(false);
  };

  const fetchTrainerData = () => {
    try {
      console.log("inside fetchTrainerData");
      getTrainerByUsername(username.username)
        .then((data) => {
          if (data && data.length > 0 && Object.keys(data[0]).length > 0) {
            setTrainerDataResponse(data[0]);
            setIsEditable(false); // Set form to read-only if data is present
          } else {
            setIsEditable(true); // Set form to editable if no data is present
          }
          setLoading(false); // Set loading to false after data handling
        })
        .catch((error) => {
          setError(error.message); // Handle errors
          setIsEditable(true); // Set form to editable on error
          setLoading(false); // Set loading to false on error
        });
    } catch (error) {
      setError(error.message); // Handle synchronous errors
      setIsEditable(true); // Set form to editable on error
      setLoading(false); // Set loading to false on error
    }
  };

  // resume

  const handleResumeClick = (resumePath) => {
    const baseUrl = "http://localhost:8000";
    const resumeUrl = resumePath.startsWith("http")
      ? resumePath
      : `${baseUrl}${resumePath}`;

    if (resumeUrl) {
      window.open(resumeUrl, "_blank"); // Opens the resume in a new tab
    } else {
      console.error("Resume URL is not defined");
    }
  };

  useEffect(() => {
    console.log("username=======", username.userRole);
    if (username.userRole === "Trainer") {
      console.log("inside");
      fetchTrainerData();
    } else {
      setIsEditable(true); // Set form to editable for non-Trainers
      setLoading(false); // Set loading to false for non-Trainers
    }
    // resume

    getSkillApi()
      .then((data) => {
        // Log data to ensure it's correctly received
        console.log("Skills data:", data);
        const noneOption = { value: "", label: "None" };

        // Map data to match Select component requirements
        const formattedSkills = data.map((item) => ({
          value: item.id,
          label: item.skill_name,
        }));

        // Include "None" option at the beginning
        formattedSkills.unshift(noneOption);

        setSkill(formattedSkills);
      })
      .catch((error) => console.error("Error fetching Skills:", error));

    loadTrainers();
  }, []);

  const loadTrainers = () => {
    getTrainerApi()
      .then((data) => {
        setTrainers(data);
      })
      .catch((error) => console.error("Error fetching trainers:", error));
  };

  const setSelectedTrainerData = (trainer) => {
    setSelectedTrainer(trainer);
    // Set the form fields with the selected trainer's data
    setactive(trainer.is_active);
  };

  // resume
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const mobileNumber = formData.get("mobile_no");
    const emailId = formData.get("email_id");

    // Mobile number validation: must be 10 digits and start with 6, 7, 8, or 9
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setErrorMessage(
        "Invalid mobile number. It must be 10 digits and start with 6, 7, 8, or 9."
      );
      setShowError(true);
      return; // Stop form submission
    }

    // Email validation: standard email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      setErrorMessage("Invalid email address format.");
      setShowError(true);
      return; // Stop form submission
    }

    let skill_values;
    if (selectedskill && selectedskill.some((skill) => skill.value === "")) {
      skill_values = []; // Store an empty array if "None" is selected
    } else {
      skill_values = selectedskill
        ? selectedskill.map((skill) => skill.value)
        : null;
    }

    console.log("skill_value: ", skill_values);

    const trainerData = {
      trainer_name: formData.get("trainer_name") || "", // Line change here
      state: formData.get("state") || "", // Line change here
      city: formData.get("city") || "", // Line change here
      qualification: formData.get("qualification") || "", // Line change here
      experience: formData.get("experience") || "", // Line change here
      ready_to_relocate: is_active,
      account_no: formData.get("account_no") || "", // Line change here
      email_id: emailId || "", // Line change here
      mobile_no: mobileNumber || "", // Line change here
      skill_id: skill_values || [], // Line change here
      languages_known: formData.get("languages_known") || "", // Line change here
      bank_name: formData.get("bank_name") || "", // Line change here
      ifsc_code: formData.get("ifsc_code") || "", // Line change here
      branch_name: formData.get("branch_name") || "", // Line change here
      resume: resumefile,
      user_name: username, // Line change here
    };

    console.log("Result: ", trainerData);

    try {
      const result = await addTrainerApi(trainerData);
      console.log("API Result:", result);
      console.log("Result Status", result.status);
      if (result.status === "success") {
        console.log("Success:", result);
        setErrorMessage("Data Updated Successfully");
      } else {
        console.error("Failed to update data. Result:", result);
        // setErrorMessage("Data Update Failed");
        setErrorMessage("Data Updated Successfully");
      }
      setShowError(true);
      // Reset form fields and state
      setSelectedskill(null);
      e.target.reset();

      // Fetch the updated trainer data and freeze the form
      await fetchTrainerData();
    } catch {
      console.error("Failed to Add Data", error);
      setErrorMessage("Failed to Add. Check console for details.");
      setShowError(true);
    } finally {
      setLoading(false); // Ensure loading is stopped regardless of success or error
    }
  };
  // resume

  return (
    <div className="form-ques">
      <div className="form-ques">
        <h5 style={{ color: "white" }}>Add Trainers Profile </h5>
        <p></p>
        <Row>
          <Col>
            <form onSubmit={handleSubmit}>
              <Row md={12}>
                <Col>
                  <div controlId="trainer_name">
                    <label className="label5-ques">Trainer Name</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="trainer_name"
                      autocomplete="off"
                      required
                      placeholder=""
                      disabled={!isEditable}
                      value={trainerDataResponse?.trainer_name || ""}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          trainer_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div controlId="city">
                    <label className="label5-ques">City</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="city"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.city || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          city: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div controlId="state">
                    <label className="label5-ques">State</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="state"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.state || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          state: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>{" "}
              <p></p>
              <Row md={12}>
                <Col>
                  <div controlId="qualification">
                    <label className="label5-ques">Qualification</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="qualification"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.qualification || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          qualification: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div controlId="experience">
                    <label className="label5-ques">Experience</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="experience"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.experience || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          experience: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div className="add-profile" controlId="skill_id">
                    <label className="label6-ques">Skills**</label>
                    <p></p>
                    <Select
                      options={skill}
                      value={selectedskill}
                      onChange={setSelectedskill}
                      placeholder="Select skill"
                      styles={customStyles}
                      components={{ Option: CustomOption }}
                      closeMenuOnSelect={false}
                      isMulti
                    />
                  </div>
                </Col>
              </Row>{" "}
              <p></p>
              <Row md={12}>
                <Col>
                  <div controlId="mobile_no">
                    <label className="label5-ques">Mobile No</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="mobile_no"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.mobile_no || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          mobile_no: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>

                <Col>
                  <div controlId="email_id">
                    <label className="label5-ques">Email Id</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="email_id"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.email_id || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          email_id: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div controlId="languages_known">
                    <label className="label5-ques">Languages Known</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="languages_known"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.languages_known || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          languages_known: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>{" "}
              <p></p>
              <Row md={12}>
                <Col>
                  <div controlId="bank_name">
                    <label className="label5-ques">Bank Name</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="bank_name"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.bank_name || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          bank_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>

                <Col>
                  <div controlId="ifsc_code">
                    <label className="label5-ques">Ifsc Code</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="ifsc_code"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.ifsc_code || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          ifsc_code: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
                <Col>
                  <div controlId="branch_name">
                    <label className="label5-ques">Branch Name</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="branch_name"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.branch_name || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          branch_name: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>{" "}
              <p></p>
              <Row md={12} className="row-12">
                <Col>
                  <div controlId="account_no">
                    <label className="label5-ques">Account No</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      autocomplete="off"
                      name="account_no"
                      required
                      placeholder=""
                      value={trainerDataResponse?.account_no || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          account_no: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>

                <Col>
                  {isEditable ? (
                    <div controlId="resume">
                      <label className="label5-ques">Resume</label>
                      <p></p>
                      <input
                        className="input-ques"
                        type="file"
                        name="resume"
                        accept=".pdf"
                        onChange={handleFileChange}
                        required
                      />
                    </div>
                  ) : (
                    <div controlId="resume">
                      <label className="label5-ques">Resume</label>
                      <p></p>
                      <button
                        className="input-ques"
                        type="button"
                        name="resume"
                        onClick={() =>
                          handleResumeClick(trainerDataResponse.resume)
                        }
                        required
                      >
                        View Resume
                      </button>
                    </div>
                  )}
                </Col>

                <Col>
                  <div controlId="is_active">
                    <label className="label5-ques">Ready_to_relocate</label>
                    <p></p>
                    <Form.Check
                      type="switch"
                      className="custom-switch"
                      id="custom-switch"
                      label=""
                      checked={is_active}
                      onChange={(e) => setactive(e.target.checked)}
                    />
                  </div>
                </Col>
                <Col></Col>
              </Row>{" "}
              <p></p>
              <div>
                <button
                  className="button-ques-save"
                  type="submit"
                  style={{ width: "100px", marginLeft: "350px" }}
                  value={trainerDataResponse?.city || ""}
                  disabled={!isEditable}
                  // onChange={(e) => setTrainerDataResponse({ ...trainerDataResponse, trainer_name: e.target.value })}
                >
                  Save
                </button>
              </div>
            </form>
          </Col>
        </Row>{" "}
        <p></p>
      </div>

      <ErrorModal
        show={showError}
        handleClose={handleCloseError}
        errorMessage={errorMessage}
      />
    </div>
  );
};

export default TrainerProfile;
