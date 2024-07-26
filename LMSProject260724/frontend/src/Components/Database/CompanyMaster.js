import React, { useState, useEffect, useContext } from 'react';
import { Pagination, Form } from 'react-bootstrap';
import { addcompanyApi, getcompanyApi, updatecompanyApi, deleteCompanyApi } from '../../api/endpoints';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { SearchContext } from '../../AllSearch/SearchContext';
import '../../Styles/global.css';
import Add from '../../assets/Images/add.png';

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [newCompany, setNewCompany] = useState({ company_name: '', company_profile: '' });
  const [updateCompany, setUpdateCompany] = useState({ company_name: '', company_profile: '' });
  const [updateCompanyId, setUpdateCompanyId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const { searchQuery } = useContext(SearchContext);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  // Fetch companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const companiesData = await getCompaniesWithPagination(currentPage, itemsPerPage);
        setCompanies(companiesData);
      } catch (error) {
        console.error('Error:', error);
        setErrorMessage('Failed to fetch companies. Please try again.');
      }
    };

    fetchCompanies();
  }, [currentPage, itemsPerPage]); // Trigger fetch on page change or items per page change

  const getCompaniesWithPagination = async (page, limit) => {
    try {
      const response = await getcompanyApi(page, limit);
      return response;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleAddCompany = async () => {
    try {
      const response = await addcompanyApi(newCompany);
      setCompanies([...companies, response]);
      alert("Data Added Successfully")
      setNewCompany({ company_name: '', company_profile: '' });
      setShowAddForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to add company. Please try again.');
    }
  };

  const handleDeleteCompany = async (companyId) => {
    try {
      await deleteCompanyApi(companyId);
      setCompanies(companies.filter((company) => company.id !== companyId));
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to delete company. Please try again.');
    }
  };

  const handleUpdateCompany = async () => {
    try {
      const response = await updatecompanyApi(updateCompanyId, updateCompany);
      setCompanies(companies.map((company) => (company.id === updateCompanyId ? response : company)));
      alert("Data Updated Successfully")
      setUpdateCompany({ company_name: '', company_profile: '' });
      setShowUpdateForm(false);
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage('Failed to update company. Please try again.');
    }
  };

  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCompanies = companies.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(companies.length / itemsPerPage);

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
      <button className='button-ques-save-add' style={{ width: "120px" }} onClick={() => setShowAddForm(true)}>
        <img src={Add} className='nextarrow' alt="Add"/>
        <span>Company</span>
      </button>
      <p></p><p></p>
      {showAddForm && (
        <div className="popup-container">
          <input
            type="text"
            value={newCompany.company_name}
            autocomplete="off"
            onChange={(e) => setNewCompany({ ...newCompany, company_name: e.target.value })}
            placeholder="Enter company name"
            className='input-ques'
          />
          <p></p>
          <input
            value={newCompany.company_profile}
            autocomplete="off"
            onChange={(e) => setNewCompany({ ...newCompany, company_profile: e.target.value })}
            placeholder="Enter company profile"
            className='input-ques'
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save'style={{ width: "110px" }}  onClick={handleAddCompany}>Save</button>
            <button className='cancel' style={{ width: "110px" }} onClick={() => setShowAddForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {showUpdateForm && (
        <div className="popup-container">
          <input
            type="text"
            autocomplete="off"
            value={updateCompany.company_name}
            className='input-ques'
            onChange={(e) => setUpdateCompany({ ...updateCompany, company_name: e.target.value })}
            placeholder="Enter updated company name"
          />
          <p></p>
          <input
          autocomplete="off"
            value={updateCompany.company_profile}
            onChange={(e) => setUpdateCompany({ ...updateCompany, company_profile: e.target.value })}
            placeholder="Enter updated company profile"
            className='input-ques'
          />
          <p></p>
          <div className='button-container'>
            <button className='button-ques-save' style={{ width: "110px" }} onClick={handleUpdateCompany}>Update</button>
            <button className='cancel' style={{ width: "110px" }} onClick={() => setShowUpdateForm(false)}>Cancel</button>
          </div>
        </div>
      )}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div>
        <table className="product-table">
          <thead className="table-thead">
            <tr>
              <th>Company Name</th>
              <th>Company Profile</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody className="table-tbody">
            {currentCompanies
              .filter(content => !searchQuery || (content.company_name && content.company_name.toLowerCase().includes(searchQuery.toLowerCase())))
              .map((company) => (
                <tr key={company.id}>
                  <td>{company.company_name}</td>
                  <td>{company.company_profile}</td>
                  <td>
                    <button className="action-button edit" onClick={() => {
                      setShowUpdateForm(true);
                      setUpdateCompanyId(company.id);
                      setUpdateCompany({ company_name: company.company_name, company_profile: company.company_profile });
                    }}>✏️</button>
                  </td>
                  <td>
                    <button className="action-button delete" onClick={() => handleDeleteCompany(company.id)}style={{ color: "orange" }} >🗑</button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table><p></p><p></p>
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
        <Pagination className="pagination-custom" >
          <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
          {getPaginationItems()}
          <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
        </Pagination>
      </div>
    </div>
  );
};

export default CompanyManagement;
