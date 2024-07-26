import React, { useContext, useState, useEffect } from 'react';
import { SearchContext } from '../../AllSearch/SearchContext';
import { Table, Form, Pagination } from 'react-bootstrap';
import '../../Styles/global.css';

const FilterDropdown = ({ options, selectedValue, onChange }) => {
  return (
    <select
      value={selectedValue || ''}
      onChange={(e) => onChange(e.target.value)}
      style={{ backgroundColor: 'darkgray', borderRadius: '5px', display: 'flex', width: '50px' }}
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

const Uploadstudentdata = ({ students }) => {
  const { searchQuery } = useContext(SearchContext);
  const [filters, setFilters] = useState({});
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  // Define filter options for each column
  const filterOptions = {
    college_id__college: [...new Set(students.map((student) => student.college_id__college))],
    students_name: [...new Set(students.map((student) => student.students_name))],
    department_id__department: [...new Set(students.map((student) => student.department_id__department))],
    registration_number: [...new Set(students.map((student) => student.registration_number))],
    gender: [...new Set(students.map((student) => student.gender))],
    email_id: [...new Set(students.map((student) => student.email_id))],
    mobile_number: [...new Set(students.map((student) => student.mobile_number))],
    year: [...new Set(students.map((student) => student.year))],
    cgpa: [...new Set(students.map((student) => student.cgpa))],
    marks_10th: [...new Set(students.map((student) => student.marks_10th))],
    marks_12th: [...new Set(students.map((student) => student.marks_12th))],
    marks_semester_wise: [...new Set(students.map((student) => student.marks_semester_wise))],
    history_of_arrears: [...new Set(students.map((student) => student.history_of_arrears))],
    standing_arrears: [...new Set(students.map((student) => student.standing_arrears))],
    number_of_offers: [...new Set(students.map((student) => student.number_of_offers))],
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
    <div className="product-table-container">
      <div className="test-access-table-wrapper">
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>
                College Name
                <FilterDropdown
                  options={filterOptions.college_id__college}
                  selectedValue={filters.college_id__college}
                  onChange={(value) => handleFilterChange('college_id__college', value)}
                />
              </th>
              <th>Student Name</th>
              <th>Reg No</th>
              <th>Gender</th>
              <th>Mobile No</th>
              <th>
                Department
                <FilterDropdown
                  options={filterOptions.department_id__department}
                  selectedValue={filters.department_id__department}
                  onChange={(value) => handleFilterChange('department_id__department', value)}
                />
              </th>
              <th>Year</th>
              <th>CGPA</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentData.map((item) => (
              <tr key={item.id} className="test-access-table-row" style={{ padding: '30px' }}>
                <td>{item.college_id__college}</td>
                <td>{item.students_name}</td>
                <td>{item.registration_number}</td>
                <td>{item.gender}</td>
                <td>{item.mobile_number}</td>
                <td>{item.department_id__department}</td>
                <td>{item.year}</td>
                <td>{item.cgpa}</td>
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
