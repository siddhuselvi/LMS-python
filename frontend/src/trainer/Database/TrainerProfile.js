import React, { useState,useEffect } from 'react';
import { Col, Row, Form, Button,Table } from 'react-bootstrap';

import { addTrainerApi,getTrainerApi, updateTrainerApi,getSkillApi, deleteTrainerApi } from '../../api/endpoints';
import Select, { components } from 'react-select';
import CustomOption from '../../Components/Test/CustomOption';
import '../../Styles/global.css'
import ErrorModal from '../../Components/auth/ErrorModal';

const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#39444e',
        color: '#fff', // Text color
        borderColor: state.isFocused ? '' : '#ffff', // Border color on focus
        boxShadow: 'none', // Remove box shadow
        '&:hover': {
            borderColor: state.isFocused ? '#ffff' : '#ffff' // Border color on hover
        },
        '&.css-1a1jibm-control': {
            // Additional styles for the specific class
        },
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px', // Smaller font size

            width: '98%'
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffff', // Text color for selected value
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px' // Smaller font size
        }
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#39444e' : state.isFocused ? '#39444e' : '#39444e',
        color: '#ffff', // Text color
        '&:hover': {
            backgroundColor: '#39444e', // Background color on hover
            color: '#ffff' // Text color on hover
        },
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px',// Smaller font size
            width: '98%'
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#39444e',
        '@media (max-width: 768px)': { // Adjust for mobile devices
            fontSize: '12px' // Smaller font size
        }
    })
};

const TrainerProfile = () => {
    const[is_active,setactive]=useState(false);
    const [trainers, setTrainers] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [skill, setSkill] = useState([]);
    const [selectedskill, setSelectedskill] = useState(null);

 const handleCloseError = () => {
      setShowError(false);
    };
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    useEffect(() => {
        getSkillApi()
        .then(data => {
            // Log data to ensure it's correctly received
            console.log("Skills data:", data);

           

            const noneOption = { value: '', label: 'None' };

    // Map data to match Select component requirements
    const formattedSkills = data.map(item => ({
        value: item.id,
        label: item.skill_name
    }));

    // Include "None" option at the beginning
    formattedSkills.unshift(noneOption);

    setSkill(formattedSkills);
        })
        .catch(error => console.error('Error fetching Skills:', error));

        loadTrainers();
    }, []);

    const loadTrainers = () => {
        getTrainerApi()
            .then(data => {
                setTrainers(data);
            })
            .catch(error => console.error('Error fetching trainers:', error));
    };
    const setSelectedTrainerData = (trainer) => {
        setSelectedTrainer(trainer);
        // Set the form fields with the selected trainer's data
        setactive(trainer.is_active);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        const mobileNumber = formData.get('mobile_no');
        const emailId = formData.get('email_id');
    
        // Mobile number validation: must be 10 digits and start with 6, 7, 8, or 9
        const mobileRegex = /^[6-9]\d{9}$/;
        if (!mobileRegex.test(mobileNumber)) {
            setErrorMessage('Invalid mobile number. It must be 10 digits and start with 6, 7, 8, or 9.');
            setShowError(true);
            return; // Stop form submission
        }
    
        // Email validation: standard email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailId)) {
            setErrorMessage('Invalid email address format.');
            setShowError(true);
            return; // Stop form submission
        }
    
        let skill_values;
        if (selectedskill && selectedskill.some(skill => skill.value === '')) {
            skill_values = []; // Store an empty array if "None" is selected
        } else {
            skill_values = selectedskill ? selectedskill.map(skill => skill.value) : null;
        }
    
        console.log('skill_value: ', skill_values);
        const pracOnlineTest = {
            trainer_name: formData.get('trainer_name') || "",
            address: formData.get('address') || "",
            city: formData.get('city') || "",
            country: formData.get('country') || "",
            qualification: formData.get('qualification') || "",
            preferred_city: formData.get('preferred_city') || "",
            is_active: is_active,
            account_no: formData.get('account_no') || "",
            email_id: emailId || "",
            mobile_no: mobileNumber || "",
            skill_id: skill_values || null,
            languages_known: formData.get('languages_known') || "",
            ifsc_code: formData.get('ifsc_code') || "",
            branch_name: formData.get('branch_name') || "",
        };
    
        console.log("Result: ", pracOnlineTest);
    
        addTrainerApi(pracOnlineTest)
            .then((result) => {
                console.log("Success:", result);
                setErrorMessage('Data Updated Successfully');
                setShowError(true);
                setSelectedskill(null);
                e.target.reset();
            })
            .catch((error) => {
                console.error("Failed to Add Data", error);
                setErrorMessage("Failed to Add. Check console for details.");
            });
    };
    
    
