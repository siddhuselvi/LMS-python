import React, { useState, useEffect,useContext } from 'react';
import { Table, Form, Pagination } from 'react-bootstrap';
import '../../Styles/global.css';
import { getQuestionPaperApi, deleteQuestionpaperApi } from '../../api/endpoints';
import { Link } from 'react-router-dom';
import Footer from '../../Footer/Footer';
import ErrorModal from '../auth/ErrorModal';
import { SearchContext } from '../../AllSearch/SearchContext';
const QuesPaperTb = () => {
  const [quesPaper, setQuesPaper] = useState([]);
  const [test_name, setTestName] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const { searchQuery } = useContext(SearchContext);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseError = () => {
    setShowError(false);
  };
  useEffect(() => {
    getQuestionPapers();
  }, []); // Run once on component mount

  const handleDelete = (id) => {
    deleteQuestionpaperApi(id)
      .then(() => {
        // Remove the deleted question paper from the state
        setQuesPaper((prevPapers) => prevPapers.filter((ques) => ques.id !== id));
        setErrorMessage('Questions Deleted Successfully');
        setShowError(true);
      })
      .catch((error) => console.error('Error deleting question paper:', error));
  };

  const getQuestionPapers = () => {
    getQuestionPaperApi()
      .then((data) => {
        setQuesPaper(data);
      })
      .catch((error) => console.error('Error fetching question papers:', error));
  };

  const filteredData = quesPaper.filter((item) => {
    // Ensure item.question_paper_name is a string before calling toLowerCase
    const questionPaperName = item.question_paper_name || '';
    return questionPaperName.toLowerCase().includes(test_name.toLowerCase());
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPaginationItems_OLD = () => {
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



  
  const getPaginationItems = () => {
    const items = [];
    let startPage, endPage;
  
    if (totalPages <= 3) {
      startPage = 1;
      endPage = totalPages;
    } else if (currentPage === 1) {
      startPage = 1;
      endPage = 3;
    } else if (currentPage === totalPages) {
      startPage = totalPages - 2;
      endPage = totalPages;
    } else {
      startPage = currentPage - 1;
      endPage = currentPage + 1;
    }
  
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Pagination.Item>
      );
    }
  
    return items;
  };


  

  return (
    <div>
      <div className="product-table-container">
        <h2>Question Papers</h2>
        <br />

        <input
          className="search-box"
          type="text"
          placeholder="Search..."
          value={test_name}
          onChange={(e) => setTestName(e.target.value)}
        />
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>Question Paper</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
          {currentData
                            .filter(item =>
                                !searchQuery ||
                                (item.question_paper_name && typeof item.question_paper_name === 'string' && item.question_paper_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                (item.test_type && typeof item.test_type === 'string' && item.test_type.toLowerCase().includes(searchQuery.toLowerCase()))
                            )
                            .filter(item =>
                                !search ||
                                (item.question_paper_name && typeof item.question_paper_name === 'string' && item.question_paper_name.toLowerCase().includes(search.toLowerCase())) ||
                                (item.test_type && typeof item.test_type === 'string' && item.test_type.toLowerCase().includes(search.toLowerCase()))
                            )
                            .map((item) => (
              <tr key={item.id} className="table-row">
                <td>{item.question_paper_name}</td>
                <td>
                  <Link
                    to={item.test_type === 'MCQ Test' ? `/update-mcq-form/${item.id}` : `/update-code-form/${item.id}`}
                  >
                    <button className="action-button edit">✏️</button>
                  </Link>
                </td>
                <td>
                  <Link onClick={() => handleDelete(item.id)}>
                    <button className="action-button delete" style={{ color: 'orange' }}>
                      🗑
                    </button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table><p></p>
        <div className='dis-page'>
         
            <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
              <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
              <Form.Control
                as="select"style={{ width: "50px", boxShadow: 'none', outline: 'none' }}
                className='label-dis'                  
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1); // Reset page to 1 when items per page changes
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </Form.Control>
            </Form.Group>
          
         
          <Pagination className="pagination-custom" >
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {getPaginationItems()}
            <Pagination.Next
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            />
          </Pagination>
         
        </div>
      </div>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

      
    </div>
  );
};

export default QuesPaperTb;
