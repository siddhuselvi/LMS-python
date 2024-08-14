import React, { useState, useEffect } from 'react';
import { Modal, Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { updaterulesApi, getrulesApi } from '../../api/endpoints';

const UpdateRules = (props) => {
    const [ruleTypes, setRuleTypes] = useState([]);
    const [selectedRuleTypes, setSelectedRuleTypes] = useState(null);

    useEffect(() => {
        getrulesApi()
        .then(data => {
            console.log("Rule Data Received: ", data);
            setRuleTypes(data.map(item => ({ value: item.id, label: item.rule_type })));
        })
        .catch(error => console.error('Error Fetching Rule Types: ', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const ruleId = selectedRuleTypes ? selectedRuleTypes.value : null;

        const rule = {
            rule_name: formData.get('rule_name'),
            instruction: formData.get('instruction')
        };
        console.log('Result: ', rule);

        try {
            const result = await updaterulesApi(props.rule.id, rule);
            alert('Rule Updated');
            props.setUpdated(true);
            props.onHide(); // Close modal after successful update
        } catch (error) {
            console.error('Failed to Update rule:', error);
            alert(`Failed to Update rule: ${error.message}`);
        }
    };

    return (
        <Modal
            {...props}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Update Rule Information
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Row md={12}>
                                <Col>
                                    <div controlId='rule_name'>
                                        <label>Rule Name</label><p></p>
                                        <input type="text" name="rule_name" className='input-ques' required defaultValue={props.rule?.rule_name || ''} placeholder="" />
                                    </div>
                                </Col>
                                <Row md={12}></Row>
                                <Col>
                                    <div controlId='instruction'>
                                        <label>Instruction</label><p></p>
                                        <input type="text" name="instruction" className='input-ques' required defaultValue={props.rule?.instruction || ''} placeholder="" />
                                    </div>
                                </Col>
                            </Row>
                            <button type="button-ques-save" style={{ width: '100px', backgroundColor: 'orange' }}>
                                Save
                            </button>
                        </Form>
                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default UpdateRules;
