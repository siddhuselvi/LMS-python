import React, { useContext, useState, useEffect } from 'react';
import { SearchContext } from '../../AllSearch/SearchContext';
import { Table, Form, Pagination } from 'react-bootstrap';
import '../../Styles/global.css';
import { getNonDbCandidates_API, getdbCandidates_API } from '../../api/endpoints';

const FilterDropdown = ({ options, selectedValue, onChange, className }) => {
  return (
    <select
      value={selectedValue || ''}
      onChange={(e) => onChange(e.target.value)}
      className={`filter-dropdown ${className}`}
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
  const [dbcandidates, setDbCandidates] = useState([]);
  const [nonDbcandidates, setNonDbCandidates] = useState([]);
  const [selectedCandidateType, setSelectedCandidateType] = useState('Db Candidates');

  useEffect(() => {
    fetchDbCandidates();
    fetchNonDbCandidates();
  }, []);

  useEffect(() => {
    setFilteredStudents(filterCandidates());
  }, [filters, dbcandidates, nonDbcandidates, selectedCandidateType]);

  const fetchDbCandidates = () => {
    getdbCandidates_API()
      .then(data => {
        setDbCandidates(data);
        console.log('setDbCandidates: ', data);
      })
      .catch(error => {
        console.error('Error fetching dbCandidates data:', error);
      });
  };

  const fetchNonDbCandidates = () => {
    getNonDbCandidates_API()
      .then(data => {
        setNonDbCandidates(data);
        console.log('setNonDbCandidates: ', data);
      })
      .catch(error => {
        console.error('Error fetching nonDbCandidates data:', error);
      });
  };

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({ ...prevFilters, [key]: value }));
    setCurrentPage(1); // Reset page to 1 when filters change
  };

  const handleCandidateTypeChange = (value) => {
    setSelectedCandidateType(value);
    setFilters({});
    setCurrentPage(1);
  };

  const filterCandidates = () => {
    const candidates = selectedCandidateType === 'Db Candidates' ? dbcandidates : nonDbcandidates;
    return candidates.filter((item) => {
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

  const filterOptions = {
    college_id__college: [...new Set((selectedCandidateType === 'Db Candidates' ? dbcandidates : nonDbcandidates).map((candidate) => candidate.college_id__college))],
    department_id__department: [...new Set((selectedCandidateType === 'Db Candidates' ? dbcandidates : nonDbcandidates).map((candidate) => candidate.department_id__department))],
  };



  const formatDate1 = (dateString) => {
    if (!dateString) {
      return null; // Return null if dateString is null or undefined
    }
    
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    let hours = date.getUTCHours();
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strHours = hours.toString().padStart(2, '0');
    
    return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
  };

  return (
    <div className="product-table-container">
      <div className="candidate-type-dropdown">
        <select className="sp-candidates"
          value={selectedCandidateType}
          onChange={(e) => handleCandidateTypeChange(e.target.value)}
        >
          <option value="Db Candidates">Db Candidates</option>
          <option value="Non-Db Candidates">Non-Db Candidates</option>
        </select>
      </div>
      <div className="test-access-table-wrapper">
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              {selectedCandidateType === 'Db Candidates' && (
                <>
                  <th>
                    College Name
                    <FilterDropdown
                      options={filterOptions.college_id__college}
                      selectedValue={filters.college_id__college}
                      onChange={(value) => handleFilterChange('college_id__college', value)}
                      className="dropdown-college"
                    />
                  </th>
                  <th>Login ID</th>
                  <th>Student Name</th>
                  <th>
                    Department
                    <FilterDropdown
                      options={filterOptions.department_id__department}
                      selectedValue={filters.department_id__department}
                      onChange={(value) => handleFilterChange('department_id__department', value)}
                      className="dropdown-department"
                    />
                  </th>
                  <th>Year</th>
                </>
              )}
              {selectedCandidateType === 'Non-Db Candidates' && (
                <>
                  <th>User Name</th>
                  <th>Password</th>
                  <th>Upload Time</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentData.map((item) => (
              <tr key={item.id} className="test-access-table-row" style={{ padding: '30px' }}>
                {selectedCandidateType === 'Db Candidates' && (
                  <>
                    <td>{item.college_id__college}</td>
                    <td>{item.user_name}</td>
                    <td>{item.students_name}</td>
                    <td>{item.department_id__department}</td>
                    <td>{item.year}</td>
                  </>
                )}
                {selectedCandidateType === 'Non-Db Candidates' && (
                  <>
                    <td>{item.user__username}</td>
                    <td>{item.user__password}</td>
                    <td>{formatDate1(item.dtm_upload)}</td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        <p></p>
      </div>
      <div className='dis-page'>
        <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
          <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
          <Form.Control as="select" className='label-dis' style={{ width: "50px", boxShadow: 'none', outline: 'none' }}
            value={itemsPerPage} onChange={(e) => setItemsPerPage(Number(e.target.value))}>
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
  );
};

export default Uploadstudentdata;
