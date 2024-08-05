import React, { useState, useEffect } from 'react';
import { Button, Table, Dropdown } from 'react-bootstrap'; // Ensure Table and Dropdown are imported here

import { getCourseScheduleApi } from '../../api/endpoints';

const TrainingSchedule = ({ collegeName, username }) => {
  const [courseschdl, setcourseschdl] = useState([]);
  const [trainers, setTrainers] = useState([]); // State to store the list of trainers
  const [selectedTrainer, setSelectedTrainer] = useState('All'); // State to store the selected trainer filter

  useEffect(() => {
    getcourseschedule();
  }, [collegeName, username]);

  useEffect(() => {
    // Extract the list of trainers from the course schedule data
    const extractedTrainers = [...new Set(courseschdl.map(content => content.trainer_id))];
    setTrainers(extractedTrainers);
  }, [courseschdl]);


  const getcourseschedule = () => {
    getCourseScheduleApi()
      .then(data => {
        const filteredData = data.filter(content => content.user_name === username);
        console.log('user1', username); // Corrected typo
        setcourseschdl(filteredData);
        // setcourseschdl(data);
      })
      .catch(error => console.error('Error fetching test contents:', error));
  };


  const handleFilterChange = (trainer) => {
    setSelectedTrainer(trainer);
  };
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const year = date.getUTCFullYear();
    return `${day}/${month}/${year}`;
};
  return (
    <div className="product-table-container">
      <table  className="product-table">
        <thead className="table-thead">
          <tr>
            <th>Course</th>
            <th>
              <Dropdown>
                <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                  {selectedTrainer}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleFilterChange('All')}>All</Dropdown.Item>
                  {trainers.map(trainer => (
                    <Dropdown.Item key={trainer} onClick={() => handleFilterChange(trainer)}>{trainer}</Dropdown.Item>
                  ))}
                </Dropdown.Menu>
              </Dropdown>
            </th>
            <th>Student Name</th>
            <th>StartDate</th>
            <th>EndDate</th>
            <th>Course_mode</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody className="table-tbody">
          {courseschdl.filter(content => selectedTrainer === 'All' || content.trainer_id === selectedTrainer).map(content => (
            <tr key={content.id}>
              <td>{content.course_id}</td>
              <td>{content.trainer_id}</td>
              <td>{content.student_id}</td>
              <td>{formatDate(content.dtm_start)}</td>
              <td>{formatDate(content.dtm_end)}</td>
             
              <td>{content.course_mode}</td>
              <td>{content.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TrainingSchedule;
