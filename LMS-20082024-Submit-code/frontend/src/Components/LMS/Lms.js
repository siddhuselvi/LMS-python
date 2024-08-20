import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Table, Form, Pagination } from 'react-bootstrap';
import FormModal from './FormModal';
import { getcontentApi } from '../../api/endpoints';
import { FaPlay, FaExpand, FaCompress } from 'react-icons/fa';
import './dummy.css';
//import DocumentViewer from './DocumentViewer';
import { SearchContext } from '../../AllSearch/SearchContext';
import Back from '../../assets/Images/backarrow.png'
import { deletecontentApi } from '../../api/endpoints';
import UpdateLMS from './updateLms';
//import Popup from './dummy';
const Lms = () => {
    const [testcontents, setTestcontents] = useState([]);
    const [selectedContentType, setSelectedContentType] = useState('All');
    const [showModal1, setShowModal1] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef(null);
    const [showAddlms, setShowAddlms] = useState(true);
    const [search, setSearch] = useState('');
    const { searchQuery } = useContext(SearchContext);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
    const [selectedDocUrl, setSelectedDocUrl] = useState('');
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [sub_topic, setsubtopic] = useState('');
    const [filteredContents, setFilteredContents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [showUpdateForm, setShowUpdateform] = useState(false);
    const [lmsId, setLmsId] = useState(null);
    const handleUpdateFormIsOpen = (id) => {
        setShowUpdateform(true);
        setLmsId(id);
        console.log(id);
    }
    // Handle page change
    const handlePageChange = (pageNumber) => {
        if (pageNumber < 1 || pageNumber > totalPages) return;
        setCurrentPage(pageNumber);
    };

    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return testcontents.slice(startIndex, endIndex);
    };

    const totalPages = Math.ceil(testcontents.length / itemsPerPage);

    const getPaginationItems = () => {
        const maxPaginationItems = 3; // Number of pagination items to display
        let startPage = Math.max(1, currentPage - Math.floor(maxPaginationItems / 2));
        let endPage = Math.min(totalPages, startPage + maxPaginationItems - 1);

        // Adjust startPage if endPage is less than maxPaginationItems
        if (endPage - startPage + 1 < maxPaginationItems) {
            startPage = Math.max(1, endPage - maxPaginationItems + 1);
        }

        let items = [];
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <Pagination.Item key={i} active={i === currentPage} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }
        return items;
    };


    useEffect(() => {
        getTestcontents();
    }, [testcontents]);

    const getTestcontents = () => {
        getcontentApi()
            .then(data => {
                setTestcontents(data);
            })
            .catch(error => console.error('Error fetching test contents:', error));
    };

    const handlePlayVideo = (videoUrl) => {
        setSelectedVideoUrl(videoUrl);
        setShowModal1(true);
    };
    /*
        const handleOpenDocument = (docUrl) => {
            setSelectedDocUrl(docUrl);
            setShowDocumentModal(true);
        };*/
    const [selectedDocEmbed, setSelectedDocEmbed] = useState('');
    const handleOpenDocument = (embedCode) => {
        setSelectedDocEmbed(embedCode);
        setShowDocumentModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await deletecontentApi(id);
            setFilteredContents(filteredContents.filter(content => content.id !== id));
        } catch (error) {
            console.error('Error deleting content:', error);
        }
    };
    const toggleFullScreen = () => {
        const elem = videoRef.current;
        if (!isFullScreen) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) { /* Firefox */
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) { /* IE/Edge */
                elem.msRequestFullscreen();
            }
        } else {
            if (document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement) {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
            }
        }
        setIsFullScreen(!isFullScreen);
    };

    const handleContentTypeFilterChange = (contentType) => {
        setSelectedContentType(contentType);
    };

    return (
        <div >
            {showUpdateForm === true ? (<UpdateLMS lmsId={lmsId} onNextButtonClick={() => setShowUpdateform(false)} />) :
                (
                    <div >
                       
                       

                            <div className="product-table-container">
                               <h4>Content Master</h4><p></p>
                                <br />
                               
                                    <input
                                        className="search-box1"
                                        type="text"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                               

                                <p></p><p></p>
                                <div >
                                    <div className='table-container-lms'>
                                    <table className="product-table" >
                                        <thead className="table-thead">
                                            <tr>

                                                <th>Topic</th>
                                                <th>Sub Topic</th>
                                                <th 
                                                style={{textAlign:"center"}}
                                >Content URL</th>
                                                <th>Actual Content</th>

                                               {/*} <th>Validity Date</th>*/}
                                                {/*} <th>Update</th>*/}
                                                <th>Update</th>
                                                <th>Delete</th>
                                            </tr>
                                        </thead>
                                        <tbody className="table-tbody">
                                            {getPaginatedData()
                                                .filter(content => selectedContentType === 'All' || content.content_type === selectedContentType)
                                                .filter(content => !searchQuery ||
                                                    (content.topic && content.topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.sub_topic && content.sub_topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.question_type_id && content.question_type_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.content_url && content.content_url.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.skill_type_id && content.skill_type_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.actual_content && content.actual_content.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.dtm_active_from && content.dtm_active_from.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.status && content.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                                    (content.dtm_validity && content.dtm_validity.toLowerCase().includes(searchQuery.toLowerCase()))
                                                )
                                                .filter(content => !search ||
                                                    (content.topic && content.topic.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.sub_topic && content.sub_topic.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.question_type_id && content.question_type_id.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.content_url && content.content_url.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.skill_type_id && content.skill_type_id.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.actual_content && content.actual_content.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.dtm_active_from && content.dtm_active_from.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.status && content.status.toLowerCase().includes(search.toLowerCase())) ||
                                                    (content.dtm_validity && content.dtm_validity.toLowerCase().includes(search.toLowerCase()))
                                                )
                                                .map(content => (
                                                    <tr key={content.id}>

                                                        <td>{content.topic}</td>
                                                        <td>{content.sub_topic}</td>
                                                        <td  style={{textAlign:"center"}}>
                                                            {content.content_url ? (
                                                                <Button variant="link" onClick={() => handlePlayVideo(content.content_url)} style={{ color: 'white' }}>
                                                                    <FaPlay size={20} style={{ color: 'white' }} /><span style={{ color: 'white' }}> Play Video</span>
                                                                </Button>
                                                            ) : (
                                                                <Button variant="link" disabled style={{ color: '#a7b3ba' }}>
                                                                    <FaPlay size={20} style={{ color: '#a7b3ba' }} /><span style={{ color: '#a7b3ba' }}> Play Video</span>
                                                                </Button>
                                                            )}
                                                        </td>
                                                        <td>
                                                            {content.actual_content ? (
                                                                <Button variant="link" onClick={() => handleOpenDocument(content.actual_content)} style={{ color: 'white' }}>
                                                                    Open File
                                                                </Button>
                                                            ) : (
                                                                <Button variant="link" disabled style={{ color: '#a7b3ba' }}>
                                                                    Open File
                                                                </Button>
                                                            )}
                                                        </td>

                                                       {/*} <td>{content.dtm_validity}</td>*/}
                                                        <td>
                                                            <button className="action-button edit" onClick={() => handleUpdateFormIsOpen(content.id)}>✏️</button>
                                                        </td>
                                                        <td>
                                                            <button className="action-button delete" onClick={() => handleDelete(content.id)} style={{ color: "orange" }}>
                                                                🗑
                                                            </button></td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                                    <p></p><p></p>
                                    <div className='dis-page'>
                                   
                                    <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
                                        <Form.Label className='display' Namestyle={{ marginRight: '10px' }}>Display:</Form.Label>
                                        <Form.Control
                                        className='label-dis'
                                            style={{ width: "50px", boxShadow: 'none', outline: 'none' }}
                                            as="select"
                                            value={itemsPerPage}
                                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
                                        >
                                            <option value={5}>5</option>
                                            <option value={10}>10</option>
                                            <option value={15}>15</option>
                                        </Form.Control>
                                    </Form.Group>

                                    <Pagination className="pagination-custom" style={{ marginLeft: "860px", marginTop: "-34px", boxShadow: 'none', outline: 'none' }}>
                                        <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                                        {getPaginationItems()}
                                        <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
                                    </Pagination>

                                    </div>
                                    <Modal show={showModal1} onHide={() => setShowModal1(false)} style={{ marginTop: "50px" }}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Video Player</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <div style={{ width: "100%", height: "auto", textAlign: "center" }}>
                                                <iframe
                                                    ref={videoRef}
                                                    src={selectedVideoUrl}
                                                    width="100%"
                                                    height="315"
                                                    frameBorder="0"
                                                    allowFullScreen
                                                    title="Video Player"
                                                ></iframe>
                                            </div>
                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowModal1(false)}>Close</Button>
                                            <Button variant="secondary" onClick={toggleFullScreen}>
                                                {isFullScreen ? <FaCompress /> : <FaExpand />} Toggle Fullscreen
                                            </Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <Modal show={showDocumentModal} onHide={() => setShowDocumentModal(false)} size="xl" style={{ marginTop: "40px" }}>
                                        <Modal.Header closeButton>
                                            <Modal.Title>Document Viewer</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            {/* Render the embedded content here */}
                                            {selectedDocEmbed && (
                                                <div className="embedded-document" dangerouslySetInnerHTML={{ __html: selectedDocEmbed }} />

                                            )}

                                        </Modal.Body>
                                        <Modal.Footer>
                                            <Button variant="secondary" onClick={() => setShowDocumentModal(false)}>Close</Button>
                                        </Modal.Footer>
                                    </Modal>
                                    <div className='cui-statusbar'></div>
                                </div>
                            </div>
                       
                    </div>
                )}
        </div>
    );
};

export default Lms;
