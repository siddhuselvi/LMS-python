import React, { useState, useEffect, useContext } from 'react';
import { Pagination, Form } from 'react-bootstrap';
import { adddepartmentApi, getdepartmentApi, updatedepartmentApi, deletedepartmentApi } from '../../api/endpoints';
import { SearchContext } from '../../AllSearch/SearchContext';
import '../../Styles/global.css';
import Add from '../../assets/Images/add.png';
import ErrorModal from '../auth/ErrorModal';
const DepartmentManagement = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState('');
  const [updateDepartment, setUpdateDepartment] = useState('');
  const [updateDepartmentId, setUpdateDepartmentId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const handleCloseError = () => {
    setShowError(false);
};
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const departmentsData = await getdepartmentApi();
        setDepartments(departmentsData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleAddDepartment = async () => {
    if (!newDepartment.trim()) {
      setErrorMessage('Department name is required.');
      setShowError(true);
      return;
    }
    try {
      const response = await adddepartmentApi({ department: newDepartment });
      setDepartments([...departments, response]);
     // alert("Data Added Successfully")
     setErrorMessage('Data Added Successfully');
     setShowError(true);
      setNewDepartment('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add department. Please try again.');
    }
  };

  const handleDeleteDepartment = async (departmentId) => {
    try {
      await deletedepartmentApi(departmentId);
      setDepartments(departments.filter((department) => department.id !== departmentId));
      setErrorMessage('Data Deleted Successfully');
      setShowError(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete department. Please try again.');
    }
  };

  const handleUpdateDepartment = async () => {
    try {
      const response = await updatedepartmentApi(updateDepartmentId, { department: updateDepartment });
      setDepartments(departments.map((department) => (department.id === updateDepartmentId ? response : department)));
     // alert("Data Updated Successfully")
     setErrorMessage('Data Updated Successfully');
     setShowError(true);
      setUpdateDepartment('');
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update department. Please try again.');
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentDepartments = departments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(departments.length / itemsPerPage);

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
        <img src={Add} className='nextarrow' alt="Add" style={{ marginRight: "2px" }}/>
        <strong>Add</strong>
      </button>
      <p></p>
      {showAddForm && (
        <div className="popup-container">
          <input
            type="text"
            value={newDepartment}
            autocomplete="off"
            onChange={(e) => setNewDepartment(e.target.value)}
            placeholder="Enter department name"
            className='input-ques'
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save-master'  onClick={handleAddDepartment}>Save</button>
            <button className='cancel-master' onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <input
            type="text"
            value={updateDepartment}
            autocomplete="off"
            onChange={(e) => setUpdateDepartment(e.target.value)}
            placeholder="Enter updated department name"
            className='input-ques'
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "130px" }} onClick={handleUpdateDepartment}>Update</button>
            <button className='cancel' style={{ width: "130px" }} onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/*errorMessage && <p className="error-message">{errorMessage}</p>*/}
      <div className='table-container2'>
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>Department</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentDepartments
              .filter(content => !searchQuery || (content.department && content.department.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((department) => (
                <tr key={department.id}>
                  <td>{department.department}</td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateDepartmentId(department.id);
                      setUpdateDepartment(department.department);
                    }}>✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" style={{ color: "orange" }} onClick={() => handleDeleteDepartment(department.id)}>🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex', marginTop: '10px' }}>
          <Form.Label className='display' style={{ marginRight: '10px' }}>Display:</Form.Label>
          <Form.Control
          className='label-dis'
            style={{ width: "50px" ,boxShadow: 'none', outline: 'none'}}
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
        <Pagination className="pagination-custom" >
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {getPaginationItems()}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
     
    </div>
  );
};

export default DepartmentManagement;
