import React, { useState, useEffect,useContext } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import FormModal from './FormModal';
import { SearchContext } from '../../AllSearch/SearchContext';
import { FaEdit, FaTrash, FaEye, FaEllipsisH } from 'react-icons/fa';
import { getcollegeadminApi, deletecollegeadminApi } from '../../api/endpoints';
import Update from './Update';
import '../../Styles/global.css'
import Add from'../../assets/Images/add.png';
import Footer from '../../Footer/Footer';
const Learning = ({ showModal, handleClose }) => {
   //const handleClose = () => setShowModal(false);

    return (
        <div>
            {showModal && <FormModal handleClose={handleClose} />}
           
        </div>
               
           
    );
};


const Allocate = ({ collegeName }) => {
    const [showModal, setShowModal] = useState(false);
    const [allocate, setallocate] = useState([]);
    const [editModalShow, setEditModalShow] = useState(false);
    const [isUpdated, setIsUpdated] = useState(false);
    const [editadmin, setEditadmin] = useState([]);
    const { searchQuery } = useContext(SearchContext); 

   
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    useEffect(() => {
        getAllocate();
    });

    const getAllocate = () => {
        getcollegeadminApi()
            .then(data => {
                // No filtering applied, set the data as is
                setallocate(data);
            })
            .catch(error => console.error('Error fetching Allocate:', error));
    };

    const handleUpdate = (e, ques) => {
        e.preventDefault();
        setEditModalShow(true);
        setEditadmin(ques);
    };

    const handleDelete = (e, id) => {
        e.preventDefault();
        deletecollegeadminApi(id)
            .then(data => {
                alert('Deleted Successfully');
                console.log('Deleted:', data);
            })
            .catch(error => {
                console.error('Failed to delete:', error);
                alert("Failed to Delete");
            });
    };
    let EditModelClose = () => setEditModalShow(false);


    return (
        <div>
        <div className="form-ques" style={{height:"1000px"}}>
            <button className='button-ques-save-add' onClick={handleShowModal}>
            <img src={Add} className='nextarrow'></img>
            <span>Admin</span>   
            </button><p></p>
            <Learning showModal={showModal} handleClose={handleCloseModal} />
            <br /><br />
            <table className="product-table">
                <thead className="table-thead">
                    <tr>
                        <th>ID</th>
                        <th>College</th>
                        <th>Admin Name</th>
                        <th>Edit</th>
                        <th>Delete</th>

                    </tr>
                </thead >
                <tbody className="table-tbody">
                    {allocate .filter(content => !searchQuery || (content.college_id && content.college_id.toLowerCase().includes(searchQuery.toLowerCase()))
          || (content.admin_name && content.admin_name.toLowerCase().includes(searchQuery.toLowerCase())))
                    .map(content => (
                        <tr key={content.id}>
                            <td>{content.id}</td>
                            <td>{content.college_id}</td>
                            <td>{content.admin_name}</td>
                            <td>
                            <button className="action-button edit" onClick={(event) => handleUpdate(event, content)}  >✏️</button>
                               
                                <Update show={editModalShow} admin={editadmin} setUpdated={setIsUpdated} onHide={EditModelClose} />
                            </td>
                            <td>
                            <button className="action-button delete" onClick={(event) => handleDelete(event, content.id)}>🗑</button>
               
                               
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div><p style={{height:"50px"}}></p>
       {/*  <Footer></Footer>*/}
        </div>
    );
};

export default Allocate;
