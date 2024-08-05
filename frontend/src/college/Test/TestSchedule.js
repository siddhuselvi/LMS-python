import React, { useState, useEffect } from 'react';
import { Table, Pagination } from 'react-bootstrap';
import { getTestcandidateApi } from '../../api/endpoints';

const TestSchedule = ({ collegeName }) => {
    const [testCandidates, setTestCandidates] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getTestCandidates();
    }, [collegeName]);

    const getTestCandidates = () => {
        getTestcandidateApi()
            .then(testCandidatesData => {
                const filteredCandidates = testCandidatesData.filter(candidate => {
                    return candidate.college_id === collegeName;
                });
                setTestCandidates(filteredCandidates);
                setCurrentPage(1); // Reset to the first page when data is fetched
            })
            .catch(error => {
                console.error('Error fetching test candidates:', error);
            });
    };

    const totalPages = Math.ceil(testCandidates.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = testCandidates.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <br /><br />
            <h3 style={{ textAlign: "center" }}>TEST SCHEDULES</h3>
            <div className='table responsive' style={{ overflowX: 'auto' }}>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Department Name</th>
                            <th>Year</th>
                            <th>Student Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Is Completed</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(candidate => (
                            <tr key={candidate.id}>
                                <td>{candidate.test_name}</td>
                                <td>{candidate.department_id}</td>
                                <td>{candidate.year}</td>
                                <td>{candidate.student_name}</td>
                                <td>{candidate.dtm_start}</td>
                                <td>{candidate.dtm_end}</td>
                                <td>{candidate.is_active ? 'Yes' : 'No'}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            <Pagination>
                <Pagination.Prev
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                />
                {[...Array(totalPages)].map((_, index) => (
                    <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => handlePageChange(index + 1)}
                    >
                        {index + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                />
            </Pagination>
        </div>
    );
};

export default TestSchedule;
