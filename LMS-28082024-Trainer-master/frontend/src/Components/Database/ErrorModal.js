/*import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ show, handleClose, errorMessage }) => {
    return (
        <Modal show={show} onHide={handleClose} style={{marginTop:"50px", }}>
            <Modal.Header  closeButton style={{height:"30px",backgroundColor:"#F1A128",color:"black"}} >
            </Modal.Header>
            <Modal.Body style={{fontSize: '16px',backgroundColor:"#F1A128",textAlign:"center",}}>
                <div style={{ justifyContent: 'center' }}>
                    {errorMessage}
                </div>
            </Modal.Body>
            
        </Modal>
    );
};

export default ErrorModal;*/

import React from 'react';
import { Modal } from 'react-bootstrap';
import './ErrorModal.css'; // Assuming you create a separate CSS file

const ErrorModal = ({ show, handleClose, errorMessage }) => {
    return (
        <Modal show={show} onHide={handleClose} centered dialogClassName="custom-modal-width" style={{marginTop:"-150px", width: "300px",marginLeft:"600px"}}>
            <Modal.Header closeButton style={{ height: "5px",backgroundColor: "#F1A128", color: "black", borderBottom: 'none' }}>
            </Modal.Header>
            <Modal.Body style={{ fontSize: '16px', backgroundColor: "#F1A128", marginLeft:"20px", padding: '20px',fontWeight:"bold" }}>
                <div style={{ justifyContent: 'center' }}>
                    {errorMessage}
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ErrorModal;
