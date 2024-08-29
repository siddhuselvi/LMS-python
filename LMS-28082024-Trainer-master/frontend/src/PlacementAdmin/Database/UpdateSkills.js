import React, { useState, useEffect } from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { updateSkillApi, getSkilltypeApi } from '../../api/endpoints';

const UpdateSkills = (props) => {
    const [skillTypes, setSkillTypes] = useState([]);

    const [selectedSkillTypes, setSelectedSkillTypes] = useState(null);

    useEffect(() => {
        getSkilltypeApi()
        .then(data => {
            console.log("Skill Type Data Received: ", data);
            setSkillTypes(data.map(item => ({ value: item.id, label: item.skill_type })));
        })
        .catch(error => console.error('Error Fetching Skill Types: ', error));
    }, []);

    const skillid = selectedSkillTypes ? selectedSkillTypes.value : null;
    
    const handleSubmit = async(e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const skills = {
            skill_name: formData.get('skill_name'),
            skill_type_id: skillid
        };
        console.log('Result: ', skills);

        try {
            const result = await updateSkillApi(props.skill.id, skills);
            alert('Skills Updated');
            props.setUpdated(true);
        } catch (error) {
            console.error('Failed to Update skills:', error);
            alert(`Failed to Update skills: ${error.message}`);
        }
    };

    return (
        <div>
            <div className='test'>

                <Modal
                    {...props}
                    size="md"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered >

                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Update Questions Information
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Col sm={6}>
                                <Form onSubmit={handleSubmit}>
                                    <Row>
                                        <Col>
                                            <Form.Group controlId='skill_name'>
                                                <Form.Label>skill Name</Form.Label>
                                                <Form.Control type="text" name="skill_name"  required defaultValue={props.skill?.skill_name || ''} placeholder="" />
                                            </Form.Group>
                                        </Col>

                                        <Col>
                                            <Form.Group controlId='questiontype'>
                                                <Form.Label>Question Typpe</Form.Label>
                                                <Select
                                                    options={skillTypes}
                                                    value={selectedSkillTypes}
                                                    onChange={setSelectedSkillTypes}
                                                    required defaultValue={props.skill?.skill_type_id || ''}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row><p></p>

                                    <Form.Group>
                                        <Button  type="submit" style={{ width: '70px', backgroundColor: 'orange' }}>
                                            Save
                                        </Button>
                                    </Form.Group>
                                </Form>
                            </Col>
                        </Row> <p></p>

                    </Modal.Body>
                </Modal>
            </div>


        </div>
    );
};

export default UpdateSkills;




















