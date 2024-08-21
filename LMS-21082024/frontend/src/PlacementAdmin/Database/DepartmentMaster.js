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
      <button className='button-ques-save-add' style={{ width: "130px" }} onClick={() => setShowAddForm(true)}>
        <img src={Add} className='nextarrow' alt="Add" style={{ marginRight: "2px" }}/>
        <strong>Department</strong>
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
            <button className='button-ques-save' style={{ width: "130px" }} onClick={handleAddDepartment}>Save</button>
            <button className='cancel' style={{ width: "130px" }} onClick={() => setShowAddForm(false)}>Cancel</button>
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
          <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
          <Form.Control
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
        <Pagination className="pagination-custom" style={{marginLeft: "700px", marginTop: '-34px',boxShadow: 'none', outline: 'none' }}>
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
