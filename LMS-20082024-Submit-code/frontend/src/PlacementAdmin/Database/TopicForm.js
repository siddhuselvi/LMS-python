import React from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';

import { addtopicApi } from '../../api/endpoints'

//import Select from 'react-select';


const TopicForm = ({ handleClose }) => {
    
   


    const handleSubmit = (e) => {
        e.preventDefault();

         const formData = new FormData(e.target);

        const master = {
           topic: formData.get('topic'),
           sub_topic: formData.get('sub_topic'),
     };

        console.log("Result: ", master)

        addtopicApi(master)
            .then((result) => {
                window.alert("Topic added successfully");

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
                    <Col >
                        <form onSubmit={handleSubmit}>
<Row></Row>
                            <Row md={12}>
                                <Col>
                                    <div controlId='topic'>
                                        <label className='label8-ques'>Topic</label><p></p>
                                        <input type="text" name="topic" className="input-ques" style={{width:'900px'}} required placeholder="" />
                                    </div>
                                </Col>
                                </Row> <p></p>
                                <Row md={12}>
                                <Col>
                                    <div controlId='sub_topic'>
                                        <label className='label8-ques'>Sub Topic</label><p></p>
                                        <input className="input-ques" type="text" name="sub_topic" style={{width:'900px'}} required placeholder="" />
                                    </div>
                                </Col>

                                </Row><p></p>
                               

                              

                           
                          
                            

                           
                           

                            <div className='button-container'>
                                <button  type="submit" className='button-ques-save' style={{width:"100px"}}>
                                    Save
                                </button>
                                <button type="button" onClick={handleClose} className='cancel' style={{width:"100px"}}>
                    Cancel
                </button>
                            </div>
                        </form>
                    </Col>
                </Row> <p></p>


            </div>


        </div>
    );

};

export default TopicForm;