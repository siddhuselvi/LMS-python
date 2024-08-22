import React, { useState, useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select';
import { addrulesApi, getrulesApi } from '../../api/endpoints';

const Ruleform = ({handleClose}) => {
    
    const [ruletypes, setruletypes] = useState([]);
    const [selectedruletypes, setSelectedruletypes] = useState(null);
    const [ruleName, setRuleName] = useState('');
    const [instruction, setInstruction] = useState('');

    useEffect(() => {
        getrulesApi()
            .then(data => {
                setruletypes(data.map(item => ({ value: item.id, label: item.rule_name })));
            })
            .catch(error => {
                console.error('Failed to fetch rules:', error);
            });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const skillId = selectedruletypes ? selectedruletypes.value : null;

        const ruleData = {
            skill_name: ruleName,
            instruction: instruction,
            skill_type_id: skillId,
        };

        addrulesApi(ruleData)
            .then(() => {
                window.alert("Rule added successfully");
                setRuleName('');
                setInstruction('');
                setSelectedruletypes(null);
            })
            .catch(error => {
                console.error('Failed to add rule:', error);
                alert('Failed to add rule. Check console for details.');
            });
    };

    return (
        <div>
            <div className='test'>
               
                <Row>
                    <Col sm={6}>
                        <Form onSubmit={handleSubmit}>
                            <Row md={12}>
                                <Col>
                                    <div controlId='rule_name'>
                                        <label className='label8-ques'>Rule Name</label><p></p>
                                        <input type="text" className="input-ques" name="rule_name" style={{width:"900px"}} required value={ruleName} onChange={(e) => setRuleName(e.target.value)} />
                                    </div>
                                </Col>
                            </Row><p></p>
                            <Row md={12}>
                                <Col>
                                    <div controlId='instruction'>
                                        <label className='label8-ques'>Instruction</label><p></p>
                                        <input type="text" className="input-ques" name="instruction" required value={instruction} style={{width:"900px"}} onChange={(e) => setInstruction(e.target.value)} />
                                    </div>
                                </Col>
                            </Row><p></p>
                            
                            <div className='button-container'>
                                <button type="submit" className='button-ques-save' style={{width:"100px"}}>
                                    Save
                                </button>
                                <button type="button" onClick={handleClose} className='cancel' style={{width:"100px"}}>
                    Cancel
                </button>
                           
                            </div>
                        </Form>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default Ruleform;
