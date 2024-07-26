// src/college/Dashboard/EventForm.js
import React from 'react';
import './Eventform.css'
const EventForm = ({ selectedDate, eventDetails }) => {
  return (
    <div className="event-form">
      <div>
        <label>Date</label>
        <input type="text" value={selectedDate.toLocaleDateString('en-GB')} readOnly />
      </div><p></p>
      <div>
        <label>Topic</label>
        <input type="text" value={eventDetails.topic} readOnly />
      </div><p></p>
      <div>
        <label>Sub Topic</label>
        <input type="text" value={eventDetails.subTopic} readOnly />
      </div><p></p>
      <div>
        <label>Department</label>
        <input type="text" value={eventDetails.department} readOnly />
      </div><p></p>
    </div>
  );
};

export default EventForm;
