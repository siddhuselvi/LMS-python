import React, { useState, useEffect, useContext } from 'react';
import { Pagination, Form } from 'react-bootstrap';
import { addtopicApi, gettopicApi, updatetopicApi, deletetopicApi } from '../../api/endpoints'; // Import your API functions
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SearchContext } from '../../AllSearch/SearchContext';
import '../../Styles/global.css';
import Add from '../../assets/Images/add.png';
import ErrorModal from '../auth/ErrorModal';
const TopicManagement = () => {
  const [topics, setTopics] = useState([]);
  const [newTopic, setNewTopic] = useState({ topic: '', sub_topic: '' });
  const [updateTopic, setUpdateTopic] = useState({ topic: '', sub_topic: '' });
  const [updateTopicId, setUpdateTopicId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);
  const [showError, setShowError] = useState(false);
  const handleCloseError = () => {
    setShowError(false);
};
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch topics
  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const topicsData = await gettopicApi();
        setTopics(topicsData);
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchTopics();
  }, []);

  const handleAddTopic = async () => {
    try {
      const response = await addtopicApi(newTopic);
      setTopics([...topics, response]);
     // alert("Data Added Successfully")
     setErrorMessage('Data Added Successfully');
     setShowError(true);
      setNewTopic({ topic: '', sub_topic: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add topic. Please try again.');
    }
  };

  const handleDeleteTopic = async (topicId) => {
    try {
      await deletetopicApi(topicId);
      setTopics(topics.filter((topic) => topic.id !== topicId));
      setErrorMessage('Data Deleted Successfully');
      setShowError(true);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete topic. Please try again.');
    }
  };

  const handleUpdateTopic = async () => {
    try {
      const response = await updatetopicApi(updateTopicId, updateTopic);
      setTopics(topics.map((topic) => (topic.id === updateTopicId ? response : topic)));
      //alert("Data Updated Successfully")
      setErrorMessage('Data Updated Successfully');
      setShowError(true);

      setUpdateTopic({ topic: '', sub_topic: '' });
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update topic. Please try again.');
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentTopics = topics.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(topics.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
      <img src={Add} className='nextarrow' alt="Add Skill" style={{ marginRight: "2px" }}/> <strong>Add</strong>
      </button>
      <p></p>
      {showAddForm && (
        <div className="popup-container">
          <input
            type="text"
            autocomplete="off"
            value={newTopic.topic}
            onChange={(e) => setNewTopic({ ...newTopic, topic: e.target.value })}
            placeholder="Enter topic"
            className='input-ques'
          />
          <p></p>
          <input
            type="text"
            autocomplete="off"
            value={newTopic.sub_topic}
            onChange={(e) => setNewTopic({ ...newTopic, sub_topic: e.target.value })}
            placeholder="Enter sub-topic"
            className='input-ques'
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save-master'  onClick={handleAddTopic}>Save</button>
            <button className='cancel-master'  onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <input
            type="text"
            autocomplete="off"
            value={updateTopic.topic}
            onChange={(e) => setUpdateTopic({ ...updateTopic, topic: e.target.value })}
            placeholder="Enter updated topic"
            className='input-ques'
          />
          <p></p>
          <input
            type="text"
            autocomplete="off"
            value={updateTopic.sub_topic}
            onChange={(e) => setUpdateTopic({ ...updateTopic, sub_topic: e.target.value })}
            placeholder="Enter updated sub-topic"
            className='input-ques'
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "100px" }} onClick={handleUpdateTopic}>Update</button>
            <button className='cancel' style={{ width: "100px" }} onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {/*errorMessage && <p className="error-message">{errorMessage}</p>*/}
      <div>
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>Topic</th>
              <th>Sub-topic</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentTopics
              .filter(content => !searchQuery ||
                (content.topic && content.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (content.sub_topic && content.sub_topic.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((topic) => (
                <tr key={topic.id}>
                  <td>{topic.topic}</td>
                  <td>{topic.sub_topic}</td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateTopicId(topic.id);
                      setUpdateTopic({ topic: topic.topic, sub_topic: topic.sub_topic });
                    }}>✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" onClick={() => handleDeleteTopic(topic.id)}style={{ color: "orange" }} >🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table><p></p><p></p>
        <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
          <Form.Label className='display' >Display:</Form.Label>
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

export default TopicManagement;
