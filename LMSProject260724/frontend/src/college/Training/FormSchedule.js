import React,{ useState, useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select'; 
import {addCourseScheduleApi,getTrainerApi,getcoursemasterApi,getcandidatesApi} from '../../api/endpoints'

//import Select from 'react-select';


const FormSchedule= () => {
    const [course, setcourse] = useState([]);
    const [trainer, setTrainer] = useState([]);
    const [student, setstudent] = useState([]);
    const [selectedcourse, setSelectedcourse] = useState(null);
    const [selectedstudentid, setSelectedstudentid] = useState(null);
    const [selectedtrainer, setSelectedTrainer] = useState(null);

  

    
    useEffect(() => {
       
      
        //Fetch student  
        getTrainerApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setTrainer(data.map(item => ({ value: item.id, label: item.trainer_name })));
            })
            .catch(error => console.error('Error fetching  questions :', error));


        //Fetch course  
        getcoursemasterApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setcourse(data.map(item => ({ value: item.id, label: item.course_name })));
            })
            .catch(error => console.error('Error fetching course Names:', error));


            getcandidatesApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setstudent(data.map(item => ({ value: item.id, label: item.students_name })));
            })
            .catch(error => console.error('Error fetching course Names:', error));

    }, []);
   
    const trainerid = selectedtrainer ? selectedtrainer.value : null;
    const courseid = selectedcourse ? selectedcourse.value : null;
    const studentid = selectedstudentid ? selectedstudentid.value : null;
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const studentmaster = {
            course_id:courseid,
            trainer_id:trainerid,
            student_id:studentid,
            dtm_start:formData.get('dtm_start'),
            dtm_end:formData.get('dtm_end'),


            course_mode: formData.get('course_mode'),
           
         status:formData.get('status')
           
          
           
           


        };

        console.log("Result: ", studentmaster)

        addCourseScheduleApi(studentmaster)
            .then((result) => {
                window.alert("Course schedule added successfully");
               
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
                                    <Form.Group controlId='course_name'>
                                        <Form.Label>course Name</Form.Label>
                                        <Select
                                            options={course}
                                            value={selectedcourse}
                                            onChange={setSelectedcourse}
                                            placeholder="Select course"
                                        />
                                    </Form.Group>
                                </Col>

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
                                    <Form.Group controlId='student_name'>
                                        <Form.Label>Student Name</Form.Label>
                                        <Select
                                            options={student}
                                            value={selectedstudentid}
                                            onChange={setSelectedstudentid}
                                            placeholder="Select Student Name"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row><p></p>
                       
                       
                            <Row>
                            <Col>
                                    <Form.Group controlId='dtm_start'>
                                        <Form.Label>Start Date and Time</Form.Label>
                                        <Form.Control type="datetime-local" name="dtm_start" required placeholder="" />
                                    </Form.Group>
                                </Col>
                          
                                <Col>
                                    <Form.Group controlId='dtm_end'>
                                        <Form.Label>End Date and Time</Form.Label>
                                        <Form.Control type="datetime-local" name="dtm_end" required placeholder="" />
                                    </Form.Group>
                                </Col>
                               
                            </Row> <p></p>

                            <Row>
                            <Col>
                                    <Form.Group controlId='course_mode'>
                                        <Form.Label>Course_mode</Form.Label>
                                        <Form.Control type="text" name="course_mode" required placeholder="" />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group controlId='status'>
                                        <Form.Label>status</Form.Label>
                                        <Form.Control type="text" name="status" required placeholder="" />
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

export default FormSchedule;