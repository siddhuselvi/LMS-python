import React,{ useState, useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select'; 
import { addcoursecontentApi,getcontentApi,getcoursemasterApi, gettopicApi} from '../../api/endpoints';
import '../global.css'

const FormContent= () => {
    const [courseName, setCourseName] = useState([]);
    const [contentName, setContent] = useState([]);
    const [selectedCourseName, setSelectedCourseName] = useState(null);
    const [selectedContentid, setSelectedContentid] = useState(null);
    const [topics, setTopics] = useState([]);

    const [selectedTopics, setSelectedTopics] = useState([]);
    
    useEffect(() => {
       
      
        //Fetch content  
        getcontentApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setContent(data.map(item => ({ value: item.id, label: item.content_name })));
            })
            .catch(error => console.error('Error fetching  questions :', error));


        //Fetch course  
        getcoursemasterApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setCourseName(data.map(item => ({ value: item.id, label: item.course_name })));
            })
            .catch(error => console.error('Error fetching course Names:', error));

        gettopicApi()
        .then(data => {
            setTopics(data.map(item => ({ value: item.id, label: item.topic })));
        })
        .catch(error => console.error('Error fetching data:', error));

    }, [contentName, courseName, topics]);
   
    const courseNameId = selectedCourseName ? selectedCourseName.value : null;
    const contentid = selectedContentid ? selectedContentid.value : null;
    const topicId = selectedTopics ? selectedTopics.value : null;

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const contentmaster = {
            content_id:contentid,
            course_id:courseNameId,
            topic_id: topicId,

        };

        console.log("contentmaster: ", contentmaster)

        addcoursecontentApi(contentmaster)
            .then((result) => {
                window.alert("Data added successfully");
               
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
                    <Col>
                        <Form onSubmit={handleSubmit}>
                            <Row>
                            <Col sm={4}>
                                    <Form.Group controlId='course'>
                                        <Form.Label style={{ color: 'black' }}>Course Name</Form.Label>
                                        <Select
                                            options={courseName}
                                            value={selectedCourseName}
                                            onChange={setSelectedCourseName}
                                            placeholder="Select Course Name"
                                            className="border border-dark border-1 select-container"
                                            
                                        />
                                    </Form.Group>
                                </Col>

                                <Col sm={4}>
                                    <Form.Group controlId='content'>
                                        <Form.Label style={{ color: 'black' }}>Content Name</Form.Label>
                                        <Select
                                            options={contentName}
                                            value={selectedContentid}
                                            onChange={setSelectedContentid}
                                            placeholder="Select Content Name"
                                            className="border border-dark border-1"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row><p></p>
                       
                       
                            <Row>
                               <Col sm={4}>
                                    <Form.Group controlId='topic'>
                                        <Form.Label style={{ color: 'black' }}>Topic</Form.Label>
                                        <Select
                                            options={topics}
                                            value={selectedTopics}
                                            onChange={setSelectedTopics}
                                            placeholder="Select Topic"
                                            className="border border-dark border-1"
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

export default FormContent;