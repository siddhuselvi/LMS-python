import React, { useState, useEffect } from "react";
import { Col, Row, Form, Button, Table } from "react-bootstrap";
import {
  trainer_create_view,
  getTrainerApi,
  trainer_update_view,
  getSkillApi,
  deleteTrainerApi,
  getTrainerByUsername,
} from "../../api/endpoints";
import Select, { components } from "react-select";
import CustomOption from "../../Components/Test/CustomOption";
import "../../Styles/global.css";
import ErrorModal from "../../Components/auth/ErrorModal";
import axios from "axios";
// import Cookies from "js-cookie";

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
  const [selectedskill, setSelectedskill] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainerDataResponse, setTrainerDataResponse] = useState(null);
  const [resumefile, setResumeFile] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [isEditable, setIsEditable] = useState(true);
  const [trainerData, setTrainerData] = useState(null);
  const [trainerName, setTrainerName] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const handleFileChange = (event) => {
    setResumeFile(event.target.files[0]);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhotoFile(file);
  };

  const handlePhotoClick = (photoBinary) => {
    const blob = new Blob([photoBinary], { type: "image/jpeg" }); // Adjust MIME type as needed
    const url = URL.createObjectURL(blob);
    window.open(url); // Open the photo in a new tab or window
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
            setImageUrl(`data:image/jpeg;base64,${data[0].photo}`);
            console.log("image url------------", imageUrl);
            setIsEditable(false);
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

  // const handlePhotoResultClick = (photo) => {
  //   if (photo) {
  //     window.open(photo); // Opens the resume in a new tab
  //   } else {
  //     console.error("Resume URL is not defined");
  //   }
  // };

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
    setIsSubmitting(true);
    const formData = new FormData(e.target);

    // Validate mobile number and email ID
    const mobileNumber = formData.get("mobile_no");
    const emailId = formData.get("email_id");

    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobileNumber)) {
      setErrorMessage("Invalid mobile number.");
      setShowError(true);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailId)) {
      setErrorMessage("Invalid email address format.");
      setShowError(true);
      return;
    }

    // Append skills if any
    let skill_values =
      selectedskill && selectedskill.length > 0
        ? selectedskill.map((skill) => skill.value)
        : [];
    formData.append("skills", JSON.stringify(skill_values));

    // Append photo if exists
    if (photoFile) {
      formData.append("photo_file", photoFile);
    }
    formData.append("user_name", username.username);

    try {
      setLoading(true);
      const result = await trainer_create_view(formData);
      if (result.status !== null) {
        setErrorMessage("Data Updated Successfully");
        setShowError(true);
        setSelectedskill(null);
        e.target.reset();
        await fetchTrainerData();
      } else {
        console.error("Failed to update data:", result);
        setErrorMessage(
          `Data Update Failed: ${result.message || "Unknown error"}`
        );
        setShowError(true);
      }
    } catch (error) {
      console.error("Failed to Add Data", error);
      setErrorMessage("Failed to Add. Check console for details.");
      setShowError(true);
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

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
              </Row>
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
              </Row>
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
              </Row>
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
              </Row>
              <p></p>

              <Row md={12}>
                <Col>
                  <div controlId="address">
                    <label className="label5-ques">Address</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="address"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.address || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          address: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>

                <Col>
                  <div controlId="pan_number">
                    <label className="label5-ques">Pan Number</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="pan_number"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.pan_number || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          pan_number: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>

                <Col>
                  <div controlId="gst">
                    <label className="label5-ques">GST</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="gst"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.gst || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          gst: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>
              </Row>
              <p></p>
              <Row md={12}>
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
                  {isEditable ? (
                    <div controlId="photo">
                      <label className="label5-ques">Photo</label>
                      <p></p>
                      <input
                        className="input-ques"
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={handlePhotoChange}
                        required
                        // value={trainerDataResponse?.photo || ""}
                      />
                    </div>
                  ) : (
                    <div controlId="photo">
                      <label className="label5-ques">photo</label>
                      <p></p>
                      <button
                        className="input-ques"
                        type="button"
                        name="photo"
                        onClick={() => {
                          // handlePhotoResultClick(imageUrl);
                        }}
                        required
                      >
                        Photo
                      </button>
                    </div>
                  )}
                </Col>
              </Row>
              <p></p>
              <Row md={12}>
                <Col>
                  <div controlId="certification">
                    <label className="label5-ques">Certifications</label>
                    <p></p>
                    <input
                      className="input-ques"
                      type="text"
                      name="certification"
                      autocomplete="off"
                      required
                      placeholder=""
                      value={trainerDataResponse?.certification || ""}
                      disabled={!isEditable}
                      onChange={(e) =>
                        setTrainerDataResponse({
                          ...trainerDataResponse,
                          certification: e.target.value,
                        })
                      }
                    />
                  </div>
                </Col>

                <Col>
                  <div controlId="is_active">
                    <label className="label5-ques">Ready To Relocate</label>
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
              </Row>
              <p></p>
              <div>
                <button
                  className="button-ques-save"
                  type="submit"
                  style={{ width: "100px", marginLeft: "45%" }}
                  value={trainerDataResponse?.city || ""}
                  disabled={!isEditable}
                  // onChange={(e) => setTrainerDataResponse({ ...trainerDataResponse, trainer_name: e.target.value })}
                >
                  Save
                </button>
              </div>
            </form>
          </Col>
        </Row>
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
