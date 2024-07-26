import React, { useState,useEffect } from 'react';
import { Col, Row, Form, Button,Table } from 'react-bootstrap';

import { addTrainerApi,getTrainerApi, updateTrainerApi, deleteTrainerApi } from '../../api/endpoints';





const TrainerProfile = () => {
    const[is_active,setactive]=useState(false);
    const [trainers, setTrainers] = useState([]);

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
           
           
        };
    
        console.log("Result: ", pracOnlineTest);
    
        addTrainerApi(pracOnlineTest)
            .then((result) => {
                console.log("Success:", result);
                window.alert("Trainer added successfully");
               // Clear selected item
            })
            .catch((error) => {
                console.error("Failed to Add Data", error);
                alert("Failed to Add. Check console for details.");
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
        <div>
            <div className='test'>
                <h4 className='h4'>Add Trainers Profile </h4>
                <Row>
                    <Col sm={6}>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                                <Col>
                                    <Form.Group controlId='trainer_name'>
                                        <Form.Label style={{ marginRight: '8px' }}>Test Name</Form.Label>
                                        <Form.Control type="text" name="trainer_name" required placeholder="" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='address'>
                                        <Form.Label style={{ marginRight: '8px' }}>Address</Form.Label>
                                        <Form.Control type="text" name="address" required placeholder="" />
                                    </Form.Group>
                                </Col>
                               
                            </Row> <p></p>

                            <Row>
                            <Col>
                                    <Form.Group controlId='city'>
                                        <Form.Label style={{ marginRight: '8px' }}>City</Form.Label>
                                        <Form.Control type="text" name="city" required placeholder="" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='country'>
                                        <Form.Label style={{ marginRight: '8px' }}>Country</Form.Label>
                                        <Form.Control type="text" name="country" required placeholder="" />
                                    </Form.Group>
                                </Col> 
                                
                                
                            </Row> <p></p>
                           
                            <Row>
                            <Col>
                                    <Form.Group controlId='qualification'>
                                        <Form.Label style={{ marginRight: '8px' }}>Qualification</Form.Label>
                                        <Form.Control type="text" name="qualification" required placeholder="" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='preferred_city'>
                                        <Form.Label style={{ marginRight: '8px' }}>Preferred_City</Form.Label>
                                        <Form.Control type="text" name="preferred_city" required placeholder="" />
                                    </Form.Group>
                                </Col> 
                                
                               
                            </Row> <p></p>

                          

                            <Row>
                                
                                <Col>
            <Form.Group controlId='is_active'>
                <Form.Label>Is_Active</Form.Label>
                <Form.Check
                    type="switch"
                    className="custom-switch"
                    id="custom-switch"
                    label=""
                    checked={is_active}
                    onChange={(e) => setactive(e.target.checked)}
                />
            </Form.Group>
        </Col>
                               
                            </Row> <p></p>
                            <Form.Group>
                                <Button variant="primary" type="submit" style={{ width: '70px' }}>
                                    Save
                                </Button>
                            </Form.Group>
                        </Form>
                    </Col>
                </Row> <p></p>
            </div>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>Trainer Name</th>
                        <th>Address</th>
                        <th>City</th>
                        <th>Country</th>
                        <th>Qualification</th>
                        <th>Preferred City</th>
                        <th>Active</th>
                    {/*}    <th>Actions</th>    */}
                       
                    </tr>
                </thead>
                <tbody>
                    {trainers.map((trainer, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{trainer.trainer_name}</td>
                            <td>{trainer.address}</td>
                            <td>{trainer.city}</td>
                            <td>{trainer.country}</td>
                            <td>{trainer.qualification}</td>
                            <td>{trainer.preferred_city}</td>
                            <td>{trainer.is_active ? 'Yes' : 'No'}</td>
                    {/*}    <td>    
                                <td>
                                <Button variant="info" onClick={() => setSelectedTrainerData(trainer)}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDelete(trainer.id)}>Delete</Button>
                                <Button variant="success" onClick={() => handleUpdate(trainer.id)}>Update</Button>
                                </td>
                            </td>    */}
                        </tr>
                    ))}
                </tbody>
            </Table>

                   </div>
    );

};

export default TrainerProfile;