import React, { useState, useEffect } from 'react';
import { getTestcandidateReportsApi } from '../../api/endpoints';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import '../../Styles/global.css';
import { Table, Form, Pagination } from 'react-bootstrap';
import Download from '../../assets/Images/download.png';
import Footer from '../../Footer/Footer';
const TestReports = () => {
  const [testCandidates, setTestCandidates] = useState([]);
  const [search, setSearch] = useState('');

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
    is_active: true,
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

  const filterCandidates = () => {
    return testCandidates.filter(candidate => {
      for (let key in filters) {
        if (filters[key] !== '') {
          if (key === 'total_score') {
            const [min, max] = filters[key].split('-').map(Number);
            if (candidate.total_score < min || candidate.total_score > max) {
              return false;
            }
          } else if (key === 'dtm_start') {
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
      return candidate.is_active === true;
    });
  };

  const generateTotalScoreOptions = () => {
    const ranges = ['0-10', '10-20', '30-40', '40-50', '50-60', '60-70', '70-80', '80-90', '90-100', '0-50', '0-60', '0-70', '0-80', '0-90', '0-100'];
    return ranges.map((value, index) => (
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
              <th>Test Name
                <select value={filters.test_name} onChange={(e) => handleFilterChange(e, 'test_name')} style={{ backgroundColor: 'white', borderRadius: '5px', width: "200px", textAlign: "left" }}>
                  <option value="">All</option>
                  {generateDropdownOptions('test_name')}
                </select>
              </th>
              <th>Candidate
                <select value={filters.student_name} onChange={(e) => handleFilterChange(e, 'student_name')} style={{ backgroundColor: 'white', borderRadius: '5px', width: "160px" }}>
                  <option value="">All</option>
                  {generateDropdownOptions('student_name')}
                </select>
              </th>
              <th>Year
                <select value={filters.year} onChange={(e) => handleFilterChange(e, 'year')} style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                  <option value="">All</option>
                  {generateDropdownOptions('year')}
                </select>
              </th>
              <th>Department
                <select value={filters.department_id} onChange={(e) => handleFilterChange(e, 'department_id')} style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                  <option value="">All</option>
                  {generateDropdownOptions('department_id')}
                </select>
              </th>
              <th>Start Date
               {/*} <input type="date" value={filters.dtm_start} onChange={(e) => handleFilterChange(e, 'dtm_start')} style={{ backgroundColor: 'white', borderRadius: '5px' }} />*/}
              </th>
              <th>End Date
              {/*}  <input type="date" value={filters.dtm_end} onChange={(e) => handleFilterChange(e, 'dtm_end')} style={{ backgroundColor: 'white', borderRadius: '5px' }} />*/}
              </th>
              <th>Scores
                <select value={filters.total_score} onChange={(e) => handleFilterChange(e, 'total_score')} style={{ backgroundColor: 'white', borderRadius: '5px' }}>
                  <option value="">All</option>
                  {generateTotalScoreOptions()}
                </select>
              </th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentData.map(candidate => (
              <tr key={candidate.id} className={candidate.is_active === 'yes' ? 'active-row' : ''}>
                <td style={{textAlign: "left"}}>{candidate.test_name}</td>
                <td style={{textAlign: "left"}}>{candidate.student_name}</td>
                <td style={{textAlign: "center"}}>{candidate.year}</td>
                <td style={{textAlign: "center"}}>{candidate.department_id}</td>
                <td style={{textAlign: "left"}}>{formatDate(candidate.dtm_start)}</td>
                <td style={{textAlign: "left"}}>{formatDate(candidate.dtm_end)}</td>
                <td style={{textAlign: "center"}}>{candidate.total_score}</td>
              </tr>
            ))}
          </tbody>
        </table><p></p>
      </div>
      <div className="pagination-container" >
        <Pagination>
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} />
          {Array.from({ length: totalPages }, (_, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => handlePageChange(index + 1)}>
              {index + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} />
        </Pagination>
      </div>
    </div><p style={{height:"50px"}}></p>
       {/*  <Footer></Footer>*/}
        </div>
   
  );
};

export default TestReports;
