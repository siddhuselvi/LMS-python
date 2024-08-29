import React from 'react';
import './Eventform.css';

const EventForm = ({ selectedDate, eventDetails }) => {
  return (
    <div className="event-form">
      <div>
        <label>Date</label>
        <input type="text" value={selectedDate.toLocaleDateString('en-GB')} readOnly />
      </div><p></p>
      {Array.isArray(eventDetails) && eventDetails.length > 1 ? (
        <ul>
          {eventDetails.map((event, index) => (
            <li key={index} className="event-list-item">
            <div className="event-form-group">
              <p>{event.subTopic} <span>in </span> {event.topic},</p>
            </div>
            <div className="event-form-group">
              <p>Session taken in <span>{event.collegeName}</span> <span>college</span>, <span>{event.year} <span>year</span></span>, <span>{event.department}</span></p>
            </div>
          </li>
          ))}
        </ul>
      ) : (
        Array.isArray(eventDetails) && eventDetails.map((event, index) => (
          <React.Fragment key={index}>
            <li key={index} className="event-list-item">
            <div className="event-form-group">
              <p>{event.subTopic} <span>in </span> {event.topic},</p>
            </div>
            <div className="event-form-group">
              <p>Session taken in <span>{event.collegeName}</span> <span>college</span>, <span>{event.year} <span>year</span></span>, <span>{event.department}</span></p>
            </div>
          </li>          </React.Fragment>
        ))
      )}
    </div>
  );
};

export default EventForm;
