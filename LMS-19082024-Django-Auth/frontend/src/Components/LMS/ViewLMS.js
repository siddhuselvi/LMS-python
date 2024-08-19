import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Table, Form, Pagination } from 'react-bootstrap';
import FormModal from './FormModal';
import { getCourseScheduleApi } from '../../api/endpoints';
import { FaPlay, FaExpand, FaCompress } from 'react-icons/fa';
import './dummy.css';
import Back from '../../assets/Images/backarrow.png'
//import DocumentViewer from './DocumentViewer';
import { SearchContext } from '../../AllSearch/SearchContext';

import { deleteCourseScheduleApi } from '../../api/endpoints';
import LMSMap from './Maplms';
//import Popup from './dummy';
const ViewLms = () => {
    const [testcontents, setTestcontents] = useState([]);
    const [selectedContentType, setSelectedContentType] = useState('All');
    const [search, setSearch] = useState('');
    const { searchQuery } = useContext(SearchContext);
    const [filteredContents, setFilteredContents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showUpdateForm, setShowUpdateform] = useState(false);
    const [lmsId, setLmsId] = useState(null);
    const [showLMSMap, setShowLMSMap] = useState(false);
    const handleUpdateFormIsOpen = (id) => {
        setShowUpdateform(true);
        setLmsId(id);
        console.log(id);
    }

    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredContents.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(filteredContents.length / itemsPerPage);

    const getPaginationItems = () => {
        const maxPaginationItems = 3;
        let startPage = Math.max(1, currentPage - Math.floor(maxPaginationItems / 2));
        let endPage = Math.min(totalPages, startPage + maxPaginationItems - 1);

        if (endPage - startPage + 1 < maxPaginationItems) {
            startPage = Math.max(1, endPage - maxPaginationItems + 1);
        }

        let items = [];
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };

    useEffect(() => {
        getTestcontents();
    }, []);

    useEffect(() => {
        filterContents();
    }, [testcontents, search, searchQuery, selectedContentType]);

    const getTestcontents = async () => {
        try {
            const data = await getCourseScheduleApi();
            setTestcontents(data);
        } catch (error) {
            console.error('Error fetching test contents:', error);
        }
    };

    const filterContents = () => {
        let filtered = testcontents;

        if (selectedContentType !== 'All') {
            filtered = filtered.filter(content => content.content_type === selectedContentType);
        }

        if (searchQuery) {
            filtered = filtered.filter(content =>
                (content.topic && content.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (content.college_id && content.college_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (content.department_id && content.department_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (content.year && content.year.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        if (search) {
            filtered = filtered.filter(content =>
                (content.topic && content.topic.toLowerCase().includes(search.toLowerCase())) ||
                (content.college_id && content.college_id.toLowerCase().includes(search.toLowerCase())) ||
                (content.department_id && content.department_id.toLowerCase().includes(search.toLowerCase())) ||
                (content.year && content.year.toLowerCase().includes(search.toLowerCase()))
            );
        }

        setFilteredContents(filtered);
    };

    const handleDelete = async (id) => {
        try {
            await deleteCourseScheduleApi(id);
            setFilteredContents(filteredContents.filter(content => content.id !== id));
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };
   
    if (showLMSMap) {
        return <LMSMap />;
    }
    return (
        <div>
           
                <div>
                    <div className="product-table-container">
                        <h4>Content Master</h4>
                        <br />
                       
                        <button
                    className='button-ques-save' style={{ width: "100px",marginRight:"5px" }}
                    onClick={() => setShowLMSMap(true)}
                >
                    <img src={Back} className='nextarrow' alt="Back" />  Back
                </button>
                        <input
                            className="search-box1"
                            type="text"
                            placeholder="Search..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <br /><br />
                        <div>
                            <div className='table-container-lms'>
                                <table className="product-table">
                                    <thead className="table-thead">
                                        <tr>
                                            <th>Topic</th>
                                            <th>Sub Topic</th>
                                            <th>College</th>
                                            <th>Department</th>
                                           
                                            <th>Training Date</th>
                                            <th>Students</th>
                                           
                                        </tr>
                                    </thead>
                                    <tbody className="table-tbody">
                                        {getPaginatedData().map(content => (
                                            <tr key={content.id}>
                                                <td>{content.topic_id}</td>
                                                <td>{content.sub_topic}</td>
                                                <td>{content.college_id}</td>
                                                <td>{content.department_id}</td>
                                               
                                                <td>{content.dtm_of_training}</td>
                                                <td>{content.student_id}</td>
                                              {/*}  <td>
                                                    <button className="action-button edit" onClick={() => handleUpdateFormIsOpen(content.id)}>✏</button>
                                                </td>
                                                <td>
                                                    <button className="action-button delete" onClick={() => handleDelete(content.id)} style={{ color: "orange" }}>
                                                        🗑
                                                    </button>
                                                </td>*/}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <br /><br />
                            <div className='dis-page'>
                               
                                    <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
                                        <Form.Label className='display' style={{ marginRight: '10px' }}>Display:</Form.Label>
                                        <Form.Control
                                            style={{ width: "50px", boxShadow: 'none', outline: 'none' }}
                                            as="select"
                                             className='label-dis'
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                        </Form.Control>
                                    </Form.Group>
                                
                                    <Pagination className="pagination-custom" style={{ marginLeft: "860px", marginTop: "-34px", boxShadow: 'none', outline: 'none' }}>
                                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                        {getPaginationItems()}
                                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                    </Pagination>
                               
                            </div>
                            <div className='cui-statusbar'></div>
                        </div>
                    </div>
                </div>
           
        </div>
    );
};

export default ViewLms;