import React, { useState, useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { addcollegeadminApi, getcollegeApi } from '../../api/endpoints';
import '../../Styles/global.css';
import Select from 'react-select'; 
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#39444e',
        color: '#fff', // Text color
        borderColor: state.isFocused ? '' : '#ffff', // Border color on focus
        boxShadow: 'none', // Remove box shadow
        '&:hover': {
            borderColor: state.isFocused ? '#ffff' : '#ffff' // Border color on hover
        },
        '&.css-1a1jibm-control': {
            // Additional styles for the specific class
        }
    }),
    singleValue: (provided) => ({
        ...provided,
        color: '#ffff' // Text color for selected value
    }),
    option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? '#39444e' : state.isFocused ? '#39444e' : '#39444e',
        color: '#ffff', // Text color
        '&:hover': {
            backgroundColor: '#39444e', // Background color on hover
            color: '#ffff' // Text color on hover
        }
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: '#39444e'
    })
};
const FormModal = ({ handleClose  }) => {
    const [college, setCollege] = useState([]);
    const [selectedCollege, setSelectedCollege] = useState('');

    useEffect(() => {
        getcollegeApi()
            .then(data => {
                console.log("Received data:", data); // Log received data
                setCollege(data.map(item => ({ value: item.id, label: item.college })));
            })
            .catch(error => console.error('Error fetching college names:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const admin_namemaster = {
            college_id: selectedCollege,
            admin_name: e.target.admin_name.value,
        };

        console.log("Result: ", admin_namemaster);

        try {
            await addcollegeadminApi(admin_namemaster);
            window.alert("Allocated admin added successfully");
        } catch (error) {
            console.error("Failed to Add Data", error);  // Log the error to the console
            alert("Failed to Add. Check console for details.");
        }
    };

    return (
        <div className='form-ques'>
            <div>
                <Row>
                    <Col>
                        <form onSubmit={handleSubmit} className='form-ques'>
                            <Row md={12}>
                                <Col>
                                    <div controlId='admin_name'>
                                        <label className='label5-ques'>Admin Name</label><p></p>
                                        <input type="text" className="input-ques" name="admin_name" required placeholder="" />
                                    </div>
                                </Col>
                            </Row>
                            <p></p>
                            <Row md={12}>
                                <Col>
                                    <div controlId='college_name'>
                                        <label className='label5-ques'>College Name</label><p></p>
                                        <Select
                                            options={college}
                                            value={selectedCollege}
                                            onChange={setSelectedCollege}
                                            placeholder="Select College"
                                            styles={customStyles}
                                        />
                                    </div>
                                </Col>
                            </Row>
                            <p></p>
                            <div className='button-container'>
                                <button type="submit" style={{width:"100px"}}className="button-ques-save">Save</button>
                                <button type="button" style={{width:"100px"}} onClick={handleClose}  className='cancel'>Cancel</button>
                            </div>
                        </form>
                    </Col>
                </Row>
                <p></p>
            </div>
        </div>
    );
};

export default FormModal;
