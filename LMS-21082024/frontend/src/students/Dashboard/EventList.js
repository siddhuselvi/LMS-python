// src/components/EventList.js
import React from 'react';
import './Dashboard.css'
const EventList = () => {
  const events = [
    { id: 1, title: 'Take out the bins', date: '2023-04-04', tag: '#life' },
    { id: 2, title: 'Brainstorm blog post ideas', date: '2023-04-03', tag: '#blog' },
    { id: 3, title: 'Call Max', date: '2023-04-04', tag: '#reminder' },
  ];

  return (
    <ul className="event-list">
      {events.map((event) => (
        <li key={event.id}>
          <span>{event.date}</span>
          <span>{event.title}</span>
          <span>{event.tag}</span>
        </li>
      ))}
    </ul>
  );
};

export default EventList;
