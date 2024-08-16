import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { addSkillApi,getSkilltypeApi, gettopicApi } from '../../api/endpoints'

//import Select from 'react-select';


const Skillform = () => {
    
    const [skilltypes, setskilltypes] = useState([]);
    const [selectedskilltypes, setSelectedskilltypes] = useState([]);
   


    useEffect(() => {
       
        getSkilltypeApi()
        .then(data => {
            setskilltypes(data.map(item => ({ value: item.id, label: item.skill_type })))
        })
    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        
        const skillId = selectedskilltypes ? selectedskilltypes.value : null;

        const formData = new FormData(e.target);

        const skillmaster = {
            skill_name: formData.get('skill_name'),
            skill_type_id: skillId,
           




        };

        console.log("Result: ", skillmaster)

        addSkillApi(skillmaster)
            .then((result) => {
                window.alert("Skill added successfully");

            })
            .catch((error) => {
                console.error("Failed to Add Data", error);  // Log the error to the console
                alert("Failed to Add. Check console for details.");
            });
    };

    return (
        <div>
            <div className='test'>

                <Row>
                    <Col sm={6}>
                        <Form onSubmit={handleSubmit}>

                            <Row>
                                <Col>
                                    <Form.Group controlId='skill_name'>
                                        <Form.Label>skill_name</Form.Label>
                                        <Form.Control type="text" name="skill_name" required placeholder="" />
                                    </Form.Group>
                                </Col>


                              

                            </Row> <p></p>
                          
                               
                            <Row>
                                <Col>
                                    <Form.Group controlId='skill-type'>
                                        <Form.Label>Skill Type</Form.Label>
                                        <Select
                                            options={skilltypes}
                                            value={selectedskilltypes}
                                            onChange={setSelectedskilltypes}
                                            placeholder="Select skilltypes"
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


        </div>
    );

};

export default Skillform;