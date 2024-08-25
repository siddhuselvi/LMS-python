import React, { useState, useEffect } from "react";
import {
    getCandidateLogin,
    getTestcandidateApi,
    getcandidatesApi_ALL,
    addSelectedTestAssign_API,
    getTestcandidate_LIST_Api
} from "../../../api/endpoints";
import { Table } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import Nextarrow from '../../../assets/Images/nextarrow.png'
import back from '../../../assets/Images/backarrow.png';
import ErrorModal from '../../auth/ErrorModal';
import { useNavigate } from 'react-router-dom';



const AddDBCandidates = ({ collegeName }) => {
    const [dbCan, setDbCan] = useState([]);
    const { test_name } = useParams();
    console.log('test name: ', test_name); // Ensure the id is correctly retrieved
    const [testCandidates, setTestCandidates] = useState([]);
    const [studentIds, setStudentIds] = useState([]);
    const [selectedStudentNames, setSelectedStudentNames] = useState([]);
    const [isSelectAllChecked, setIsSelectAllChecked] = useState(false);
    const [questID, setQuesID] = useState(0);
    const [dtmStart, setDtmStart] = useState('');
    const [dtmEnd, setDtmEnd] = useState('');
    const [actualTest, setActualTest] = useState('');
    const [duration, setDuration] = useState(0);
    const [rulesID, setRulesID] = useState(0);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [dtmCreated, setDtmCreated] = useState('');
    const navigate = useNavigate();

    const handleCloseError = () => {
        setShowError(false);
    };



    useEffect(() => {
        if (test_name) {
            getTestCandidates(test_name);
        }
    }, [test_name]);

    useEffect(() => {
        if (studentIds.length > 0) {
            getDbCandidates();
        }
    }, [studentIds]);

    const getTestCandidates = (testName) => {
        getTestcandidate_LIST_Api(testName)
            .then(data => {

                setTestCandidates(data);
                console.log("Filtered test candidates: ", data);

                if (data.length > 0) {
                    setQuesID(data[0].question_id);
                    setDtmStart(data[0].dtm_start);
                    setDtmEnd(data[0].dtm_end);
                    setActualTest(data[0].is_actual_test);
                    setDuration(data[0].duration);
                    setRulesID(data[0].rules_id);
                    setDtmCreated(data[0].dtm_created);
                }


                const stu_ids = data.map(test => test.student_id);
                setStudentIds(stu_ids);
                console.log('test stu ids: ', stu_ids);
            })
            .catch(error => console.error('Error fetching test candidates:', error));
    };

    const getDbCandidates = () => {
        getcandidatesApi_ALL()
            .then(allCandidates => {
                console.log('all candidates: ', allCandidates);

                // Filter login candidates by college name before extracting IDs
                const allCandidatesCollege = allCandidates.filter(candidate =>
                    candidate.college_id__college === collegeName
                );
                console.log('allCandidatesCollege: ', allCandidatesCollege);

                // Filter candidates that are not in the test candidates and match the college ID
                const filteredCandidates = allCandidatesCollege.filter(stu =>
                    !studentIds.includes(stu.id)
                );

                console.log('Filtered candidates: ', filteredCandidates);

                // Now filter these candidates by their login information
                getCandidateLogin()
                    .then(candidates => {
                        // Filter login candidates by college name before extracting IDs
                        const filteredLoginCandidates = candidates.filter(candidate =>
                            candidate.college_name === collegeName
                        );

                        // Extract the student IDs from the filtered candidates
                        const filteredCandidateIds = filteredCandidates.map(stu => stu.id);
                        console.log('Filtered candidates id: ', filteredCandidateIds);

                        // Filter login candidates based on these IDs
                        const fc = filteredLoginCandidates.filter(data =>
                            filteredCandidateIds.includes(data.student_id)
                        );

                        // Set the state with the filtered login candidates
                        setDbCan(fc);
                        console.log('Filtered login candidates: ', fc);
                    })
                    .catch(error => console.error('Error fetching candidate login:', error));
            })
            .catch(error => console.error('Error fetching db candidates:', error));
    };

    const handleSelectAll = (e) => {
        const isChecked = e.target.checked;
        setIsSelectAllChecked(isChecked);

        if (isChecked) {
            const allStudentNames = dbCan.map(can => can.student_id);
            setSelectedStudentNames(allStudentNames);
            console.log('setSelectedStudentNames: ', allStudentNames);
        } else {
            setSelectedStudentNames([]);
        }
    };

    const handleCheckboxChange = (e, studentName) => {
        const isChecked = e.target.checked;

        if (isChecked) {
            setSelectedStudentNames(prev => [...prev, studentName]);
            console.log('studentName: ', studentName);
        } else {
            setSelectedStudentNames(prev => prev.filter(name => name !== studentName));
        }
    };

    const handleSubmit = () => {
        const dataToSubmit = {
            stu_id: selectedStudentNames,
            test_name: test_name,
            question_id: questID,
            dtm_start: dtmStart,
            dtm_end: dtmEnd,
            is_actual_test: actualTest,
            duration: duration,
            rules_id: rulesID,
            dtm_created: dtmCreated
        }

        console.log('Data to submit: ', dataToSubmit);

        addSelectedTestAssign_API(dataToSubmit)
            .then(() => {
                console.log('Test Assigned Successfully');
                setErrorMessage('Test Assigned Successfully');
                setShowError(true);
                navigate('/test/test-schedules/');
                //alert('Test Assigned Successfully');
            })
            .catch(error =>
                console.log('Error: test not assigned.', error)
            );
    };


    return (
        <div>
            <div style={{ justifyContent: "space-between", display: 'flex' }}>
                <button className='button-ques-save' style={{ float: "left", width: "100px" }}>
                    <img src={back} className='nextarrow' ></img>   <Link to='/test/test-schedules/' style={{ color: "black", textDecoration: "none" }}>Back</Link>
                </button>
                <button className='button-ques-save' style={{}} type="submit" onClick={handleSubmit}>
                    Add Test
                </button>
                <button className="button-ques-save btn btn-secondary" disabled style={{ float: "right", width: "100px", backgroundColor: "#F1A128", cursor: 'not-allowed', width: "100px", color: 'black', height: '50px', }} >
                    Next <img src={Nextarrow} className='nextarrow' style={{ color: "#6E6D6C" }}></img>
                </button>

            </div>
            <br />

            <div style={{ paddingTop: '20px' }}>
                <table className="product-table" >
                    <thead className="table-thead">
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={isSelectAllChecked}
                                    onChange={handleSelectAll}
                                />
                            </th>
                            <th>Login ID</th>
                            <th>Name</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody className="table-tbody">
                        {dbCan.map(can => (
                            <tr key={can.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedStudentNames.includes(can.student_id)}
                                        onChange={(e) => handleCheckboxChange(e, can.student_id)}
                                    />
                                </td>
                                <td>{can.user_name}</td>
                                <td>{can.student_name}</td>
                                <td>{can.password}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

        </div>
    );
};

export default AddDBCandidates;
