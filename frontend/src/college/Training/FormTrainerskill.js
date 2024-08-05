import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { addTrainerSkillMapApi, getTrainerApi, getSkillApi } from '../../api/endpoints'

//import Select from 'react-select';


const FormTrainerSkill = () => {

    const [trainer, setTrainer] = useState([]);
    const [skill, setskill] = useState([]);

    const [selectedskillid, setSelectedskillid] = useState(null);
    const [selectedtrainer, setSelectedTrainer] = useState(null);
    const [is_handson, setactive] = useState(false);



    useEffect(() => {


        //Fetch skill  
        getTrainerApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setTrainer(data.map(item => ({ value: item.id, label: item.trainer_name })));
            })
            .catch(error => console.error('Error fetching  questions :', error));


        //Fetch course  
        getSkillApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setskill(data.map(item => ({ value: item.id, label: item.skill_name })));
            })
            .catch(error => console.error('Error fetching course Names:', error));



    }, []);

    const trainerid = selectedtrainer ? selectedtrainer.value : null;

    const skillid = selectedskillid ? selectedskillid.value : null;
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const skillmaster = {

            trainer_id: trainerid,
            skill_id: skillid,
            dt_skill_from: formData.get('dt_skill_from'),
            is_handson: is_handson,


            skill_level: formData.get('skill_level'),

            last_session: formData.get('last_session')
        };

        console.log("Result: ", skillmaster)
        console.log(selectedskillid)
        addTrainerSkillMapApi(skillmaster)
            .then((result) => {
                window.alert("skill mapped successfully");

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
                                    <Form.Group controlId='trainer'>
                                        <Form.Label>Trainer Name</Form.Label>
                                        <Select
                                            options={trainer}
                                            value={selectedtrainer}
                                            onChange={setSelectedTrainer}
                                            placeholder="Select Trainer Name"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='skill'>
                                        <Form.Label>skill Name</Form.Label>
                                        <Select
                                            options={skill}
                                            value={selectedskillid}
                                            onChange={setSelectedskillid}
                                            placeholder="Select skill Name"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row><p></p>


                            <Row>

                                <Col>
                                    <Form.Group controlId='is_handson'>
                                        <Form.Label>Is_Handson</Form.Label>
                                        <Form.Check
                                            type="switch"
                                            className="custom-switch"
                                            id="custom-switch"
                                            label=""
                                            checked={is_handson}
                                            onChange={(e) => setactive(e.target.checked)}
                                        />
                                    </Form.Group>
                                </Col>

                                <Col>
                                    <Form.Group controlId='dt_skill_from'>
                                        <Form.Label>Data of Skill from</Form.Label>
                                        <Form.Control type="datetime-local" name="dt_skill_from" required placeholder="" />
                                    </Form.Group>
                                </Col>



                            </Row> <p></p>

                            <Row>
                                <Col>
                                    <Form.Group controlId='skill_level'>
                                        <Form.Label>skill_level</Form.Label>
                                        <Form.Control type="number" name="skill_level" required placeholder="" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='last_session'>
                                        <Form.Label>last_session</Form.Label>
                                        <Form.Control type="text" name="last_session" required placeholder="" />
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

export default FormTrainerSkill;