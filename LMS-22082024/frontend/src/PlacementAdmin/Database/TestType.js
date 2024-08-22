import React, { useState, useEffect ,useContext} from 'react';
import '../../Styles/global.css';
import { Table, Form, Pagination } from 'react-bootstrap';
import { addtesttypeApi, gettesttypeApi, deletetesttypeApi, updatetesttypeApi } from '../../api/endpoints';
import DeleteIcon from '../../assets/Images/delete.png';
import UpdateIcon from '../../assets/Images/Update.png';
import { SearchContext } from '../../AllSearch/SearchContext';
import Add from'../../assets/Images/add.png'
import ErrorModal from '../auth/ErrorModal';
const TestTypeManagement = () => {
  const [testTypes, setTestTypes] = useState([]);
  const [newTestType, setNewTestType] = useState('');
  const [newTestTypeCategory, setNewTestTypeCategory] = useState('');
  const [updateTestType, setUpdateTestType] = useState('');
  const [updateTestTypeCategory, setUpdateTestTypeCategory] = useState('');
  const [updateTestTypeId, setUpdateTestTypeId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);
  const handleCloseError = () => {
    setShowError(false);
};
  // Fetch test types
  useEffect(() => {
    const fetchTestTypes = async () => {
      try {
        const testTypesData = await gettesttypeApi();
        setTestTypes(testTypesData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTestTypes();
  }, []);

  const handleAddTestType = async () => {
    try {
      const response = await addtesttypeApi({ test_type: newTestType, test_type_categories: newTestTypeCategory });
      setTestTypes([...testTypes, response]);
     // alert("Data Added Successfully")
     setErrorMessage('Data Added Successfully');
      setShowError(true);
      setNewTestType('');
      setNewTestTypeCategory('');
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add test type. Please try again.');
    }
  };

  const handleDeleteTestType = async (testTypeId) => {
    try {
      await deletetesttypeApi(testTypeId);
      setTestTypes(testTypes.filter((type) => type.id !== testTypeId));
    } catch (error) {
      console.error('Error:', error);
      // Handle error
    }
  };

  const handleUpdateTestType = async () => {
    try {
      const response = await updatetesttypeApi(updateTestTypeId, { test_type: updateTestType, test_type_categories: updateTestTypeCategory });
      setTestTypes(testTypes.map((type) => (type.id === updateTestTypeId ? response : type)));
     // alert("Data Updated Successfully")
     setErrorMessage('Data Updated Successfully');
      setShowError(true);
      setUpdateTestType('');
      setUpdateTestTypeCategory('');
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update test type. Please try again.');
    }
  };
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTestTypes = testTypes
    .filter(content => !searchQuery || (content.test_type && content.test_type.toLowerCase().includes(searchQuery.toLowerCase()))
      || (content.test_type_categories && content.test_type_categories.toLowerCase().includes(searchQuery.toLowerCase())))
    .slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(testTypes.length / itemsPerPage);

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
      <button className='button-ques-save-add' style={{width:"120px"}}onClick={() => setShowAddForm(true)}><img src={Add} className='nextarrow' style={{ marginRight: "2px" }}></img>
      <strong>TestType</strong></button>
       <p></p>
      {showAddForm && (
        <div className="popup-container">
          <select
            value={newTestType}
            onChange={(e) => setNewTestType(e.target.value)}

            className='input-ques'
          >
            <option value="">Select Test Type</option>
            <option value="MCQ Test">MCQ Test</option>
            <option value="Coding Test">Coding Test</option>

          </select>
          <p></p>

          <select
            value={newTestTypeCategory}
            onChange={(e) => setNewTestTypeCategory(e.target.value)}

            className='input-ques'
          >
            <option value="">Select Test Type Category</option>
            <option value="Pre/Post Assessment">Pre/Post Assessment</option>
            <option value="Assessment">Assessment</option>
            <option value="Mock/Interview">Mock/Interview</option>
            <option value="Company Specific">Company Specific</option>
          </select>
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "120px" }} onClick={handleAddTestType}>Save</button>
            <button className='cancel' style={{ width: "120px" }} onClick={() => setShowAddForm(false)}>Cancel</button></div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <select
            type="text"
            value={updateTestType}
            onChange={(e) => setUpdateTestType(e.target.value)}
            className='input-ques'
          >
            <option value="">Select Test Type</option>
            <option value="MCQ Test">MCQ Test</option>
            <option value="Coding Test">Coding Test</option>

          </select>
          <p></p>

          <select
            value={updateTestTypeCategory}
            onChange={(e) => setUpdateTestTypeCategory(e.target.value)}
            className='input-ques'
          >
            <option value="">Select Category..</option>
            <option value="Pre/Post Assessment">Pre/Post Assessment</option>
            <option value="Assessment">Assessment</option>
            <option value="Mock/Interview">Mock/Interview</option>
            <option value="Company Specific">Company Specific</option>
          </select>
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "120px" }} onClick={handleUpdateTestType}>Update</button>
            <button className='cancel' style={{ width: "120px" }} onClick={() => setShowUpdateForm(false)}>Cancel</button></div>
        </div>
      )}
      {/*errorMessage && <p className="error-message">{errorMessage}</p>*/}
      <div>
         <div >
        <table className="product-table" >
          <thead className="table-thead">
            <tr>
              <th>Test Types</th>
              <th>Categories</th>
              <th>Update</th>
              <th>Delete</th>
             
            </tr>
          </thead>
          <tbody className="table-tbody">
          {currentTestTypes.map((type) =>  (
              <tr key={type.id}>
                <td>{type.test_type}</td>
                <td>{type.test_type_categories}</td>
                <td>
                <button className="action-button edit" onClick={() => {
                    setShowUpdateForm(true);
                    setUpdateTestTypeId(type.id);
                    setUpdateTestType(type.test_type);
                    setUpdateTestTypeCategory(type.test_type_categories);
                  }} >✏️</button>
                  
                </td>
                <td>
                <button className="action-button delete" style={{color:"orange"}} onClick={() => handleDeleteTestType(type.id)}
                >🗑</button>
                  
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
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
          <Pagination className="pagination-custom" style={{boxShadow: 'none', outline: 'none'}}>
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

export default TestTypeManagement;
