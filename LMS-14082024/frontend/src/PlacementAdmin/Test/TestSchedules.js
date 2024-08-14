import React, { useState, useEffect, useContext } from 'react';
import { Table, Form, Pagination } from 'react-bootstrap';
import { get_test_name_group_API, deleteTestcadidateApi, getTestcandidateApi, getTestSchedules_College_API } from '../../api/endpoints';
import { Link } from 'react-router-dom';
import '../../Styles/global.css';
import { testNameContext } from './context/TestTypeContext';
import Footer from '../../Footer/Footer';
import ErrorModal from '../auth/ErrorModal';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Ensure this import if using npm
import { SearchContext } from '../../AllSearch/SearchContext';


const TestSchedules = ({ collegeName, username, institute }) => {
    const [testCandidates, setTestCandidates] = useState([]);
    const [searchable, setSearchable] = useState('');
    const { setTestName } = useContext(testNameContext);
    const { searchQuery } = useContext(SearchContext);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
   
    const handleCloseError = () => {
      setShowError(false);
  };
    useEffect(() => {
        getTestCandidates();
    }, [testCandidates]);

    const getTestCandidates = () => {
        getTestSchedules_College_API(institute)
            .then(data => {
                setTestCandidates(data);
                console.log("filter", data);
            })
            .catch(error => console.error('Error fetching test candidates:', error));
    };



    const handleDelete = (test_name) => {
        console.log('test_name: ', test_name);
        deleteTestcadidateApi(test_name)
            .then(() => {
                setErrorMessage('Test candidate deleted successfully');
      setShowError(true);
                //alert('Test candidate deleted successfully');
                getTestCandidates(); // Refresh the data
            })
            .catch(error => {
                setErrorMessage('Failed to delete test candidate');
      setShowError(true);
                console.error('Error deleting test candidate:', error);
                //alert('Failed to delete test candidate');
            });
    };

    const handleGetTestName = (tName) => {
        setTestName(tName);
        console.log('Set test name: ', tName);
    };


    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(testCandidates.length / itemsPerPage);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const currentData = testCandidates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const getPaginationItems = () => {
        let items = [];
        const maxDisplayedPages = 1; // number of pages to display before and after the current page

        if (totalPages <= 1) return items;

        items.push(
            <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
                1
            </Pagination.Item>
        );

        if (currentPage > maxDisplayedPages + 2) {
            items.push(<Pagination.Ellipsis key="start-ellipsis" />);
        }

        let startPage = Math.max(2, currentPage - maxDisplayedPages);
        let endPage = Math.min(totalPages - 1, currentPage + maxDisplayedPages);

        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page}
                </Pagination.Item>
            );
        }

        if (currentPage < totalPages - maxDisplayedPages - 1) {
            items.push(<Pagination.Ellipsis key="end-ellipsis" />);
        }

        items.push(
            <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
                {totalPages}
            </Pagination.Item>
        );

        return items;
    };


    return (
        <div>
            <div className="product-table-container">
                <h4>Test Schedule</h4>

                <input
                    className="search-box1"
                    type="text"
                    placeholder="Search..."
                    value={searchable}
                    onChange={(e) => setSearchable(e.target.value)}
                />
                <table className="product-table" >
                    <thead className="table-thead" style={{ textAlign: "center" }}>
                        <tr>
                            <th style={{ width: "200px", textAlign: "left" }}>Test Name</th>
                            <th>Question Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th style={{ textAlign: "center" }}>Candidates</th>
                            <th>Add</th>
                            <th style={{ textAlign: "center" }}>View Results</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody className="table-tbody" style={{ fontSize: '14px' }} >
                        {currentData
                            .filter(item =>
                                !searchQuery ||
                                (item.test_name && item.test_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (item.question_paper_name && typeof item.question_paper_name === 'string' && item.question_paper_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (item.dtm_start && typeof item.dtm_start === 'string' && item.dtm_start.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (item.dtm_end && typeof item.dtm_end === 'string' && item.dtm_end.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .filter(item =>
                                !searchable ||
                                (item.test_name && item.test_name.toLowerCase().includes(searchable.toLowerCase())) ||
                                (item.question_paper_name && typeof item.question_paper_name === 'string' && item.question_paper_name.toLowerCase().includes(searchable.toLowerCase())) ||
                                (item.dtm_start && typeof item.dtm_start === 'string' && item.dtm_start.toLowerCase().includes(searchable.toLowerCase())) ||
                                (item.dtm_end && typeof item.dtm_end === 'string' && item.dtm_end.toLowerCase().includes(searchable.toLowerCase()))
                            )
                            .map((item) => (
                                <tr key={item.id} className="table-row">
                                    <td>
                                        <Link to={`/update-test/`} onClick={() => handleGetTestName(item.test_name)} style={{ color: "white" }}>{item.test_name}</Link>
                                    </td>
                                    <td>{item.question_paper_name}</td>
                                    <td>{item.dtm_start}</td>
                                    <td>{item.dtm_end}</td>
                                    <td style={{ textAlign: "center" }}>
                                        <Link to={`/test-report/${item.test_name}`} style={{ color: "white" }}>
                                            {item.student_count}
                                        </Link>
                                    </td>
                                    <td>
                                        <Link to={`/add-candidate/${item.test_name}`}>
                                            <button className="action-button add">
                                                <i className="fas fa-plus plus-icon"></i>
                                            </button>
                                        </Link>
                                    </td>
                                    <td style={{ textAlign: 'center' }}>
                                        <Link to={`/test-result/${item.test_name}`} >
                                            <button className="action-button view" style={{ color: "white" }}>👁</button>
                                        </Link>
                                    </td>
                                    <td>
                                        <button className="action-button delete" onClick={() => handleDelete(item.test_name)} style={{ color: "orange" }}>
                                            🗑
                                        </button>
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table><p></p>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Form>
                        <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
                            <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
                            <Form.Control style={{width:"50px",boxShadow: 'none', outline: 'none'}}
                                as="select"
                                value={itemsPerPage}
                                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                            >
                                <option value={5}>5</option>
                                <option value={10}>10</option>
                                <option value={15}>15</option>
                            </Form.Control>
                        </Form.Group>
                    </Form>
                    <Pagination className="pagination-custom" style={{ marginTop: "-2px",boxShadow: 'none', outline: 'none' }}>
                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
                        {getPaginationItems()}
                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
                    </Pagination>
                </div>
            </div>  <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
     
        </div>
    );
};

export default TestSchedules;
