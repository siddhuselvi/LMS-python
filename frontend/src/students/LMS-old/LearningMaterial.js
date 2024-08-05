import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Table, Form, Pagination } from 'react-bootstrap';

import { getcontentApi,
    getStudents_Course_LMS_API
 } from '../../api/endpoints';
import { FaPlay, FaExpand, FaCompress } from 'react-icons/fa';
import StudentFeedback from './StudentFeedback';
//import DocumentViewer from './DocumentViewer';
import { SearchContext } from '../../AllSearch/SearchContext';
import Back from '../../assets/Images/backarrow.png'
//import Popup from './dummy';
//import Popup from './dummy';


const LearningMaterial = ({ username, institute }) => {
    const [testcontents, setTestcontents] = useState([]);
    const [selectedContentType, setSelectedContentType] = useState('All');
    const [showModal1, setShowModal1] = useState(false);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const videoRef = useRef(null);
    const [showAddlms, setShowAddlms] = useState(true);
    const { searchQuery } = useContext(SearchContext);
    const [selectedVideoUrl, setSelectedVideoUrl] = useState('');
    const [selectedDocUrl, setSelectedDocUrl] = useState('');
    const [showDocumentModal, setShowDocumentModal] = useState(false);
    const [sub_topic, setsubtopic] = useState('');
    const [filteredContents, setFilteredContents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calculate the items to display based on the current page and items per page
    const getPaginatedData = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return testcontents.slice(startIndex, endIndex);
    };

    // Get total pages
    const totalPages = Math.ceil(testcontents.length / itemsPerPage);

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

    useEffect(() => {
        getTestcontents();
    }, []);

    const getTestcontents = () => {
        getStudents_Course_LMS_API(username)
            .then(data => {
                setTestcontents(data);
                console.log('LMS Contents: ', data)
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
    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Disable copy events
        const handleCopy = (e) => {
            e.preventDefault();
        };

        // Optionally, disable screenshot (making it more difficult)
        const handleKeyDown = (e) => {
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && e.shiftKey && e.key === 'S') // Windows Snipping Tool
            ) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('copy', handleCopy);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    useEffect(() => {
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        const handleCopy = (e) => {
            e.preventDefault();
        };

        const handleKeyDown = (e) => {
            if (
                e.key === 'PrintScreen' ||
                (e.ctrlKey && e.shiftKey && e.key === 'S')
            ) {
                e.preventDefault();
            }
        };

        if (showDocumentModal) {
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('copy', handleCopy);
            document.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('copy', handleCopy);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [showDocumentModal]);

    return (


        <div className="no-select no-right-click">
            <div className="no-screenshot-overlay"></div>

            <div className="product-table-container" style={{ marginLeft: "0px" }}>

                <p></p><p></p>
                <div >
                    <table className="product-table" >
                        <thead className="table-thead">
                            <tr>

                                <th>Topic</th>
                                <th>Sub Topic</th>
                                <th style={{ height: "70px" }}>Content URL</th>
                                <th>Actual Content</th>
                                <th>Start Date</th>
                                <th>Validity Date</th>

                            </tr>
                        </thead>
                        <tbody className="table-tbody">
                            {getPaginatedData()
                                .filter(content => selectedContentType === 'All' || content.content_type === selectedContentType)

                                .map(content => (
                                    <tr key={content.id}>

                                        <td>{content.topic}</td>
                                        <td>{content.sub_topic}</td>
                                        <td>
                                            {content.Content_URL ? (
                                                <Button variant="link" onClick={() => handlePlayVideo(content.Content_URL)} style={{ color: 'white' }}>
                                                    <FaPlay size={20} style={{ color: 'white' }} /><span style={{ color: 'white' }}> Play Video</span>
                                                </Button>
                                            ) : (
                                                <Button variant="link" disabled style={{ color: '#a7b3ba' }}>
                                                    <FaPlay size={20} style={{ color: '#a7b3ba' }} /><span style={{ color: '#a7b3ba' }}> Play Video</span>
                                                </Button>
                                            )}
                                        </td>
                                        <td>
                                            {content.Actual_Content ? (
                                                <Button variant="link" onClick={() => handleOpenDocument(content.Actual_Content)} style={{ color: 'white' }}>
                                                    Open File
                                                </Button>
                                            ) : (
                                                <Button variant="link" disabled style={{ color: '#a7b3ba' }}>
                                                    Open File
                                                </Button>
                                            )}
                                        </td>

                                        <td>{content.Start_Date}</td>
                                        <td>{content.End_Date}</td>

                                    </tr>
                                ))}
                        </tbody>
                    </table>
                   
                    <div className='dis-page'>
                    <Form.Group controlId="itemsPerPageSelect" style={{ display: 'flex' }}>
                        <Form.Label className='display'>Display:</Form.Label>
                        <Form.Control
                         className='label-dis'
                            style={{ width: "50px" }}
                            as="select"
                            value={itemsPerPage}
                            onChange={(e) => setItemsPerPage(Number(e.target.value))}
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
                    </Pagination></div>
                    <Modal show={showModal1} onHide={() => setShowModal1(false)} style={{ marginTop: "50px" }}>
                        <Modal.Header closeButton>
                            <Modal.Title>Video Player</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="no-select no-right-click">
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
                        <Modal.Body className="no-select no-right-click">
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
                </div><p style={{height:"30px"}}></p>
                <StudentFeedback></StudentFeedback>
            </div>

        </div>
    );
};

export default LearningMaterial;

