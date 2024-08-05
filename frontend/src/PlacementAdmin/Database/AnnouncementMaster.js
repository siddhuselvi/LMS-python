import React, { useState, useEffect } from 'react';
import { Button } from 'react-bootstrap';
import FormModal from './AnnouncementModal';  // Assuming this is your add/update modal
import Updateannouncement from './UpdateAnnoucement'; // Import your update modal component
import { getAnnouncementMasterApi, updateAnnouncementMasterApi, deleteAnnouncementMasterApi } from '../../api/endpoints';
import Add from '../../assets/Images/add.png';
import ErrorModal from '../auth/ErrorModal';

const Announcements = ({ collegeName }) => {
    const [showForm, setShowForm] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [announce, setAnnounce] = useState([]);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        getAnnouncements();
    }, [collegeName]);

    const getAnnouncements = () => {
        getAnnouncementMasterApi()
            .then(data => {
                console.log("announcement", data);
                const filteredAnnouncements = data.filter(item => item.college_id === collegeName);
                setAnnounce(filteredAnnouncements);
            })
            .catch(error => console.error('Error fetching announcements:', error));
    };

    const handleShowForm = () => setShowForm(true);
    const handleHideForm = () => setShowForm(false);
    const handleCloseError = () => setShowError(false);

    const handleEdit = (announcement) => {
        setSelectedAnnouncement(announcement);
        setShowUpdateModal(true);
    };

    const handleDelete = (id) => {
        deleteAnnouncementMasterApi(id)
            .then(() => {
                getAnnouncements();
            })
            .catch(error => {
                console.error('Error deleting announcement:', error);
                setErrorMessage('Failed to delete the announcement');
                setShowError(true);
            });
    };

    const handleUpdate = (updatedAnnouncement) => {
        updateAnnouncementMasterApi(updatedAnnouncement.id, updatedAnnouncement)
            .then(() => {
                getAnnouncements();
                setShowUpdateModal(false);
            })
            .catch(error => {
                console.error('Error updating announcement:', error);
                setErrorMessage('Failed to update the announcement');
                setShowError(true);
            });
    };

    return (
        <div>
            <button className='button-ques-save-add' style={{ width: "124px" }} onClick={handleShowForm}>
                <img src={Add} className='nextarrow' alt="Add Announcement" style={{ marginRight: "2px" }} />
                <strong>Announcement</strong>
            </button>
            <p></p>

            {showForm && (
                <div>
                    <FormModal
                        announcement={selectedAnnouncement}
                        onSave={handleUpdate}
                        onClose={handleHideForm}
                    />
                </div>
            )}

            {showUpdateModal && selectedAnnouncement && (
                <Updateannouncement
                    announcement={selectedAnnouncement}
                    onUpdate={handleUpdate}
                    onClose={() => setShowUpdateModal(false)}
                />
            )}

            <br /><br />

            <div className='product-table-container'>
                <table className="product-table">
                    <thead className="table-thead">
                        <tr>
                            <th>College</th>
                            <th>StartDate</th>
                            <th>Content</th>
                            <th>Is_Active</th>
                            <th>Update</th>
                            <th>Delete</th>
                        </tr>
                    </thead>
                    <tbody className="table-tbody">
                        {announce.map(content => (
                            <tr key={content.id}>
                                <td>{content.college_id}</td>
                                <td>{content.dtm_start}</td>
                                <td>{content.content}</td>
                                <td>{content.is_active}</td>
                                <td>
                                    <button className="action-button edit" onClick={() => handleEdit(content)}>✏️</button>
                                </td>
                                <td>
                                    <button className="action-button delete" onClick={() => handleDelete(content.id)} style={{ color: "orange" }}>🗑</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showError && (
                <ErrorModal show={showError} handleClose={handleCloseError} message={errorMessage} />
            )}
        </div>
    );
};

export default Announcements;
