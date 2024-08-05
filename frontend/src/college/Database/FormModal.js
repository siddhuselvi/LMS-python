import React,{ useState, useEffect } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import Select from 'react-select'; 
import { addAnnouncementMasterApi,getTrainerApi,getcollegeApi} from '../../api/endpoints'
import '../../Styles/global.css'
const FormModal= () => {
    const [college, setCollege] = useState([]);
    const [trainer, setTrainer] = useState([]);
    const [contentName, setContent] = useState([]);
    const [selectedcollege, setSelectedCollege] = useState(null);
    const [selectedContentid, setSelectedContentid] = useState(null);
    const [selectedtrainer, setSelectedTrainer] = useState(null);
    const[is_active,setactive]=useState(false);
    
    useEffect(() => {
       
      
        //Fetch content  
        getTrainerApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setTrainer(data.map(item => ({ value: item.id, label: item.trainer_name })));
            })
            .catch(error => console.error('Error fetching  questions :', error));


        //Fetch course  
        getcollegeApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setCollege(data.map(item => ({ value: item.id, label: item.college })));
            })
            .catch(error => console.error('Error fetching course Names:', error));

    }, []);
   
    const trainerid = selectedtrainer ? selectedtrainer.value : null;
    const collegeid = selectedcollege ? selectedcollege.value : null;
   
    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);

        const contentmaster = {
            college_id:collegeid,
            trainer_id:trainerid,
            dtm_start:formData.get('dtm_start'),
            dtm_end:formData.get('dtm_end'),


            content: formData.get('content'),
           
           is_active: is_active,
           
          
           
           


        };

        console.log("Result: ", contentmaster)

        addAnnouncementMasterApi(contentmaster)
            .then((result) => {
                window.alert("Announcement added successfully");
               
            })
            .catch((error) => {
                console.error("Failed to Add Data", error);  // Log the error to the console
                alert("Failed to Add. Check console for details.");
            });
    };

    return (
        <div>
            <div className='form-ques'>
                <Row>
                    <Col >
                        <form onSubmit={handleSubmit}>
                            <Row md={12}>
                            <Col>
                                    <div controlId='college_name'>
                                        <label>College Name</label><p></p>
                                        <Select
                                            options={college}
                                            value={selectedcollege}
                                            onChange={setSelectedCollege}
                                            placeholder="Select College"
                                        />
                                    </div>
                                </Col>

                                <Col>
                                    <div controlId='trainer'>
                                        <label>Trainer Name</label><p></p>
                                        <Select
                                            options={trainer}
                                            value={selectedtrainer}
                                            onChange={setSelectedTrainer}
                                            placeholder="Select Course Name"
                                        />
                                    </div>
                                </Col>
                            </Row><p></p>
                       
                       
                            <Row md={12}>
                            <Col>
                                    <div controlId='dtm_start'>
                                        <label>Start Date and Time</label><p></p>
                                        <input type="datetime-local" name="dtm_start" required placeholder="" />
                                    </div>
                                </Col>
                          
                                <Col>
                                    <div controlId='dtm_end'>
                                        <label>End Date and Time</label><p></p>
                                        <input type="datetime-local" name="dtm_end" required placeholder="" />
                                    </div>
                                </Col>
                               
                            </Row> <p></p>

                            <Row md={12}>
                                <Col>
                                    <div controlId='content'>
                                        <label>Content</label><p></p>
                                        <input type="text" name="content" required placeholder="" />
                                    </div>
                                </Col>
                                <Col>
            <div controlId='is_active'>
                <label>Is_Active</label><p></p>
                <Form.Check
                    type="switch"
                    className="custom-switch"
                    id="custom-switch"
                    label=""
                    checked={is_active}
                    onChange={(e) => setactive(e.target.checked)}
                />
            </div>
        </Col>
                               
                            </Row> <p></p>
                           
                            <div>
                                <Button variant="primary" type="submit" style={{ width: '70px' }}>
                                    Save
                                </Button>
                            </div>
                        </form>
                    </Col>
                </Row> <p></p>
            </div>

           
        </div>
    );

};

export default FormModal;