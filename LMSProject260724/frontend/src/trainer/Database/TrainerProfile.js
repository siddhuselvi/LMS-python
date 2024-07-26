import React, { useState,useEffect } from 'react';
import { Col, Row, Form, Button,Table } from 'react-bootstrap';

import { addTrainerApi,getTrainerApi, updateTrainerApi, deleteTrainerApi } from '../../api/endpoints';

import '../../Styles/global.css'
import ErrorModal from '../../Components/auth/ErrorModal';


const TrainerProfile = () => {
    const[is_active,setactive]=useState(false);
    const [trainers, setTrainers] = useState([]);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
  
    const handleCloseError = () => {
      setShowError(false);
    };
    const [selectedTrainer, setSelectedTrainer] = useState(null);
    useEffect(() => {
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
    
        const pracOnlineTest = {
            trainer_name: formData.get('trainer_name'),
            address:formData.get('address'),
            city:formData.get('city'),
           country: formData.get('country'),
           qualification:formData.get('qualification'),
           preferred_city:formData.get('preferred_city'),
           is_active:is_active,
           account_no:formData.get('account_no'),
           email_id: formData.get('email_id'),
           mobile_no:formData.get('mobile_no'),
           skills:formData.get('skills'),
           languages_known: formData.get('languages_known'),
           ifsc_code:formData.get('ifsc_code'),
           branch_name:formData.get('branch_name'),
        };
    
        console.log("Result: ", pracOnlineTest);
    
        addTrainerApi(pracOnlineTest)
            .then((result) => {
                console.log("Success:", result);
                setErrorMessage('Data Updated Successfully');
                setShowError(true);
              //  window.alert("Trainer added successfully");
               // Clear selected item
            })
            .catch((error) => {
                console.error("Failed to Add Data", error);
                setErrorMessage("Failed to Add. Check console for details.");
            });
    };
  
    const handleUpdate = (trainerId) => {
        const formData = new FormData(document.getElementById('trainerForm'));
        const updatedTrainer = {
            trainer_name: formData.get('trainer_name'),
            address: formData.get('address'),
            city: formData.get('city'),
            country: formData.get('country'),
            qualification: formData.get('qualification'),
            preferred_city: formData.get('preferred_city'),
            is_active: is_active,
        };
    
        updateTrainerApi(trainerId, updatedTrainer)
            .then((result) => {
                console.log("Success:", result);
                window.alert("Trainer updated successfully");
                loadTrainers();
            })
            .catch((error) => {
                console.error("Failed to Update Trainer", error);
                alert("Failed to update. Check console for details.");
            });
    };
    

    const handleDelete = (trainerId) => {
        deleteTrainerApi(trainerId)
            .then(() => {
                console.log("Trainer deleted successfully");
                loadTrainers();
            })
            .catch((error) => {
                console.error("Failed to Delete Trainer", error);
                alert("Failed to delete. Check console for details.");
            });
    };


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
                                  <input className='input-ques'type="text" name="mobile_no" required placeholder="" />
                               </div>
                           </Col> 
                           
                           
                      
                       <Col>
                               <div controlId='email_id'>
                                   <label className='label5-ques'>Email Id</label><p></p>
                                  <input className='input-ques'type="text" name="email_id"  autocomplete="off" required placeholder="" />
                               </div>
                           </Col>
                           <Col>
                               <div controlId='skills'>
                                   <label className='label5-ques'>Skills</label><p></p>
                                  <input className='input-ques'type="text" name="skills"  autocomplete="off" required placeholder="" />
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