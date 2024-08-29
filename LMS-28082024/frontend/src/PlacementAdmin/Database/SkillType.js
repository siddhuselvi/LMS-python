import React, { useState, useEffect, useContext } from 'react';
import '../../Styles/global.css';
import { Table, Form, Pagination } from 'react-bootstrap';
import { addSkilltypeApi, updateSkilltypeApi, deleteSkilltypeApi, getSkilltypeApi } from '../../api/endpoints';
import DeleteIcon from '../../assets/Images/delete.png';
import UpdateIcon from '../../assets/Images/Update.png';
import { SearchContext } from '../../AllSearch/SearchContext';
import Add from '../../assets/Images/add.png';
import ErrorModal from '../auth/ErrorModal';
const SkillsManagement = () => {
  const [skillTypes, setSkillTypes] = useState([]);
  const [newSkillType, setNewSkillType] = useState('');
  const [updateSkillType, setUpdateSkillType] = useState('');
  const [updateSkillTypeId, setUpdateSkillTypeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const handleCloseError = () => {
    setShowError(false);
};
  // Fetch skill types
  useEffect(() => {
    const fetchSkillTypes = async () => {
      try {
        const skillTypesData = await getSkilltypeApi();
        setSkillTypes(skillTypesData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchSkillTypes();
  }, []);

  const handleAddSkillType = async () => {
    try {
      const response = await addSkilltypeApi({ skill_type: newSkillType });
      setSkillTypes([...skillTypes, response]);
      //alert("Data Added Successfully")
      setErrorMessage('Data Added Successfully');
      setShowError(true);

      setNewSkillType('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add skill type. Please try again.');
    }
  };

  const handleDeleteSkillType = async (skillTypeId) => {
    try {
      await deleteSkilltypeApi(skillTypeId);
      setSkillTypes(skillTypes.filter((type) => type.id !== skillTypeId));
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete skill type. Please try again.');
    }
  };

  const handleUpdateSkillType = async () => {
    try {
      const response = await updateSkilltypeApi(updateSkillTypeId, { skill_type: updateSkillType });
      setSkillTypes(skillTypes.map((type) => (type.id === updateSkillTypeId ? response : type)));
     // alert("Data Updated Successfully")
     setErrorMessage('Data Updated Successfully');
     setShowError(true);

      setUpdateSkillType('');
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update skill type. Please try again.');
    }
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSkillTypes = skillTypes.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(skillTypes.length / itemsPerPage);

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
      <button className='button-ques-save-add' style={{marginTop:"30px",width:"116px"}} onClick={() => setShowAddForm(true)}>
        <img src={Add} className='nextarrow' alt="Add" style={{marginRight:"2px"}} />
        <strong>SkillType</strong>
      </button>
      <p></p>
      {showAddForm && (
        <div className="popup-container">
          <input
            type="text"
            autocomplete="off"
            className='input-ques'
            value={newSkillType}
            onChange={(e) => setNewSkillType(e.target.value)}
            placeholder="Enter Skill Type"
          /><p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{width:"100px"}} onClick={handleAddSkillType}>Save</button>
            <button className='cancel' style={{width:"100px"}} onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <input
            type="text"
            autocomplete="off"
            className='input-ques'
            value={updateSkillType}
            onChange={(e) => setUpdateSkillType(e.target.value)}
            placeholder="Enter updated skill type"
          /><p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{width:"100px"}} onClick={handleUpdateSkillType}>Update</button>
            <button className='cancel' style={{width:"100px"}} onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/*errorMessage && <p className="error-message">{errorMessage}</p>*/}
      
      <div>
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>Skill Type</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentSkillTypes
              .filter(content => !searchQuery || (content.skill_type && content.skill_type.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((type) => (
                <tr key={type.id}>
                  <td>{type.skill_type}</td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateSkillTypeId(type.id);
                      setUpdateSkillType(type.skill_type);
                    }}>✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" style={{color:"orange"}} onClick={() => handleDeleteSkillType(type.id)}>🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table><p></p>

        <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
          <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
          <Form.Control
            style={{ width: "50px",boxShadow: 'none', outline: 'none' }}
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

        <Pagination className="pagination-custom" style={{ marginLeft: "650px", marginTop: "-34px",boxShadow: 'none', outline: 'none' }}>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {getPaginationItems()}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
     
    </div>
  );
};

export default SkillsManagement;
