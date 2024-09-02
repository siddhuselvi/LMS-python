import React, { useState, useEffect } from 'react';
import { Form, Pagination, Button } from 'react-bootstrap';
import { getDistinctCompany_API, getEligible_students_ReportAPI, getRoundOfInterviews_API } from '../../api/endpoints';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const PlacementReport = () => {
  const [testCandidates, setTestCandidates] = useState([]);
  const [company_name, setcompany_name] = useState('');
  const [round_of_interview, setround_of_interview] = useState('');
  const [companyList, setCompanyList] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [interviewRounds, setInterviewRounds] = useState([]);

  // Fetch company names and interview rounds on component mount
  useEffect(() => {
    getDistinctCompany_API()
      .then(data => {
        setCompanyList(data);
      })
      .catch(error => {
        console.error('Error fetching company names:', error);
      });

    getRoundOfInterviews_API()
      .then(data => {
        if (Array.isArray(data)) {
          setInterviewRounds(data);
        } else if (data && Array.isArray(data.rounds)) {
          setInterviewRounds(data.rounds);
        } else {
          setInterviewRounds([]);
        }
      })
      .catch(error => {
        console.error('Error fetching interview rounds:', error);
        setInterviewRounds([]);
      });
  }, []);

  // Fetch test candidates when company_name or round_of_interview changes
  useEffect(() => {
    if (company_name && round_of_interview) {
      getTestCandidates();
    }
  }, [company_name, round_of_interview]);

  // Function to fetch test candidates
  const getTestCandidates = () => {
    getEligible_students_ReportAPI(round_of_interview, company_name)
      .then(data => {
        if (data && data.students) {
          setTestCandidates(data.students);
        } else {
          setTestCandidates([]);
        }
      })
      .catch(error => {
        console.error('Error fetching test candidates:', error);
        setTestCandidates([]);
      });
  };

  // Export function to download Excel file
  const exportToExcel = () => {
    const dataToExport = testCandidates.map((item) => ({
      Company:item.job_id__company_name,
      Name: item.students_id__students_name,
      Department: item.students_id__department_id__department,
      Email: item.students_id__email_id,
      Mobile: item.students_id__mobile_number,
      CGPA: item.students_id__cgpa,
      Mark_10th:item.students_id__marks_10th,
      Mark_12th:item.students_id__marks_12th,
      History_of_arrears:item.students_id__history_of_arrears,
      standing_arrears:item.students_id__standing_arrears,
      

    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'TestCandidates');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const fileName = `Eligible_Students_${company_name}_${round_of_interview}.xlsx`;

    const data = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, fileName);
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentData = testCandidates.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(testCandidates.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
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
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <Form.Control
            as="select"
            value={company_name}
            onChange={(e) => setcompany_name(e.target.value)}
            style={{ marginRight: '10px', width: '200px' }}
          >
            <option value="">Select Company</option>
            {companyList.map((company, index) => (
              <option key={index} value={company.company_name}>
                {company.company_name}
              </option>
            ))}
          </Form.Control>

          <Form.Control
            as="select"
            value={round_of_interview}
            onChange={(e) => setround_of_interview(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">Select Round of Interview</option>
            {interviewRounds.length > 0 ? (
              interviewRounds.map((round, index) => (
                <option key={index} value={round.round || round}>
                  {round.round || round}
                </option>
              ))
            ) : (
              <option value="" disabled>No interview rounds available</option>
            )}
          </Form.Control>

          <button
           className='button-ques-save'
            onClick={exportToExcel}
            disabled={testCandidates.length === 0}
            style={{ marginLeft: '10px' }}
          >
            Export 
          </button>
        </div>

        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th style={{ textAlign: "center" }}>Name</th>
              <th style={{ textAlign: "center" }}>Department</th>
              <th style={{ textAlign: "center" }}>Email ID</th>
              <th style={{ textAlign: "center" }}>Mobile No</th>
              <th style={{ textAlign: "center" }}>CGPA</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {testCandidates.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No data available</td>
              </tr>
            ) : (
              currentData.map((item, index) => (
                <tr key={index} className="table-row">
                  <td style={{ textAlign: "center" }}>{item.students_id__students_name}</td>
                  <td style={{ textAlign: "center" }}>{item.students_id__department_id__department}</td>
                  <td style={{ textAlign: "center" }}>{item.students_id__email_id}</td>
                  <td style={{ textAlign: "center" }}>{item.students_id__mobile_number}</td>
                  <td style={{ textAlign: "center" }}>{item.students_id__cgpa}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="dis-page">
          <Form>
            <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
              <Form.Label style={{ marginRight: '10px' }}>Display:</Form.Label>
              <Form.Control
                as="select"
                value={itemsPerPage}
                className='label-dis'
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                style={{ width: '50px', boxShadow: 'none', outline: 'none', height: '50px' }}
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
      </div>
    </div>
  );
};

export default PlacementReport;
