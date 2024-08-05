import React, { useState, useEffect, useContext } from 'react';
import { getTestcandidateReportsApi } from '../../api/endpoints';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import '../../Styles/global.css';
import { Table, Form, Pagination } from 'react-bootstrap';
import Download from '../../assets/Images/download.png';
import Footer from '../../Footer/Footer';
import { SearchContext } from '../../AllSearch/SearchContext';
const TestReports = () => {
  const [testCandidates, setTestCandidates] = useState([]);
  const [search, setSearch] = useState('');
  const { searchQuery } = useContext(SearchContext);
  const [filters, setFilters] = useState({
    registration_number: '',
    test_name: '',
    student_name: '',
    email_id: '',
    mobile_number: '',
    gender: '',
    year: '',
    department_id: '', // Change to department_id for consistency
    college: '',
    total_score: '',
    dtm_start: '', // New filter for dtm_start
    dtm_end: '',   // New filter for dtm_end
    avg_mark: '',
  });

  const { test_name } = useParams();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
  };

  useEffect(() => {
    getTestCandidates();
  }, [test_name]); // Run once on component mount

  const getTestCandidates = () => {
    getTestcandidateReportsApi()
      .then(data => {
        setTestCandidates(data);
      })
      .catch(error => console.error('Error fetching test candidates:', error));
  };

  const handleFilterChange = (event, key) => {
    const value = event.target.value;
    setFilters({
      ...filters,
      [key]: value
    });
  };

  const filterCandidates_OLD = () => {
    return testCandidates.filter(candidate => {
      for (let key in filters) {
        if (filters[key] !== '') {
          if (key === 'total_score') {
            if (filters.total_score === 'AA') {
              if (!candidate.is_active) {
                return true;
              }
            } else {
              const [min, max] = filters[key].split('-').map(Number);
              if (candidate.total_score < min || candidate.total_score > max) {
                return false;
              }
            }
          }
          else if (key === 'dtm_start') {
            if (filters.dtm_start && candidate.dtm_start < filters.dtm_start) {
              return false;
            }
          } else if (key === 'dtm_end') {
            if (filters.dtm_end && candidate.dtm_end > filters.dtm_end) {
              return false;
            }
          } else {
            const filterValue = String(filters[key]).toLowerCase();
            const candidateValue = String(candidate[key]).toLowerCase();
            if (candidateValue !== filterValue) {
              return false;
            }
          }
        }
      }
      return candidate.is_active === true || candidate.is_active === false;
    });
  };


  const filterCandidates = () => {
    return testCandidates.filter(candidate => {
      for (let key in filters) {
        if (filters[key] !== '') {
          if (key === 'dtm_start') {
            if (filters.dtm_start && candidate.dtm_start < filters.dtm_start) {
              return false;
            }
          } else if (key === 'dtm_end') {
            if (filters.dtm_end && candidate.dtm_end > filters.dtm_end) {
              return false;
            }
          } else if (key === 'total_score') {
            if (filters.total_score && !filterByTotalScore(candidate.total_score, filters.total_score)) {
              return false;
            }
          } else {
            const filterValue = String(filters[key]).toLowerCase();
            const candidateValue = String(candidate[key]).toLowerCase();
            if (candidateValue !== filterValue) {
              return false;
            }
          }
        }
      }
      return candidate.is_active === true || candidate.is_active === false;
    });
  };

  const filterByTotalScore = (score, filterValue) => {
    if (filterValue === 'AA') {
      console.log(`Comparing ${score} with 'AA'`);
      return score === 'AA';
    }
    if (filterValue.startsWith('range:')) {
      const [min, max] = filterValue.replace('range:', '').split('-').map(Number);
      const scoreValue = parseFloat(score);
      console.log(`Range check: ${min} <= ${scoreValue} <= ${max}`);
      return !isNaN(scoreValue) && scoreValue >= min && scoreValue <= max;
    }
    return false;
  };

  const generateTotalScoreOptions = () => {
    return [
      'All',
      'AA',
      '0-10', '10-20', '20-30', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100',
      '0-50', '0-60', '0-70', '0-80', '0-90', '0-100'
    ].map(option => (
      <option key={option} value={option === 'All' ? '' : (option === 'AA' ? 'AA' : `range:${option}`)}>
        {option}
      </option>
    ));
  };



  const generateTotalScoreOptions_OLD = () => {
    const ranges = ['0-10', '10-20', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100', '0-50', '0-60', '0-70', '0-80', '0-90', '0-100'];
    return ['AA', ...ranges].map((value, index) => (
      <option key={index} value={value}>{value}</option>
    ));
  };

  const generateDropdownOptions = (key) => {
    const uniqueValues = [...new Set(testCandidates.map(candidate => candidate[key]))];
    const filteredOptions = uniqueValues.filter(option => option); // Filter out empty options
    return filteredOptions.map((value, index) => (
      <option key={index} value={value}>{value}</option>
    ));
  };

  const exportToExcel = () => {
    const filteredData = filterCandidates().map(({ id, test_id, test_type, skill_type_id, student_id, question_id, question_name, is_actual_test, is_active, need_candidate_info, instruction, attempt_count, rules, topic, duration, user_name, ...rest }) => rest); // Exclude id field
    const headerMap = {
      registration_number: 'Login ID',
      student_name: 'Candidate',
      email_id: 'Email',
      mobile_number: 'Contact No',
      gender: 'Gender',
      year: 'Year',
      department: 'Department',
      dtm_start: 'Start Date',
      dtm_end: 'End Date',
      total_score: 'Total Score',
      avg_mark: 'Avg Mark'
    };

    const wsData = filteredData.map(candidate => {
      const modifiedCandidate = {};
      for (let key in candidate) {
        if (headerMap[key]) {
          modifiedCandidate[headerMap[key]] = candidate[key];
        } else {
          modifiedCandidate[key] = candidate[key];
        }
      }
      return modifiedCandidate;
    });

    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Test Report");
    XLSX.writeFile(wb, "test_report.xlsx");
  };

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(filterCandidates().length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filterCandidates().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const getPaginationItems_OLD = () => {
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
      <div className="product-table-container">
        <h4>Test Result</h4>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button className="button-ques-save" style={{ width: "100px" }} onClick={exportToExcel}><img src={Download} alt="Download" className='nextarrow' /><span>Export</span></button>
          <input
            className="search-box1"
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className='table-responsive'>
          <table className="product-table">
            <thead className="table-thead">
              <tr>
                <th>Test Name <br />
                  <select value={filters.test_name} onChange={(e) => handleFilterChange(e, 'test_name')} style={{ backgroundColor: 'white', borderRadius: '5px', width: "200px", textAlign: "left" }}>
                    <option value="">All</option>
                    {generateDropdownOptions('test_name')}
                  </select>
                </th>
                <th>Candidate <br />
                  <select value={filters.student_name} onChange={(e) => handleFilterChange(e, 'student_name')} style={{ backgroundColor: 'white', borderRadius: '5px', width: "160px" }}>
                    <option value="">All</option>
                    {generateDropdownOptions('student_name')}
                  </select>
                </th>
                <th>Year <br />
                  <select value={filters.year} onChange={(e) => handleFilterChange(e, 'year')} style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    <option value="">All</option>
                    {generateDropdownOptions('year')}
                  </select>
                </th>
                <th>Department <br />
                  <select value={filters.department_id} onChange={(e) => handleFilterChange(e, 'department_id')} style={{ backgroundColor: 'white', borderRadius: '5px', width: "90px" }}>
                    <option value="">All</option>
                    {generateDropdownOptions('department_id')}
                  </select>
                </th>
                <th>Start Date
                </th>
                <th>End Date
                </th>
                <th>Scores <br />
                  <select value={filters.total_score} onChange={(e) => handleFilterChange(e, 'total_score')} style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                    {generateTotalScoreOptions()}
                  </select>
                </th>
              </tr>
            </thead>
            <tbody className="table-tbody">
              {currentData
                .filter(item =>
                  !searchQuery ||
                  (item.test_name && item.test_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (item.student_name && typeof item.student_name === 'string' && item.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (item.year && typeof item.year === 'string' && item.year.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (item.department_id && typeof item.department_id === 'string' && item.department_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (item.total_score && typeof item.total_score === 'string' && item.total_score.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (item.dtm_start && typeof item.dtm_start === 'string' && item.dtm_start.toLowerCase().includes(searchQuery.toLowerCase())) ||
                  (item.dtm_end && typeof item.dtm_end === 'string' && item.dtm_end.toLowerCase().includes(searchQuery.toLowerCase()))
                )
                .filter(item =>
                  !search ||
                  (item.test_name && item.test_name.toLowerCase().includes(search.toLowerCase())) ||
                  (item.student_name && typeof item.student_name === 'string' && item.student_name.toLowerCase().includes(search.toLowerCase())) ||
                  (item.year && typeof item.year === 'string' && item.year.toLowerCase().includes(search.toLowerCase())) ||
                  (item.department_id && typeof item.department_id === 'string' && item.department_id.toLowerCase().includes(search.toLowerCase())) ||
                  (item.total_score && typeof item.total_score === 'string' && item.total_score.toLowerCase().includes(search.toLowerCase())) ||
                  (item.dtm_start && typeof item.dtm_start === 'string' && item.dtm_start.toLowerCase().includes(search.toLowerCase())) ||
                  (item.dtm_end && typeof item.dtm_end === 'string' && item.dtm_end.toLowerCase().includes(search.toLowerCase()))
                )
                .map(candidate => (
                  <tr key={candidate.id} >
                    <td style={{ textAlign: "left" }}>{candidate.test_name}</td>
                    <td style={{ textAlign: "left" }}>{candidate.student_name}</td>
                    <td style={{ textAlign: "left" }}>{candidate.year}</td>
                    <td style={{ textAlign: "left" }}>{candidate.department_id}</td>
                    <td style={{ textAlign: "left", width: "120px" }}>{candidate.dtm_start}</td>
                    <td style={{ textAlign: "left", width: "120px" }}>{candidate.dtm_end}</td>
                    <td style={{ textAlign: "left" }}>
                      {candidate.total_score}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table><p></p><p></p>
        </div>
        <div className='dis-page'>
          <Form>
            <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
              <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
              <Form.Control style={{ width: "50px", boxShadow: 'none', outline: 'none' }}
                as="select"
                className='label-dis'
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={15}>15</option>
              </Form.Control>
            </Form.Group>
          </Form>
          <Pagination className="pagination-custom">
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
            {getPaginationItems()}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
          </Pagination>
        </div>
      </div>

    </div>
  );
};

export default TestReports;
