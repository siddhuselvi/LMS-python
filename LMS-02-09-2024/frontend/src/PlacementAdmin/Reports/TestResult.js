import React, { useState, useEffect,useContext } from 'react';
import { getReports_College_UserName_API } from '../../api/endpoints';
import * as XLSX from 'xlsx';
import { useParams } from 'react-router-dom';
import '../../Styles/global.css';
import { Form, Pagination } from 'react-bootstrap';
import Download from '../../assets/Images/download.png';
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

  

  const exportToExcel = () => {
    const filteredData = filterCandidates().map(({ id, test_id, test_type, skill_type_id, student_id, question_id, question_name, is_actual_test, is_active, need_candidate_info, instruction, attempt_count, rules, topic, duration, ...rest }) => rest); // Exclude id field
    const headerMap = {
      user_name: 'Login ID',
      registration_number: 'Reg_No',
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

  {/*}
  const totalPages = Math.ceil(filterCandidates().length / itemsPerPage);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentData = filterCandidates().slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
*/}

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = filterCandidates().slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filterCandidates().length / itemsPerPage);
  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

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
            <th style={{ textAlign: "center" }}>Login ID</th>
          
            <th style={{ textAlign: "center" }}>Candidate </th>
            <th style={{ textAlign: "center" }}>Department <br></br>
              <select value={filters.department_id} onChange={(e) => handleFilterChange(e, 'department_id')} style={{ backgroundColor: 'white', borderRadius: '5px',width:"90px" ,textAlign:"center"}} >
                  <option value="">All</option>
                  {generateDropdownOptions('department_id')}
                </select></th>
            <th style={{ textAlign: "center" }}>Gender <br></br>
              <select value={filters.gender} onChange={(e) => handleFilterChange(e, 'gender')} style={{ backgroundColor: 'white', borderRadius: '5px',width:"70px",textAlign:"center" }} >
              <option value="">All</option>
              {generateDropdownOptions('gender')}
            </select></th>

            <th style={{ textAlign: "center" }}>Start Date</th>
            <th style={{ textAlign: "center" }}>End Date</th>


            <th style={{textAlign:"center"}}>Total Score <br></br>
              <select value={filters.total_score} onChange={(e) => handleFilterChange(e, 'total_score')} style={{ backgroundColor: 'white', borderRadius: '5px',width:"90px",textAlign:"center" }} >
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
              <td style={{ textAlign: "center" }}>{candidate.user_name}</td>
              
              <td style={{ textAlign: "center" }}>{candidate.student_name}</td>
              <td  style={{ textAlign: "center" }}>{candidate.department_id}</td>
              <td style={{ textAlign: "center" }}>{candidate.gender}</td>
              <td style={{ textAlign: "center" }}>{candidate.dtm_start}</td>
                  <td style={{ textAlign: "center" }}>{candidate.dtm_end}</td>

              <td style={{textAlign:"center"}}>{candidate.total_score}</td>
            </tr>
          ))}
        </tbody>
      </table><p></p>
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
            <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
            {getPaginationItems()}
            <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
          </Pagination>
        </div>
    </div><p style={{height:"50px"}}></p>
       {/*  <Footer></Footer>*/}
        </div>
   
  );
};

export default TestResult;
