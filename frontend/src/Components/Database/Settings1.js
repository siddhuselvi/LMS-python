import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap'; // Ensure Table is imported here
import FormModal from './FormModal';
import { getcoursemasterApi } from '../../api/endpoints';
//import Buttons from './Button';
import '../../Styles/global.css'
const Learning= ({ showModal, setShowModal }) => {
    const handleClose = () => setShowModal(false);

    return (
        <Modal show={showModal} onHide={handleClose}>
            <Modal.Header closeButton style={{ background: 'linear-gradient(to right, #3366FF, #FF66CC)' }}>
                <Modal.Title style={{ color: 'white' }}>Course Master</Modal.Title>
            </Modal.Header>
            
            <Modal.Body>
                <FormModal />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

const Settings1 = () => {
    const [showModal, setShowModal] = useState(false);
    const [testcourse, setTestcourse] = useState([]);

    const handleShowModal = () => setShowModal(true);

    useEffect(() => {
        getTestcourse();
    }, []);

    const getTestcourse = () => {
        getcoursemasterApi()
            .then(data => {
                setTestcourse(data);
            })
            .catch(error => console.error('Error fetching test course:', error));
    };

    return (
        <div>
           
            <Button  className='button-ques-save'onClick={handleShowModal}>
                Add Course
            </Button>
            <Learning showModal={showModal} setShowModal={setShowModal} />
    <br></br><br></br>
    
    <div className='table-container3'>
            <Table striped bordered hover className='tb-style'>
                <thead>
                    <tr>
                        <th>course_name</th>
                       
                        <th>course_count</th>
                        <th>is_active</th>
                        <th>dtm_start</th>
                        <th>dtm_end</th>
                        <th>total_enrollment</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {testcourse.map(content => (
                        <tr key={content.id}>
                            <td>{content.course_name}</td>
                            <td>{content.course_count}</td>
                            <td>{content.is_active}</td>
                            <td>{content.dtm_start}</td>
                            <td>{content.dtm_end}</td>
                            <td>{content.total_enrollment}</td>
                           
                        </tr>
                    ))}
                </tbody>
            </Table></div>
        </div>
    );
};

export default Settings1;