/*
    const handleSubmit = (e) => {
        e.preventDefault();
    
        const formData = new FormData(e.target);
        let skill_values;
        if (selectedskill && selectedskill.some(skill => skill.value === '')) {
            skill_values = [];  // Store an empty array if "None" is selected
        } else {
            skill_values = selectedskill ? selectedskill.map(skill => skill.value) : null;
        }
    
        console.log('skill_value: ', skill_values);
        const pracOnlineTest = {
            trainer_name: formData.get('trainer_name')||"",
            address:formData.get('address')||"",
            city:formData.get('city')||"",
           country: formData.get('country')||"",
           qualification:formData.get('qualification')||"",
           preferred_city:formData.get('preferred_city')||"",
           is_active:is_active,
           account_no:formData.get('account_no')||"",
           email_id: formData.get('email_id')||"",
           mobile_no:formData.get('mobile_no')||"",
           skill_id: skill_values || null,
         
           languages_known: formData.get('languages_known')||"",
           ifsc_code:formData.get('ifsc_code')||"",
           branch_name:formData.get('branch_name')||"",
        };
    
        console.log("Result: ", pracOnlineTest);
    
        addTrainerApi(pracOnlineTest)
            .then((result) => {
                console.log("Success:", result);
                setErrorMessage('Data Updated Successfully');
                setShowError(true);
                setSelectedskill(null);
                e.target.reset();
             
            })
            .catch((error) => {
                console.error("Failed to Add Data", error);
                setErrorMessage("Failed to Add. Check console for details.");
            });
    };*/
  
    return (
        <div className='form-ques'>
            <div className='form-ques'>
                <h5 style={{color:"white"}}>Add Trainers Profile </h5><p></p>
                <Row>
                    <Col >
                        <form onSubmit={handleSubmit}>
                            <Row md={12}>
                                <Col>
                                    <div controlId='trainer_name' >
                                        <label className='label5-ques'>Trainer Name</label><p></p>
                                       <input className='input-ques'type="text" name="trainer_name"  autocomplete="off"required placeholder="" />
                                    </div>
                                </Col>
                                <Col>
                                    <div controlId='address' >
                                        <label className='label5-ques'>Address</label><p></p>
                                       <input className='input-ques'type="text" name="address" autocomplete="off"  required placeholder="" />
                                    </div>
                                </Col>
                                <Col>
                                    <div controlId='city'>
                                        <label className='label5-ques'>City</label><p></p>
                                       <input className='input-ques'type="text" name="city"  autocomplete="off" required placeholder="" />
                                    </div>
                                </Col>
                            </Row> <p></p>

                            <Row md={12}>
                           
                                <Col>
                                    <div controlId='country'>
                                        <label className='label5-ques'>Country</label><p></p>
                                       <input className='input-ques'type="text" name="country"  autocomplete="off" required placeholder="" />
                                    </div>
                                </Col> 
                                
                                
                           
                            <Col>
                                    <div controlId='qualification'>
                                        <label className='label5-ques'>Qualification</label><p></p>
                                       <input className='input-ques'type="text" name="qualification"  autocomplete="off" required placeholder="" />
                                    </div>
                                </Col>
                                <Col>
                                    <div controlId='preferred_city'>
                                        <label className='label5-ques'>Preferred_City</label><p></p>
                                       <input className='input-ques'type="text" name="preferred_city"  autocomplete="off" required placeholder="" />
                                    </div>
                                </Col> 
                                
                               
                            </Row> <p></p>
                            <Row md={12}>
                           
                           <Col>
                               <div controlId='mobile_no'>
                                   <label className='label5-ques'>Mobile No</label><p></p>
                                  <input className='input-ques'type="text" name="mobile_no" autocomplete="off" required placeholder="" />
                               </div>
                           </Col> 
                           
                           
                      
                       <Col>
                               <div controlId='email_id'>
                                   <label className='label5-ques'>Email Id</label><p></p>
                                  <input className='input-ques'type="text" name="email_id"  autocomplete="off" required placeholder="" />
                               </div>
                           </Col>
                           <Col>
                                            <div className='add-profile' controlId='skill_id'>
                                                <label className='label6-ques'>Skills**</label><p></p>
                                                <Select
                                                    options={skill}
                                                    value={selectedskill}
                                                    onChange={setSelectedskill}
                                                    placeholder="Select skill"
                                                    isMulti
                                                    styles={customStyles}  // Verify that customStyles is not causing issues
                                                    components={{ Option: CustomOption }}
                                                    closeMenuOnSelect={false} // Keep the menu open when selecting multiple options
                                                />
                                            </div>
                                        </Col>
                          
                       </Row> <p></p>
                       <Row md={12}>
                           
                           <Col>
                               <div controlId='languages_known'>
                                   <label className='label5-ques'>Languages Known</label><p></p>
                                  <input className='input-ques'type="text" name="languages_known"  autocomplete="off" required placeholder="" />
                               </div>
                           </Col> 
                           
                           
                      
                       <Col>
                               <div controlId='ifsc_code'>
                                   <label className='label5-ques'>Ifsc Code</label><p></p>
                                  <input className='input-ques'type="text" name="ifsc_code"  autocomplete="off" required placeholder="" />
                               </div>
                           </Col>
                           <Col>
                               <div controlId='branch_name'>
                                   <label className='label5-ques'>Branch Name</label><p></p>
                                  <input className='input-ques'type="text" name="branch_name"  autocomplete="off" required placeholder="" />
                               </div>
                           </Col> 
                           
                          
                       </Row> <p></p>

                            <Row md={12}>
                            <Col>
                               <div controlId='account_no'>
                                   <label className='label5-ques'>Account No</label><p></p>
                                  <input className='input-ques'type="text"  autocomplete="off" name="account_no" required placeholder="" />
                               </div>
                           </Col> 
                           
                                <Col>
            <div controlId='is_active'>
                <label className='label5-ques'>Is_Active</label><p></p>
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
                            </Row> <p></p>
                            <div>
                                <button className='button-ques-save' type="submit" style={{ width: '100px',marginLeft:"350px" }}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </Col>
                   
                </Row> <p></p>
            </div>

            <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />


                   </div>
    );

};

export default TrainerProfile;