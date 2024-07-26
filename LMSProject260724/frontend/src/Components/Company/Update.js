import React, { useState, useEffect } from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { updatecollegeadminApi, getcollegeApi } from '../../api/endpoints'
import '../../Styles/global.css'
const Update = (props) => {
    const [college, setCollege] = useState([]);

    const [selectedcollege, setSelectedCollege] = useState(null);



    useEffect(() => {



        getcollegeApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setCollege(data.map(item => ({ value: item.id, label: item.college })));
            })
            .catch(error => console.error('Error fetching course Names:', error));

    }, []);

    //const trainerid = selectedtrainer ? selectedtrainer.value : null;
    const collegeid = selectedcollege ? selectedcollege.value : null;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const admin = {
            college_id: collegeid,
            admin_name: formData.get('admin_name'),

        };

        console.log("Result: ", admin)
        console.log('admin.id: ', props.admin.id)
        try {
            const result = await updatecollegeadminApi(props.admin.id, admin);
            alert('admin Updated');
            props.setUpdated(true);
            
        } catch (error) {
            console.error('Failed to Update admin:', error);
            alert(`Failed to Update admin: ${error.message}`);
        }

    };

    return (
        <div>
            <div className='test'>

                <Modal
                    {...props}
                    size="lg"
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
                                            <Form.Group controlId='admin_name'>
                                                <Form.Label>admin_name</Form.Label>
                                                <Form.Control type="text" name="admin_name"
                                                    required defaultValue={props.admin?.admin_name || ''} />
                                            </Form.Group>
                                        </Col>

                                        <Col>
                                            <Form.Group controlId='college_name'>
                                                <Form.Label>College Name</Form.Label>
                                                <Select
                                                    options={college}
                                                    value={selectedcollege}
                                                    onChange={setSelectedCollege}
                                                    required defaultValue={props.admin?.college || ''}
                                                    placeholder="Select College"
                                                />
                                            </Form.Group>
                                        </Col>


                                    </Row><p></p>






                                    <Form.Group>
                                        <Button  type="submit" className='buton'>
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

export default Update;