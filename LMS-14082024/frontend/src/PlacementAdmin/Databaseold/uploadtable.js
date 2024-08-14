import React, { useContext, useState, useEffect } from 'react';
import { SearchContext } from '../../AllSearch/SearchContext';
import { Table, Form, Pagination } from 'react-bootstrap';
import '../../Styles/global.css';
import { getEligibleStudentCountApi,geteligiblestudentsApi,update_Announcement_API_NEW,geteligiblestudentsroundApi } from '../../api/endpoints';
import { Link } from 'react-router-dom';
import { FaWhatsapp } from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUpload, faDownload, faBullhorn,faEnvelope } from '@fortawesome/free-solid-svg-icons';
import {Modal, Button } from 'react-bootstrap';
import ErrorModal from './ErrorModal';
const FilterDropdown = ({ options, selectedValue, onChange }) => {
  return (
    <select
      value={selectedValue || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{ backgroundColor: 'darkgray', borderRadius: '5px', display: 'flex', width: '120px' }}
    >
      <option value="">All</option>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
};

const Uploadstudentdata = () => {
  const { searchQuery } = useContext(SearchContext);
  const [filters, setFilters] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [updateannounce_Logo, setupdateannounce_Logo] = useState('');
  const [updateannounceId, setupdateannounceId] = useState(null);
  const [updateannounce, setupdateannounce] = useState('');
 
  
  const [roundSelections, setRoundSelections] = useState({});
  const [students, setstudents] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const handleFileChangeLogo = (e) => {
    setupdateannounce_Logo(e.target.files[0]);
  };
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [colleges, setstudent] = useState([]);

  const handleRoundSelectionChange = (id, value) => {
    setRoundSelections((prevSelections) => ({ ...prevSelections, [id]: value }));
  };

  const roundOptions = ['registered','interview_date', 'preplacement talk', 'round1', 'round2', 'offer', ];
  const fetchstudentslist = async () => {
    try {
      const collegesData = await geteligiblestudentsApi();
      setstudent(collegesData);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  useEffect(() => {
    fetchTraineeData();
  }, [students]);

  const fetchTraineeData = () => {
    getEligibleStudentCountApi()
      .then(data => {
        setstudents(data);
        console.log('students: ', data);
      })
      .catch(error => {
        console.error('Error fetching trainee data:', error);
      });
  };

  // Define filter options for each column
  const filterOptions = {
    job_id__company_name: [...new Set(students.map((student) => student.job_id__company_name))],
   };
  const handleAnnouncementClick = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentAnnouncement('');
  };
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const handleCloseError = () => {
    setShowError(false);
  };

  const handleSubmitAnnouncement = async (event) => {
    event.preventDefault();
    try {

      const formData = new FormData();
      formData.append('college', updateannounce);
      if (updateannounce_Logo) {
        console.log('updateannounce_Logo: ', updateannounce_Logo)
        formData.append('college_logo', updateannounce_Logo);
      }

      const dataToUpdate = {
        college: updateannounce,
        college_logo: updateannounce_Logo
      }

      console.log('College Form data: ', dataToUpdate);
      const response = await update_Announcement_API_NEW(updateannounceId, dataToUpdate);
      console.log('setstudent in upadte......');
      fetchstudentslist();
      
      setErrorMessage('Data Updated Successfully');
      setShowError(true);

      setupdateannounce('');
      //setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update college. Please try again.');
    }
    handleCloseModal();
  };
 
  useEffect(() => {
    setFilteredStudents(filterCandidates());
  }, [filters, students]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    setCurrentPage(1); // Reset page to 1 when filters change
  };

  // Function to filter data based on all active filters
  const filterCandidates = () => {
    return students.filter((item) => {
      return Object.entries(filters).every(([key, value]) =>
        !value || (item[key] && item[key].toString().toLowerCase().includes(value.toLowerCase()))
      );
    });
  };

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filteredStudents.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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
    <div className="product-table-container">
      <div className="test-access-table-wrapper">
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th style={{ textAlign: "center" }}>
               Company Name
                <FilterDropdown 
                  options={filterOptions.job_id__company_name}
                  selectedValue={filters.job_id__company_name}
                  onChange={(value) => handleFilterChange('job_id__company_name', value)}
                />
              </th>
              <th style={{ textAlign: "center" }}>Eligible Students</th>
              <th style={{ textAlign: "center" }}>Round of Interview</th>
              <th style={{ textAlign: "center" }}>ShortListed</th>
              <th>Upload</th>
              <th>
                Download
              </th>
              <th>Announcement</th>
              <th>Whatsapp</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentData.map((item) => (
              <tr key={item.id} className="test-access-table-row" style={{ padding: '30px',textAlign:"center" }}>
                <td style={{ textAlign: "center" }}>{item.job_id__company_name}</td>
{/*<td>{item.student_count}</td>*/}
<td style={{ textAlign: "center" }}>
                                        <Link to={`/eligible-student/${item.job_id__id}`} style={{ color: "white" }}>
                                            {item.student_count}
                                        </Link>
                                    </td>           
                <td style={{ textAlign: "center" }}>
                <Form.Control
                    as="select"
                    value={roundSelections[item.id] || ''}
                   
                    onChange={(e) => handleRoundSelectionChange(item.id, e.target.value)}
                  >
                    <option value="">Select Round</option>
                    {roundOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </Form.Control>
                </td>
                <td style={{ textAlign: "center" }}></td>
                <td style={{ textAlign: "center" }}><FontAwesomeIcon style={{fontSize:"24px"}} icon={faUpload} /></td>
                <td style={{ textAlign: "center" }}><FontAwesomeIcon style={{fontSize:"24px"}}icon={faDownload} /></td>
         
                <td style={{ textAlign: "center" }} onClick={() => handleAnnouncementClick(item)}><FontAwesomeIcon style={{ fontSize: "24px" }} icon={faBullhorn} /></td>
               <td style={{ textAlign: "center" }}><FaWhatsapp style={{fontSize:"24px"}}></FaWhatsapp></td>
               <td style={{ textAlign: "center" }}>
          <FontAwesomeIcon style={{ fontSize: "24px" }} icon={faEnvelope} />
        </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p></p>
        <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
         
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAnnouncement">
              <Form.Label>Announcement</Form.Label>
              {/*<Form.Control
                type="text"
                placeholder="Enter announcement text"
                value={currentAnnouncement}
                onChange={(e) => setCurrentAnnouncement(e.target.value)}
              />*/}
                <input
              autoComplete="off"
              type="text"
              value={updateannounce}
              className='input-ques-clg'
              onChange={(e) => setupdateannounce(e.target.value)}
              placeholder="Enter updated college name"
            />
            <p></p>
            <div className="file-input-group-clg1">
              <label htmlFor="announceimg" className="input-button-ques-mcq-clg">Choose Image</label>
              <input
                type="file"
                id="announceimg"
                name="announceimg"
                onChange={handleFileChangeLogo}
                className="input-file-ques-mcq-clg"
              />
              {updateannounce_Logo && typeof updateannounce_Logo === 'string' && (
                <img src={`data:image/jpeg;base64,${updateannounce_Logo}`} alt="Current logo" style={{ maxWidth: '100px', maxHeight: '100px' }} />
              )}
              {updateannounce_Logo && typeof updateannounce_Logo !== 'string' && (
                <span className="file-name-clg">{updateannounce_Logo.name}</span>
              )}
            </div>

            </Form.Group><p></p>
            <button className='button-ques-save' onClick={handleSubmitAnnouncement}>
              Submit
            </button>
          </Form>
        </Modal.Body>
      </Modal>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form>
          <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
            <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
            <Form.Control as="select" value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <Pagination className="pagination-custom" style={{ marginTop: "-2px" }}>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {getPaginationItems()}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
      <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

    </div>
  );
};

export default Uploadstudentdata;
