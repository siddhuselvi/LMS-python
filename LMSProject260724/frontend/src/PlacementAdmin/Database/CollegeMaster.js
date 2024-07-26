import React, { useState, useEffect,useContext } from 'react';
import { Pagination, Form } from 'react-bootstrap';
import { addcollgeApi, getcollegeApi, updatecollegeApi, deletecollegApi } from '../../api/endpoints';
import DeleteIcon from '../../assets/Images/delete.png';
import UpdateIcon from '../../assets/Images/Update.png';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SearchContext } from '../../AllSearch/SearchContext';
import '../../Styles/global.css'
import ErrorModal from '../auth/ErrorModal';
import Add from'../../assets/Images/add.png'
const CollegeManagement = () => {
  const [colleges, setColleges] = useState([]);
  const [newCollege, setNewCollege] = useState('');
  const [updateCollege, setUpdateCollege] = useState('');
  const [updateCollegeId, setUpdateCollegeId] = useState(null);
  //const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
 
  const handleCloseError = () => {
    setShowError(false);
};
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const collegesData = await getcollegeApi();
        setColleges(collegesData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchColleges();
  }, []);

  const handleAddCollege = async () => {
    try {
      const response = await addcollgeApi({ college: newCollege });
      setColleges([...colleges, response]);
     // alert("Data Added Successfully")
      setErrorMessage('Data Added Successfully');
      setShowError(true);

      setNewCollege('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add college. Please try again.');
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    try {
      await deletecollegApi(collegeId);
      setColleges(colleges.filter((college) => college.id !== collegeId));
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const handleUpdateCollege = async () => {
    try {
      const response = await updatecollegeApi(updateCollegeId, { college: updateCollege });
      setColleges(colleges.map((college) => (college.id === updateCollegeId ? response : college)));
      //alert("Data Updated Successfully")
      setErrorMessage('Data Updated Successfully');
      setShowError(true);

      setUpdateCollege('');
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update college. Please try again.');
    }
  };

// Calculate pagination values
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentColleges = colleges.slice(indexOfFirstItem, indexOfLastItem);
const totalPages = Math.ceil(colleges.length / itemsPerPage);
const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

const getPaginationItems = () => {
  let items = [];
  const maxPagesToShow = 3; // Maximum number of pages to display
  const maxDisplayedPages = Math.floor(maxPagesToShow / 2);

  if (totalPages <= 1) return items;

  // Always show the first page
  items.push(
    <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
      1
    </Pagination.Item>
  );

  // Show start ellipsis if currentPage is beyond the initial window
  if (currentPage > maxDisplayedPages + 2) {
    items.push(<Pagination.Ellipsis key="start-ellipsis" />);
  }

  // Calculate start and end pages for the main window
  let startPage = Math.max(2, currentPage - maxDisplayedPages);
  let endPage = Math.min(totalPages - 1, currentPage + maxDisplayedPages);

  // Adjust for boundary conditions
  if (currentPage <= maxDisplayedPages + 2) {
    endPage = Math.min(totalPages - 1, maxPagesToShow);
  }

  if (currentPage > totalPages - maxDisplayedPages - 2) {
    startPage = Math.max(2, totalPages - maxPagesToShow + 1);
  }

  // Generate pagination items for the main window
  for (let page = startPage; page <= endPage; page++) {
    items.push(
      <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
        {page}
      </Pagination.Item>
    );
  }

  // Show end ellipsis if currentPage is before the final window
  if (currentPage < totalPages - maxDisplayedPages - 1) {
    items.push(<Pagination.Ellipsis key="end-ellipsis" />);
  }

  // Always show the last page if there is more than one page
  if (totalPages > 1) {
    items.push(
      <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
        {totalPages}
      </Pagination.Item>
    );
  }

  return items;
};



  return (
    <div>
      <button className='button-ques-save-add' style={{ width: "100px" }} onClick={() => setShowAddForm(true)}>
        <img src={Add} className='nextarrow' alt="Add" style={{ marginRight: "2px" }}/>
        <strong>College</strong>
      </button>
      <p></p>
      <p></p>
      {showAddForm && (
        <div className="popup-container">
          <input
            type="text"
            value={newCollege}
            autocomplete="off"
            onChange={(e) => setNewCollege(e.target.value)}
            placeholder="Enter college name"
            className='input-ques'
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "100px" }}onClick={handleAddCollege}>Save</button>
            <button className='cancel' style={{ width: "100px" }}onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <input
          autocomplete="off"
            type="text"
            value={updateCollege}
            className='input-ques'
            onChange={(e) => setUpdateCollege(e.target.value)}
            placeholder="Enter updated college name"
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "100px" }} onClick={handleUpdateCollege}>Update</button>
            <button className='cancel' style={{ width: "100px" }} onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      
       <div>
      
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>College</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentColleges
              .filter(content => !searchQuery || (content.college && content.college.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((college) => (
                <tr key={college.id}>
                  <td>{college.college}</td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateCollegeId(college.id);
                      setUpdateCollege(college.college);
                    }}>✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" onClick={() => handleDeleteCollege(college.id)} style={{ color: "orange" }}>🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table><p></p><p></p>
        <Form.Group controlId="itemsPerPageSelect"  style={{ display: 'flex',  }}>
          <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
          <Form.Control
            style={{ width: "50px" ,boxShadow: 'none', outline: 'none' }}
            as="select"
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1); // Reset to first page on items per page change
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={15}>15</option>
          </Form.Control>
        </Form.Group>
        <Pagination className="pagination-custom" style={{ marginLeft: "600px", marginTop: "-34px" ,boxShadow: 'none', outline: 'none'}}>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {getPaginationItems()}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
                       
    </div>
  );
};

export default CollegeManagement;
