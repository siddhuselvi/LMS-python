import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap'; // Ensure Table is imported here
import FormTrainerSkill from './FormTrainerskill';
import { getTrainerSkillMapApi } from '../../api/endpoints';

const Learning= ({ showModal, setShowModal }) => {
    const handleClose = () => setShowModal(false);

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>SkillMap</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormTrainerSkill />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const SkillMap = () => {
    const [showModal, setShowModal] = useState(false);
    const [courseschdl, setcourseschdl] = useState([]);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        getskill();
    }, []);

    const getskill = () => {
      getTrainerSkillMapApi()
            .then(data => {
                setcourseschdl(data);
            })
            .catch(error => console.error('Error fetching test contents:', error));
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShowModal}>
                Add 
            </Button>
            <Learning showModal={showModal} setShowModal={setShowModal} />
    <br></br><br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                       
                        <th>Trainer</th>
                        <th>Skill Name</th>
                        <th>Skill_level</th>
                        <th>Date fo skill from</th>
                        <th>Is_handson</th>
                        <th>Last_session</th>
                       
                        
                    </tr>
                </thead>
                <tbody>
                    {courseschdl.map(content => (
                        <tr key={content.id}>
                           
                            <td>{content.trainer_id}</td>
                           <td>{content.skill_id}</td>
                            <td>{content.skill_level}</td>
                            <td>{content.dt_skill_from}</td>
                           <td>{content.is_handson}</td>
                           <td>{content.last_session}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default SkillMap;
