import React, { useState, useEffect, useContext, useRef } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';
import FormModal from './FormModal';
import { getcontentApi } from '../../api/endpoints';
import { FaPlay, FaExpand, FaCompress } from 'react-icons/fa';
import './dummy.css';
//import DocumentViewer from './DocumentViewer';
import { SearchContext } from '../../AllSearch/SearchContext';
import Back from '../../assets/Images/backarrow.png'
//import Popup from './dummy';
import Footer from '../../Footer/Footer';
const LearningMaterial = () => {
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

    useEffect(() => {
        getTestcontents();
    }, []);

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
            {showAddlms && (
                <div className="form-ques">
                    <div className="header"><h5>Add Content</h5></div><br />
                    <FormModal onNextButtonClick={() => setShowAddlms(false)} />
                       
                </div>
            )}
            {!showAddlms && (
<div>
                <div className="product-table-container">
                    <div className="header"><h4>Content Master</h4></div><p></p>
                    <br />
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                    <button
                            className='button-ques-save' style={{ width: "100px" }}
                            onClick={() => setShowAddlms(true)}
                        >
                            <img src={Back} className='nextarrow'></img>  Back
                        </button>
                        <input
                            className="search-box"
                            type="text"
                            placeholder="Search..."
                            value={sub_topic}
                            onChange={(e) => setsubtopic(e.target.value)}
                            style={{ marginRight: '10px' }} // Adjust the margin as needed
                        />
                       
                    </div>

                    <p></p><p></p>
                    <div className="table-responsive" >
                        <table className="product-table" >
                            <thead className="table-thead">
                                <tr>

                                    <th>Topic</th>
                                    <th>Sub Topic</th>
                                    <th style={{ height: "70px" }}>Content URL</th>
                                    <th>Actual Content</th>
                                    <th>Status</th>
                                    <th>Modified Date</th>
                                    <th>Validity Date</th>
                                </tr>
                            </thead>
                            <tbody className="table-tbody">
                                {testcontents
                                    .filter(content => selectedContentType === 'All' || content.content_type === selectedContentType)
                                    .filter(content => !searchQuery ||
                                        (content.topic_id && content.topic_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.sub_topic && content.sub_topic.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.question_type_id && content.question_type_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.content_url && content.content_url.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.skill_type_id && content.skill_type_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.actual_content && content.actual_content.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.dtm_active_from && content.dtm_active_from.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.status && content.status.toLowerCase().includes(searchQuery.toLowerCase())) ||
                                        (content.dtm_validity && content.dtm_validity.toLowerCase().includes(searchQuery.toLowerCase()))
                                    )
                                    .map(content => (
                                        <tr key={content.id}>

                                            <td>{content.topic_id}</td>
                                            <td>{content.sub_topic}</td>
                                            <td>
                                                <Button variant="link" onClick={() => handlePlayVideo(content.content_url)} style={{ color: 'white' }}>
                                                    <FaPlay size={20} style={{ color: 'white' }} /><span style={{ color: 'white' }}> Play Video</span>
                                                </Button>
                                            </td>
                                            <td>
                                            <td>
    <Button variant="link" onClick={() => handleOpenDocument(content.actual_content)} style={{ color: 'white' }}>
        Open File
    </Button>
</td>

                                            </td>
                                            <td>{content.status}</td>
                                            <td>{content.dtm_active_from}</td>
                                            <td>{content.dtm_validity}</td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
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
                        <div className="embedded-document"   dangerouslySetInnerHTML={{ __html: selectedDocEmbed }} />
                       
                    )}
                    
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDocumentModal(false)}>Close</Button>
                </Modal.Footer>
            </Modal>
<div className='cui-statusbar'></div>
                    </div>
                </div>
           <p style={{height:"50px"}}></p>
          {/*  <Footer></Footer>*/}</div>
           

            )}
        </div>
    );
};

export default LearningMaterial;
