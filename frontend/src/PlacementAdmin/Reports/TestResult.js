import React, { useState, useEffect,useContext } from 'react';
import { getTestcandidateReportsApi, getReports_College_UserName_API } from '../../api/endpoints';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import '../../Styles/global.css';
import { Table, Form, Pagination } from 'react-bootstrap';
import Download from '../../assets/Images/download.png'
import Footer from '../../Footer/Footer';
import { SearchContext } from '../../AllSearch/SearchContext';

const TestResult = ({ collegeName, username, institute }) => {
  const [testCandidates, setTestCandidates] = useState([]);
  const [search, setSearch] = useState('');

  const { searchQuery } = useContext(SearchContext);
  const [filters, setFilters] = useState({
    registration_number: '',
    student_name: '',
    email_id: '',
    mobile_number: '',
    gender: '',
    year: '',
    department_id: '',
    college: '',
    total_score: '',
    test_name: '',
    dtm_start: '', // New filter for dtm_start
    dtm_end: '',    // New filter for dtm_end
    is_active: true,
    avg_mark: '',
  });
  const { test_name } = useParams();
  console.log("print test", test_name)
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
    getReports_College_UserName_API(institute, test_name)
      .then(data => {
        setTestCandidates(data);
        console.log('setTestCandidates: ', data);
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
          } else {
            const filterValue = String(filters[key]).toLowerCase(); // Convert filter value to lowercase string
            const candidateValue = String(candidate[key]).toLowerCase(); // Convert candidate value to lowercase string
            if (candidateValue !== filterValue) {
              return false;
            }
          }
        }
      }
      // Check if the is_active property is true
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
    return uniqueValues.map((value, index) => (
      <option key={index} value={value}>{value}</option>
    ));
  };

  const generateAvgMarkOptions = () => {
    const ranges = Array.from({ length: 10 }, (_, i) => `${i * 10}-${(i + 1) * 10}`); // ['0-10', '10-20', ..., '90-100']
    return ranges.map((value, index) => (
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
      college: 'College',
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
        <button className="button-ques-save" onClick={exportToExcel} style={{width:"100px"}}><img src={Download}className='nextarrow'></img><span>Export</span></button>
        <input
          className="search-box1"
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table className="product-table" >
        <thead className="table-thead">
          <tr>
            <th>Login ID</th>
            <th>Candidate </th>
            <th>Department <br></br>
              <select value={filters.department_id} onChange={(e) => handleFilterChange(e, 'department_id')} style={{ backgroundColor: 'darkgray', borderRadius: '5px',width:"90px" }} >
                  <option value="">All</option>
                  {generateDropdownOptions('department_id')}
                </select></th>
            <th>Gender <br></br>
              <select value={filters.gender} onChange={(e) => handleFilterChange(e, 'gender')} style={{ backgroundColor: 'darkgray', borderRadius: '5px',width:"70px" }} >
              <option value="">All</option>
              {generateDropdownOptions('gender')}
            </select></th>

            <th>Start Date</th>
            <th>End Date</th>


            <th>Total Score <br></br>
              <select value={filters.total_score} onChange={(e) => handleFilterChange(e, 'total_score')} style={{ backgroundColor: 'darkgray', borderRadius: '5px',width:"90px" }} >
              <option value="">All</option>
              {generateTotalScoreOptions()}
            </select></th>
          </tr>
        </thead>
        <tbody className="table-tbody">
        {currentData
              .filter(item =>
                !searchQuery ||
                (item.user_name && item.user_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.student_name && typeof item.student_name === 'string' && item.student_name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.gender && typeof item.gender === 'string' && item.gender.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.department_id && typeof item.department_id === 'string' && item.department_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.total_score && typeof item.total_score === 'string' && item.total_score.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.dtm_start && typeof item.dtm_start === 'string' && item.dtm_start.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (item.dtm_end && typeof item.dtm_end === 'string' && item.dtm_end.toLowerCase().includes(searchQuery.toLowerCase()))
              )
              .filter(item =>
                !search ||
                (item.user_name && item.user_name.toLowerCase().includes(search.toLowerCase())) ||
                (item.student_name && typeof item.student_name === 'string' && item.student_name.toLowerCase().includes(search.toLowerCase())) ||
                (item.gender && typeof item.gender === 'string' && item.gender.toLowerCase().includes(search.toLowerCase())) ||
                (item.department_id && typeof item.department_id === 'string' && item.department_id.toLowerCase().includes(search.toLowerCase())) ||
                (item.total_score && typeof item.total_score === 'string' && item.total_score.toLowerCase().includes(search.toLowerCase())) ||
                (item.dtm_start && typeof item.dtm_start === 'string' && item.dtm_start.toLowerCase().includes(search.toLowerCase())) ||
                (item.dtm_end && typeof item.dtm_end === 'string' && item.dtm_end.toLowerCase().includes(search.toLowerCase()))
              )
              .map(candidate=> (
            <tr key={candidate.id} className={candidate.is_active ? 'active-row' : ''}>
              <td>{candidate.user_name}</td>
              <td>{candidate.student_name}</td>
              <td>{candidate.department_id}</td>
              <td>{candidate.gender}</td>
              <td>{candidate.dtm_start}</td>
                  <td>{candidate.dtm_end}</td>

              <td style={{textAlign:"center"}}>{candidate.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table><p></p>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Form>
          <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
            <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
            <Form.Control style={{width:"50px",boxShadow: 'none', outline: 'none'}}
              as="select"
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={15}>15</option>
            </Form.Control>
          </Form.Group>
        </Form>
        <Pagination className="pagination-custom" style={{marginTop:"-1px" ,boxShadow: 'none', outline: 'none'}}>
          <Pagination.Prev
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          />
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            const isFirstFive = page <= 3;
            const isLastFive = page > totalPages - 3;
            const isInRange = page >= currentPage - 2 && page <= currentPage + 2;

            if (isFirstFive || isInRange || isLastFive) {
              return (
                <Pagination.Item
                  key={page}
                  active={page === currentPage}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Pagination.Item>
              );
            } else if ((page === 6 && totalPages > 10) || (page === totalPages - 1)) {
              return <Pagination.Ellipsis key="ellipsis" />;
            }

            return null;
          })}
          <Pagination.Next
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          />
        </Pagination>
      </div>
    </div><p style={{height:"50px"}}></p>
       {/*  <Footer></Footer>*/}
        </div>
   
  );
};

export default TestResult;
