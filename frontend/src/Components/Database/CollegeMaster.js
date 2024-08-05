import React, { useState, useEffect, useContext } from 'react';
import { Pagination, Form } from 'react-bootstrap';
import {
  addcollgeApi,
  getcollegeApi,
  updatecollegeApi,
  deletecollegApi,
  addCollege_logo_API,
  getCollege_logo_API,
  updateCollege_logo_API
} from '../../api/endpoints';
import DeleteIcon from '../../assets/Images/delete.png';
import UpdateIcon from '../../assets/Images/Update.png';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SearchContext } from '../../AllSearch/SearchContext';
import '../../Styles/global.css'
import ErrorModal from '../auth/ErrorModal';
import Add from '../../assets/Images/add.png'
const CollegeManagement = () => {
  const [colleges, setColleges] = useState([]);
  const [newCollege, setNewCollege] = useState('');
  const [updateCollege, setUpdateCollege] = useState('');
  const [updateCollege_Logo, setUpdateCollege_Logo] = useState('');
  const [updateCollegeId, setUpdateCollegeId] = useState(null);
  //const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [collegeLogo, setCollegeLogo] = useState(null);

  const handleCloseError = () => {
    setShowError(false);
  };

  const handleFileChange = (e) => {
    setCollegeLogo(e.target.files[0]);
  };


  const handleFileChangeLogo = (e) => {
    setUpdateCollege_Logo(e.target.files[0]);
  };



  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch colleges
  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const collegesData = await getCollege_logo_API();
        setColleges(collegesData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchColleges();
  }, []);

  const handleAddCollege = async () => {
    console.log('new_College: ', newCollege);
    console.log('Clg Logo: ', collegeLogo);

    try {
      const response = await addCollege_logo_API({ college: newCollege, college_logo: collegeLogo });
      setColleges([...colleges, response]);
      setErrorMessage('Data Added Successfully');
      setShowError(true);

      setNewCollege('');
      setCollegeLogo(null);
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add college. Please try again.');
      setShowError(true);
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    try {
      await deletecollegApi(collegeId);
      setColleges(colleges.filter((college) => college.id !== collegeId));
      setErrorMessage('Data Deleted Successfully');
      setShowError(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Data Not Deleted ');
      // Handle error
    }
  };

  const handleUpdateCollege = async () => {
    try {
      
      const response = await updateCollege_logo_API(updateCollegeId, { college: updateCollege, college_logo: updateCollege_Logo });
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

  const getPaginationItems_OLD = () => {
    const items = [];
    const startPage = Math.max(1, currentPage - 1);
    const endPage = Math.min(totalPages, currentPage + 1);

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
      <button className='button-ques-save-add' style={{ width: "110px" }} onClick={() => setShowAddForm(true)}>
        <img src={Add} className='nextarrow' alt="Add" style={{ marginRight: "2px" }} />
        <strong>Add</strong>
      </button>
      <p></p>
      <p></p>
      {showAddForm && (
        <div className="popup-container-clg">
          <div className="input-group-clg">
            <input
              type="text"
              value={newCollege}
              autoComplete="off"
              onChange={(e) => setNewCollege(e.target.value)}
              placeholder="Enter college name"
              className='input-ques-clg'
            />
            <p></p>
            <div className="file-input-group-clg">
              <label htmlFor="collegeLogo" className="input-button-ques-mcq-clg">Choose College Logo</label>
              <input
                type="file"
                id="collegeLogo"
                name="collegeLogo"
                onChange={handleFileChange}
                className="input-file-ques-mcq-clg"
              />
              {collegeLogo && <span className="file-name-clg">{collegeLogo.name}</span>}
            </div>
          </div>
          <div className='button-container'>
            <button className='button-ques-save-master' onClick={handleAddCollege}>Save</button>
            <button className='cancel-master' onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container-clg">
          <div className="input-group-clg">

            <input
              autocomplete="off"
              type="text"
              value={updateCollege}
              className='input-ques-clg'
              onChange={(e) => setUpdateCollege(e.target.value)}
              placeholder="Enter updated college name"
            />
            <p></p>
            <div className="file-input-group-clg1">
              <label htmlFor="collegeLogo" className="input-button-ques-mcq-clg">Choose College Logo</label>
              <input
                type="file"
                id="collegeLogo"
                name="collegeLogo"
                onChange={handleFileChangeLogo}
                className="input-file-ques-mcq-clg"
              />
              {updateCollege_Logo && typeof updateCollege_Logo === 'string' && (
                <img src={`data:image/jpeg;base64,${updateCollege_Logo}`} alt="Current logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              )}
              {updateCollege_Logo && typeof updateCollege_Logo !== 'string' && (
                <span className="file-name-clg">{updateCollege_Logo.name}</span>
              )}
            </div>
          </div>
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
              <th> College Logo</th>
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
                  <td >
                    {college.college_logo ? (
                      <img src={`data:image/png;base64,${college.college_logo}`} alt="College Logo" style={{ width: "70px", height: "auto" }} />
                    ) : (
                      "No Logo"
                    )}
                  </td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateCollegeId(college.id);
                      setUpdateCollege(college.college);
                      setUpdateCollege_Logo(college.college_logo);
                    }}>✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" onClick={() => handleDeleteCollege(college.id)} style={{ color: "orange" }}>🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table><p></p><p></p>
        <div className='dis-page'>
          <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex', }}>
            <Form.Label className='display' >Display:</Form.Label>
            <Form.Control
              className='label-dis'
              style={{ width: "50px", boxShadow: 'none', outline: 'none' }}
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
          <Pagination className="pagination-custom">
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {getPaginationItems()}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
      </div>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

    </div>
  );
};

export default CollegeManagement;
