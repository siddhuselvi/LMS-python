import React, { useEffect, useState } from 'react';
import { Col, Row, Form, Button } from 'react-bootstrap';
import { getcandidatesApi, updatecandidatestextApi, updateTestcandidateApi } from '../../api/endpoints';
import '../../Styles/global.css'
import ErrorModal from '../../Components/auth/ErrorModal';
const UploadStudentProfile = ({ collegeName, username }) => {
  const [newSkill, setNewSkill] = useState('');
  const [students, setStudents] = useState([]);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  const handleCloseError = () => {
    setShowError(false);
};
  useEffect(() => {
    fetchTraineeData();
  }, [collegeName, username]);

  const fetchTraineeData = () => {
    console.log('College Name: ', collegeName);
    console.log('User Name: ', username);
    getcandidatesApi()
      .then(data => {
        console.log('Students Data: ', data)
        const filteredCandidate = data.filter(candidate => {
          return  candidate.user_name === username;
        });
        setStudents(filteredCandidate);
        console.log("Filtered Student: ", filteredCandidate)
        if (filteredCandidate.length > 0) {
          setNewSkill(filteredCandidate[0].text || ''); // Assuming "text" holds the skill information
        }
      })
      .catch(error => {
        console.error('Error fetching trainee data:', error);
      });
  };

  const handleSkillChange = (e) => {
    setNewSkill(e.target.value);
  };

  const handleUpdateSkill = async (e) => {
    e.preventDefault();
  
    if (students.length > 0) {
      const studentId = students[0].id; // Assuming there's only one student
      const skill = newSkill;

      const dataToSubmit = {
        text: newSkill,
      };

  
      try {
        console.log('Student ID: ', studentId);
        console.log('Skills: ', skill);

        await updatecandidatestextApi(studentId, dataToSubmit);
        setErrorMessage('Skill Updated Successfully');
        setShowError(true);
  
        //alert('Skill Updated Successfully');
        fetchTraineeData(); // Refresh the data
      } catch (error) {
        console.error('Failed to update skill:', error);
        alert(`Failed to update skill: ${error.message}`);
      }
    }
  };
  

  return (
    <div className="no-select no-right-click">
<div className="no-screenshot-overlay"></div>
    <div className='form-ques'>
      <div className='header'><h4 className='h4'>Students Profile</h4></div><p></p>
      <div className='form-ques'>
        {students.map((trainee, index) => (
          <form key={index} onSubmit={handleUpdateSkill}>
            <p></p>
            <p className='header'> Students can Update only Additional Info</p>
            <Row md={12}>
              
              
              <Col>
                <div controlId='students_name' className='add-profile'>
                  <label className='label6-ques'>Student Name</label><p></p>
                  
               <input type="text" className='input-ques' value={trainee.students_name} readOnly />
                </div>
              </Col>
              <Col>
                <div controlId='registration_number' className='add-profile'>
                  <label className='label7-ques'>Reg Number</label><p></p>
                  <input type="text" className='input-ques' value={trainee.registration_number} readOnly />
                </div>
              </Col>
            </Row><p></p>
            <Row md={12}>
              
              <Col>
                <div controlId='gender' className='add-profile'>
                  <label className='label6-ques'>Gender</label><p></p>
                  <input type="text" className='input-ques' value={trainee.gender} readOnly />
                </div>
              </Col>
              <Col>
                <div controlId='email_id' className='add-profile'>
                  <label className='label7-ques'>Email </label><p></p>
                  <input type="text" className='input-ques' value={trainee.email_id} readOnly />
                </div>
              </Col>
            </Row><p></p>
            <Row md={12}>
             
              <Col>
                <div controlId='mobile_number' className='add-profile'>
                  <label className='label6-ques'>Mobile Number</label><p></p>
                  <input type="text" className='input-ques' value={trainee.mobile_number} readOnly />
                </div>
              </Col>

              <Col>
                <div controlId='cgpa' className='add-profile'>
                  <label className='label7-ques'>CGPA</label><p></p>
                  <input type="text" className='input-ques' value={trainee.cgpa} readOnly />
                </div>
              </Col>
            </Row><p></p>
            <Row md={12}>
              <Col>
                <div controlId='college_id' className='add-profile'>
                  <label className='label6-ques'>College Name</label><p></p>
                  <input type="text" className='input-ques' value={trainee.college_id} readOnly />
                </div>
              </Col>
              <Col>
                <div controlId='department_id' className='add-profile'>
                  <label className='label7-ques'>Department</label><p></p>
                  <input type="text" className='input-ques' value={trainee.department_id} readOnly />
                </div>
              </Col>
            </Row><p></p>
            <Row md={12}>
              <Col>
                <div controlId='year' className='add-profile'>
                  <label className='label6-ques'>Year</label><p></p>
                  <input type="text" className='input-ques' value={trainee.year} readOnly />
                </div>
              </Col>
              <Col>
                <div controlId='marks_semester_wise' className='add-profile'>
                  <label className='label7-ques'>Semester Marks</label><p></p>
                  <input type="text" className='input-ques' value={trainee.marks_semester_wise} readOnly />
                </div>
              </Col>
              
            </Row><p></p>
            <Row md={12}>
              <Col>
                <div controlId='marks_10th' className='add-profile'>
                  <label className='label6-ques'>10th Marks</label><p></p>
                  <input type="text" className='input-ques' value={trainee.marks_10th} readOnly />
                </div>
              </Col>
              <Col>
                <div controlId='marks_12th' className='add-profile'>
                  <label className='label7-ques'>12th Marks</label><p></p>
                  <input type="text" className='input-ques' value={trainee.marks_12th} readOnly />
                </div>
              </Col>
            </Row><p></p>
            <Row md={12}>
              
              <Col>
                <div controlId='history_of_arrears' className='add-profile'>
                  <label className='label6-ques'>History of Arrears</label><p></p>
                  <input type="text" className='input-ques' value={trainee.history_of_arrears} readOnly />
                </div>
              </Col>
              <Col>
                <div controlId='standing_arrears' className='add-profile'>
                  <label className='label7-ques'>Standing Arrears</label><p></p>
                  <input type="text" className='input-ques' value={trainee.standing_arrears} readOnly />
                </div>
              </Col>
            </Row><p></p>
            <Row md={12}>
             
             <Col>
               <div controlId='it_of_offers' className='add-profile'>
                 <label className='label6-ques'>No Of IT Offers</label><p></p>
                 <input type="text" className='input-ques' value={trainee.it_of_offers} readOnly />
               </div>
             </Col>
          
             <Col>
               <div controlId='core_of_offers' className='add-profile'>
                 <label className='label6-ques'>No Of Core Offers</label><p></p>
                 <input type="text" className='input-ques' value={trainee.core_of_offers} readOnly />
               </div>
             </Col>
           </Row>
           <p></p>
            <Row md={12}>
             
              <Col>
                <div controlId='number_of_offers' className='add-profile'>
                  <label className='label6-ques'>Total No of Offers</label><p></p>
                  <input type="text" className='input-ques' value={trainee.number_of_offers} readOnly />
                </div>
              </Col>
           
              <Col>
                <div controlId='text-box' className='add-profile'>
                  <label className='label7-ques'>Additional Info <span style={{ color: '#F1A128' }}>**</span></label><p></p>
                  <input type="text"  className='input-ques' value={newSkill} onChange={handleSkillChange} />
                </div>
              </Col>
            </Row>
            <p></p>
            <Row  >
              <Col>
                <button variant="primary" type="submit" className='button-ques-save'>Update Skill</button>
              </Col>
            </Row>
          </form>
        ))}
      </div>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
      
    </div></div>
  );
};

export default UploadStudentProfile;
