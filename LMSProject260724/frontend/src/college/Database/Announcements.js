import React, { useState, useEffect } from 'react';
import { Table, Form, Button, Pagination } from 'react-bootstrap';
import FormModal from './FormModal';
import { getAnnouncementMasterApi } from '../../api/endpoints';

const Announcements = ({ collegeName }) => {
    const [announce, setAnnounce] = useState([]);
    const [filters, setFilters] = useState({
        trainerName: ''
    });
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        getAnnouncements();
    }, [collegeName]);

    const getAnnouncements = () => {
        getAnnouncementMasterApi()
            .then(data => {
                // Filter announcements based on collegeName
                const filteredAnnouncements = data.filter(item => item.college_id === collegeName);
                setAnnounce(filteredAnnouncements);
                setCurrentPage(1); // Reset to the first page when data is fetched
            })
            .catch(error => console.error('Error fetching announcements:', error));
    };

    const applyFilters = () => {
        const filteredData = announce.filter(item => {
            return item.trainer_id.toLowerCase().includes(filters.trainerName.toLowerCase());
        });
        return filteredData;
    };

    const handleFilterChange = (event) => {
        const { name, value } = event.target;
        setFilters(prevFilters => ({
            ...prevFilters,
            [name]: value
        }));
        setCurrentPage(1); // Reset to the first page when filters change
    };

    const filteredAnnouncements = applyFilters();

    // Pagination logic
    const totalPages = Math.ceil(filteredAnnouncements.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredAnnouncements.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div>
            <FormModal />
            <br /><br />
            <div className='table responsive'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>College</th>
                            <th>
                                <span>Trainer</span>
                                <Form.Control 
                                    type="text" 
                                    placeholder="Enter trainer name" 
                                    name="trainerName" 
                                    value={filters.trainerName} 
                                    onChange={handleFilterChange} 
                                />
                            </th>
                            <th>StartDate</th>
                            <th>EndDate</th>
                            <th>Content</th>
                            <th>Is_Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map(content => (
                            <tr key={content.id}>
                                <td>{content.college_id}</td>
                                <td>{content.trainer_id}</td>
                                <td>{content.dtm_start}</td>
                                <td>{content.dtm_end}</td>
                                <td>{content.content}</td>
                                <td>{content.is_active}</td>
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

export default Announcements;
