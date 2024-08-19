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
    if (!newSkillType.trim()) {
      setErrorMessage('Skill Type is required.');
      setShowError(true);
      return;
    }
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
      setErrorMessage('Data Deleted Successfully');
      setShowError(true);
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

  return (
    <div>
      <button className='button-ques-save-add' style={{marginTop:"30px",width:"110px"}} onClick={() => setShowAddForm(true)}>
        <img src={Add} className='nextarrow' alt="Add" style={{marginRight:"2px"}} />
        <strong>Add</strong>
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
            <button className='button-ques-save-master' onClick={handleAddSkillType}>Save</button>
            <button className='cancel-master'  onClick={() => setShowAddForm(false)}>Cancel</button>
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
          <Form.Label className='display'>Display:</Form.Label>
          <Form.Control
          className='label-dis'
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

export default SkillsManagement;
