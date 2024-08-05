import React, { useState, useEffect, useContext } from 'react';
import { addSkillApi, getSkillApi, updateSkillApi, deleteSkillApi } from '../../api/endpoints';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SearchContext } from '../../AllSearch/SearchContext';
import '../../Styles/global.css';
import { Table, Form, Pagination } from 'react-bootstrap';
import Add from '../../assets/Images/add.png';
import ErrorModal from '../auth/ErrorModal';
const Skill = () => {
  const [skills, setSkills] = useState([]);
  const [newSkill, setNewSkill] = useState({ skill_name: '' });
  const [updateSkill, setUpdateSkill] = useState({ skill_name: '' });
  const [updateSkillId, setUpdateSkillId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);
  const [showError, setShowError] = useState(false);
 // const [errorMessage, setErrorMessage] = useState('');
 
  const handleCloseError = () => {
    setShowError(false);
};
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const skillsData = await getSkillsWithPagination(currentPage, itemsPerPage);
        setSkills(skillsData);
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Failed to fetch skills. Please try again.');
      }
    };

    fetchSkills();
  }, [currentPage, itemsPerPage]); // Trigger fetch on page change or items per page change

  const getSkillsWithPagination = async (page, limit) => {
    try {
      const response = await getSkillApi(page, limit);
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleAddSkill = async () => {
    try {
      const response = await addSkillApi(newSkill);
      setSkills([...skills, response]);
     // alert("Data Added Successfully")
     setErrorMessage('Data Added Successfully');
     setShowError(true);

      setNewSkill({ skill_name: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add skill. Please try again.');
    }
  };

  const handleDeleteSkill = async (skillId) => {
    try {
      await deleteSkillApi(skillId);
      setSkills(skills.filter((skill) => skill.id !== skillId));
      setErrorMessage('Data Deleted Successfully');
      setShowError(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete skill. Please try again.');
    }
  };

  const handleUpdateSkill = async () => {
    try {
      const response = await updateSkillApi(updateSkillId, updateSkill);
      setSkills(skills.map((skill) => (skill.id === updateSkillId ? response : skill)));
      setErrorMessage('Data Updated Successfully');
      setShowError(true);
      //alert("Data Updated Successfully")
      setUpdateSkill({ skill_name: '' });
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update skill. Please try again.');
    }
  };

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentSkills = skills.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(skills.length / itemsPerPage);

  // const getPaginationItems = () => {
  //   let items = [];
  //   const maxDisplayedPages = 1; // number of pages to display before and after the current page

  //   if (totalPages <= 1) return items;

  //   items.push(
  //     <Pagination.Item key={1} active={1 === currentPage} onClick={() => handlePageChange(1)}>
  //       1
  //     </Pagination.Item>
  //   );

  //   if (currentPage > maxDisplayedPages + 2) {
  //     items.push(<Pagination.Ellipsis key="start-ellipsis" />);
  //   }

  //   let startPage = Math.max(2, currentPage - maxDisplayedPages);
  //   let endPage = Math.min(totalPages - 1, currentPage + maxDisplayedPages);

  //   for (let page = startPage; page <= endPage; page++) {
  //     items.push(
  //       <Pagination.Item key={page} active={page === currentPage} onClick={() => handlePageChange(page)}>
  //         {page}
  //       </Pagination.Item>
  //     );
  //   }

  //   if (currentPage < totalPages - maxDisplayedPages - 1) {
  //     items.push(<Pagination.Ellipsis key="end-ellipsis" />);
  //   }

  //   items.push(
  //     <Pagination.Item key={totalPages} active={totalPages === currentPage} onClick={() => handlePageChange(totalPages)}>
  //       {totalPages}
  //     </Pagination.Item>
  //   );

  //   return items;
  // };

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
        <img src={Add} style={{ marginRight: "2px" }} className='nextarrow' alt="Add Skill" />
        <strong>Add</strong>
      </button>
      <p></p><p></p>
      {showAddForm && (
        <div className="popup-container">
          <input
            type="text"
            autocomplete="off"
            value={newSkill.skill_name}
            onChange={(e) => setNewSkill({ ...newSkill, skill_name: e.target.value })}
            placeholder="Enter skill name"
            className='input-ques'
          /><p></p>
          <div className='button-container'>
            <button className='button-ques-save-master'  onClick={handleAddSkill}>Save</button>
            <button className='cancel-master'  onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <input
            type="text"
            autocomplete="off"
            value={updateSkill.skill_name}
            className='input-ques'
            onChange={(e) => setUpdateSkill({ ...updateSkill, skill_name: e.target.value })}
            placeholder="Enter updated skill name"
          /><p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "100px" }} onClick={handleUpdateSkill}>Update</button>
            <button className='cancel' style={{ width: "100px" }} onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/*errorMessage && <p className="error-message">{errorMessage}</p>*/}
      <div>
      <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>Skill Name</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentSkills
              .filter(content => !searchQuery || (content.skill_name && content.skill_name.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.skill_name}</td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateSkillId(skill.id);
                      setUpdateSkill({ skill_name: skill.skill_name });
                    }}>✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" onClick={() => handleDeleteSkill(skill.id)} style={{ color: "orange" }} >🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
        <p></p><p></p>
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

export default Skill;
