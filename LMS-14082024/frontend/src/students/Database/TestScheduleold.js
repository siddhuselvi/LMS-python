import React, { useState, useEffect } from 'react';
import { Table, Form } from 'react-bootstrap';
import { getTestcandidateApi } from '../../api/endpoints';

const TestScheduleDB = ({ collegeName, username }) => {
    const [testCandidates, setTestCandidates] = useState([]);
    const [filters, setFilters] = useState({
        dtm_start: '',
        dtm_end: '',

    });

    useEffect(() => {
        getTestCandidates();
    }, [collegeName, username]);

    const getTestCandidates = () => {
        getTestcandidateApi()
            .then(testCandidatesData => {
                const filteredCandidates = testCandidatesData.filter(candidate => {
                    return candidate.college_id === collegeName && candidate.student_id === username;
                });
                setTestCandidates(filteredCandidates);
            })
            .catch(error => {
                console.error('Error fetching test candidates:', error);
            });
    };

    const handleFilterChange = (columnName, value) => {
        setFilters({
            ...filters,
            [columnName]: value
        });
    };

    const filteredTestCandidates = testCandidates.filter(candidate => {
        return Object.keys(filters).every(key => {
            const filterValue = filters[key].toLowerCase();
            const candidateValue = candidate[key]?.toLowerCase(); // Use optional chaining here
            return candidateValue && candidateValue.includes(filterValue); // Check if candidateValue is truthy before using includes()
        });
    });
    
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };
    return (
        <div>
            <br /><br />
            <h5 style={{ textAlign: "center" }}>TEST SCHEDULES</h5>
<div className='table-responsive'>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Test Name</th>
                        <th>Student Name</th>
                        <th>Institute Name</th>
                        <th>Question Name</th>
                        <th>Start Date <Form.Control type="text" placeholder="Enter date" value={filters.dtm_start} onChange={e => handleFilterChange('dtm_start', e.target.value)} /></th>
                        <th>End Date <Form.Control type="text" placeholder="Enter date" value={filters.dtm_end} onChange={e => handleFilterChange('dtm_end', e.target.value)} /></th>
                        <th>Is Completed</th>
                        <th>Rules</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTestCandidates.map(candidate => (
                        <tr key={candidate.id}>
                            <td>{candidate.test_id}</td>
                            <td>{candidate.student_id}</td>
                            <td>{candidate.college_id}</td>
                            <td>{candidate.question_id}</td>
                            <td>{formatDate(candidate.dtm_start)}</td>
                            <td>{formatDate(candidate.dtm_end)}</td>
                            <td>{candidate.is_completed ? 'Yes' : 'No'}</td>
                            <td>{candidate.rules}</td>
                        </tr>
                    ))}
                </tbody>
            </Table></div>
        </div>
    );
};

export default TestScheduleDB;
