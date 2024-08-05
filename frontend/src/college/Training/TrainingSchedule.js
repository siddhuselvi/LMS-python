import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap'; // Ensure Table is imported here
import FormSchedule from './FormSchedule'
import { getCourseScheduleApi } from '../../api/endpoints';

const Learning= ({ showModal, setShowModal }) => {
    const handleClose = () => setShowModal(false);

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>TrainingSchedule</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <FormSchedule />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const TrainingSchedule = () => {
    const [showModal, setShowModal] = useState(false);
    const [courseschdl, setcourseschdl] = useState([]);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        getcourseschedule();
    }, []);

    const getcourseschedule = () => {
      getCourseScheduleApi()
            .then(data => {
                setcourseschdl(data);
            })
            .catch(error => console.error('Error fetching test contents:', error));
    };

    return (
        <div>
            <Button variant="primary" onClick={handleShowModal}>
                Add Content
            </Button>
            <Learning showModal={showModal} setShowModal={setShowModal} />
    <br></br><br></br>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Course</th>
                        <th>Trainer</th>
                        <th>Student Name</th>
                        <th>StartDate</th>
                        <th>EndDate</th>
                        <th>Course_mode</th>
                        <th>Status</th>
                       
                        
                    </tr>
                </thead>
                <tbody>
                    {courseschdl.map(content => (
                        <tr key={content.id}>
                            <td>{content.course_id}</td>
                            <td>{content.trainer_id}</td>
                           <td>{content.student_id}</td>
                            <td>{content.dtm_start}</td>
                            <td>{content.dtm_end}</td>
                           <td>{content.course_mode}</td>
                           <td>{content.status}</td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    );
};

export default TrainingSchedule;
