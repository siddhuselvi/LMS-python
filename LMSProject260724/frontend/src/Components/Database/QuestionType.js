import React, { useState, useEffect, useContext } from 'react';
import '../../Styles/global.css';
import { addqstntypeApi, getqstntypeApi, updateqstntypeApi, deleteqstntypeApi } from '../../api/endpoints';
import DeleteIcon from '../../assets/Images/delete.png';
import UpdateIcon from '../../assets/Images/Update.png';
import { SearchContext } from '../../AllSearch/SearchContext';
import { Table, Form, Pagination } from 'react-bootstrap';
import Add from '../../assets/Images/add.png';
import ErrorModal from '../auth/ErrorModal';
const QuestionsManagement = () => {
  const [questionTypes, setQuestionTypes] = useState([]);
  const [newQuestionType, setNewQuestionType] = useState('');
  const [updateQuestionType, setUpdateQuestionType] = useState('');
  const [updateQuestionTypeId, setUpdateQuestionTypeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showError, setShowError] = useState(false);
  const handleCloseError = () => {
    setShowError(false);
};
  // Fetch question types
  useEffect(() => {
    const fetchQuestionTypes = async () => {
      try {
        const questionTypesData = await getqstntypeApi();
        setQuestionTypes(questionTypesData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchQuestionTypes();
  }, []);

  const handleAddQuestionType = async () => {
    try {
      const response = await addqstntypeApi({ question_type: newQuestionType });
      setQuestionTypes([...questionTypes, response]);
     // alert("Data Added Successfully")
     setErrorMessage('Data Added Successfully');
     setShowError(true);
      setNewQuestionType('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add question type. Please try again.');
    }
  };

  const handleDeleteQuestionType = async (questionTypeId) => {
    try {
      await deleteqstntypeApi(questionTypeId);
      
      setQuestionTypes(questionTypes.filter((type) => type.id !== questionTypeId));
      setErrorMessage('Data Deleted Successfully');
      setShowError(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Data Not Deleted ');
      // Handle error
    }
  };

  const handleUpdateQuestionType = async () => {
    try {
      const response = await updateqstntypeApi(updateQuestionTypeId, { question_type: updateQuestionType });
      setQuestionTypes(questionTypes.map((type) => (type.id === updateQuestionTypeId ? response : type)));
     // alert("Data Updated Successfully")
     setErrorMessage('Data Updated Successfully');
     setShowError(true);
      setUpdateQuestionType('');
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update question type. Please try again.');
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentQuestionTypes = questionTypes
    .filter(content => !searchQuery || (content.question_type && content.question_type.toLowerCase().includes(searchQuery.toLowerCase())))
    .slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(questionTypes.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
      <button className='button-ques-save-add' style={{ width: "110px" }} onClick={() => setShowAddForm(true)}>
        <img src={Add} className='nextarrow' alt="Add"  />
        <strong>Add</strong>
      </button>
      <p></p>
      {showAddForm && (
        <div className="popup-container">
          <input
            type="text"
            value={newQuestionType}
            autocomplete="off"
            onChange={(e) => setNewQuestionType(e.target.value)}
            placeholder="Enter question type"
            className='input-ques'
          /><p></p>
          <div className='button-container'>
            <button className='button-ques-save-master' onClick={handleAddQuestionType}>Save</button>
            <button className='cancel-master' onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <input
            type="text"
            value={updateQuestionType}
            autocomplete="off"
            onChange={(e) => setUpdateQuestionType(e.target.value)}
            placeholder="Enter updated question type"
            className='input-ques'
          /><p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "110px" }} onClick={handleUpdateQuestionType}>Update</button>
            <button className='cancel' style={{ width: "110px" }} onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/*errorMessage && <p className="error-message">{errorMessage}</p>*/}
      <div>
        <div className='table-container2'>
          <table className="product-table">
            <thead className="table-thead">
              <tr>
                <th>Question Type</th>
                <th>Update</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {currentQuestionTypes.map((type) => (
                <tr key={type.id}>
                  <td>{type.question_type}</td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateQuestionTypeId(type.id);
                      setUpdateQuestionType(type.question_type);
                    }} >✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" style={{ color: "orange" }} onClick={() => handleDeleteQuestionType(type.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

        <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
          <Form.Label className='display2'>Display:</Form.Label>
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
        <Pagination className="pagination-custom" style={{boxShadow: 'none', outline: 'none'}}>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {getPaginationItems()}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
     
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
      
    </div>
  );
};

export default QuestionsManagement;
