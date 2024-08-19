import React, { useEffect, useRef, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";
import {
  getTrainingfeedbackApi,
  getAnnouncementMasterApi,
  geteventApi,
  getTrainingReportApi,
  getAvgScoreByDepartment,
  getAvgScoreByDepartmentCoding,
  getMaxScoreByDepartment,
  getMaxScoreByDepartmentCoding,
  getcollegeApi,
  getTotalTestCount,
  getTotalCompanyCount,  
  getTotalOffers_college_id_API,
  getRequestCount_college_id_API,
} from "../../api/endpoints";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Sidebar from './Sidebar';
import CalendarComponent from './Calender';
import EventForm from './EventForm';
import EventList from './EventList';
import ClusteredChart from "./ClusteredChart";

Chart.register(...registerables);

const Dashboard = ({ collegeName, username, institute }) => {
  const [totalTestCount, setTotalTestCount] = useState(null);
  const [totalComapnyCount, setTotalCompanyCount] = useState(null);
  const [collegeId, setCollegeID] = useState(1);


  const [clgTopper, setClgTopper] = useState([]);
  const [selectedOptionClgTop, setSelectedOptionClgTop] = useState('MCQ');
  const [clgTopperCode, setClgTopperCode] = useState([]);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetails, setEventDetails] = useState([]);
  const [trainingFeedbackData, setTrainingFeedbackData] = useState([]);
  const [totalOffers, setTotalOffers] = useState(null);
  const [totalRequest, setTotalRequest] = useState(null);

  
  const fetchTotalOffers = async () => {
    try {
      const response = await getTotalOffers_college_id_API(institute);
      console.log('Total Offers: ', response);
      console.log('Total Offers...1: ', response.number_of_offers);
      setTotalOffers(response.number_of_offers);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchRequestCount = async () => {
    try {
      const response = await getRequestCount_college_id_API(institute);
      console.log('Total Request: ', response);
      console.log('Total Request...1: ', response.request_count);
      setTotalRequest(response.request_count);
    } catch (err) {
      console.log(err.message);
    }
  };


  useEffect(() => {
    fetchTrainingFeedback();    
    fetchTotalOffers();
    fetchRequestCount();
    fetchTestNameCount();
    getCollegeTopper();
    getCollegeTopperCoding();
    fetchAnnouncements();
  }, [institute, clgTopper, clgTopperCode]);


  
  const fetchTestNameCount = async () => {
    try {
      const response = await getTotalTestCount(institute); // Await the promise
      console.log('response of total test count: ', response);
      setTotalTestCount(response.distinct_test_name_count); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchCompanyCount = async () => {
    try {
      const response = await getTotalCompanyCount(); // Await the promise
      console.log('response of total test count: ', response);
      setTotalCompanyCount(response.count_company_name); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchTrainingFeedback = () => {
    getTrainingfeedbackApi()
      .then(data => {
        // Filter data based on username (trainer_id)
        const filteredData = data.filter(item => item.trainer_id === username);
        console.log("trainer", filteredData)
        setTrainingFeedbackData(filteredData);
      })
      .catch(error => console.error('Error fetching feedback data:', error));
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    fetchEventDataForDate(date);
  };

  const fetchEventDataForDate = (date) => {
    getTrainingReportApi()
      .then(data => {
        const eventData = data.filter(event => new Date(event.dtm_attendance).toDateString() === date.toDateString());
        if (eventData.length > 0) {
          const formattedEventData = eventData.map(event => ({
            date: format(new Date(event.dtm_attendance), 'dd-MM-yyyy'),
            topic: event.topic,
            subTopic: event.sub_topic,
            present: event.present,
            absent: event.absent,
            department: event.department_name,
            collegeName: event.college_name,
            year: event.year
          }));
          setEventDetails(formattedEventData);
        } else {
          setEventDetails([]);
        }
      })
      .catch(error => console.error('Error fetching event data:', error));
  };

  useEffect(() => {
    fetchEventDataForDate(selectedDate);
  }, [selectedDate]);




  const getCollegeTopper = () => {
    getMaxScoreByDepartment(institute)
      .then(data => {
        setClgTopper(data);
      })
      .catch(error => console.error('Error fetching getting College Topper:', error));
  };

  const getCollegeTopperCoding = () => {
    getMaxScoreByDepartmentCoding(institute)
      .then(data => {
        setClgTopperCode(data);
      })
      .catch(error => console.error('Error fetching getting College Topper:', error));
  };




  const [announcements, setAnnouncements] = useState([]); // Define announcements state

  const fetchAnnouncements = () => {
    getAnnouncementMasterApi()
      .then(data => {
        setAnnouncements(data);
      })
      .catch(error => console.error('Error fetching announcements:', error));
  };


  return (
    <div
      className="App"
      style={{ backgroundColor: "#323B44", color: "#ACBFD2" }}
    >
      <section className="card-list" style={{ backgroundColor: "#39444e" }}>
        <div
          className="card"
          style={{
            borderLeft: "6px solid #3742fa",
            backgroundColor: "#39444e",
          }}
        >
          <div
            className="card-content-wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "end",
              marginLeft: "10px",
            }}
          >
            <p
              className="card-content"
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "rgb(172,191,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              {totalTestCount}
            </p>

            <h6
              className="card-title"
              style={{
                fontWeight: "bold",
                color: "rgb(157,190,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              Today Test Count
            </h6>
          </div>
        </div>
        <div
          className="card"
          style={{
            borderLeft: "6px solid #e74c3c",
            backgroundColor: "#39444e",
            fontWeight: "bold",
            fontWeight: "700",
          }}
        >
          <div
            className="card-content-wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "end",
            }}
          >
            <p
              className="card-content"
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "rgb(172,191,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              {totalComapnyCount}
            </p>

            <h2
              className="card-title"
              style={{
                fontWeight: "bold",
                color: "rgb(157,190,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              Total Companies
            </h2>
          </div>
        </div>
        <div
          className="card"
          style={{
            borderLeft: "6px solid #2ecc71",
            backgroundColor: "#39444e",
            color: "white",
            fontWeight: "bold",
            fontWeight: "700",
          }}
        >
          <div
            className="card-content-wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "end",
            }}
          >
            <p
              className="card-content"
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "rgb(172,191,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              {totalOffers}
            </p>

            <h2
              className="card-title"
              style={{
                fontWeight: "bold",
                color: "rgb(157,190,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              Total No Of Offers
            </h2>
          </div>
        </div>
        <div
          className="card"
          style={{
            borderLeft: "6px solid #3498db",
            backgroundColor: "#39444e",
            color: "white",
            fontWeight: "bold",
            fontWeight: "700",
          }}
        >
          <div
            className="card-content-wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "end",
            }}
          >
            <p
              className="card-content"
              style={{
                fontSize: "20px",
                fontWeight: "700",
                color: "rgb(172,191,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              {totalRequest}
            </p>
            <h2
              className="card-title"
              style={{
                fontWeight: "bold",
                color: "rgb(157,190,210)",
                fontWeight: "bold",
                fontWeight: "700",
              }}
            >
              Requests
            </h2>
          </div>
        </div>
        <p></p>
        <div className="dashboard">
          <div className="news-container">
            <h6 style={{ fontWeight: "bold", backgroundColor: "#3e4954", padding: "10px" }}>
              NEWS UPDATES
            </h6>
            {announcements.length > 0 ? (
              announcements.map((announcement, index) => (
                <p key={index}>
                  {format(new Date(announcement.dtm_start), 'dd MMMM yyyy')} - {announcement.content}
                </p>
              ))
            ) : (
              <p>No announcements available.</p>
            )}
          </div>
          <div className="event-form-list-container" style={{ width: "270px" }}>
            <div>
              <h5>What's your plan for today?</h5>
            </div>
            <EventForm selectedDate={selectedDate} eventDetails={eventDetails} />
          </div>
          <div className="calendar-container" style={{ float: 'right', width: "270px", marginLeft: "-20px" }}>
            <CalendarComponent onDateChange={handleDateChange} />
            <div className="card-container-event">
              {Array.isArray(eventDetails) && eventDetails.length > 1 ? (
                eventDetails.map((event, index) => (
                  <React.Fragment key={index}>
                    <div className="card12">
                      <h5> Present</h5>
                      <h4>{event.present}</h4>
                    </div>
                    <div className="card12">
                      <h5> Absent</h5>
                      <h4>{event.absent}</h4>
                    </div>
                  </React.Fragment>
                ))
              ) : (
                <React.Fragment>
                  <div className="card12">
                    <h5>Present</h5>
                    <h4>{eventDetails.present}</h4>
                  </div>
                  <div className="card12">
                    <h5>Absent</h5>
                    <h4>{eventDetails.absent}</h4>
                  </div>
                </React.Fragment>
              )}
            </div>
          </div>

        </div>
        <Container fluid>
          <Row >
            <Col md={6}
              style={{
                marginRight: '8px',
                color: 'rgb(157,190,210)',
                marginTop: '40px',
                width: "46%",
                height: '300px',


              }}>
              <ClusteredChart username={username} />
            </Col>
            <Col md={6}  >
              <Row >
                <Col
                  className="border p-3 assessment-taken"
                  style={{
                    marginRight: '8px',
                    color: 'rgb(157,190,210)',
                    marginTop: '20px',
                    overflowY: 'auto',
                    width: "250px",
                    height: '300px'
                  }}
                >
                  <div
                    className="test"
                    style={{
                      marginBottom: '10px',
                      backgroundColor: '#3e4954',
                      padding: '10px',
                    }}
                  >
                    <h6 style={{ fontWeight: '700', fontSize: '14px' }}>
                      College Topper
                    </h6>
                    <select
                      onChange={(e) => setSelectedOptionClgTop(e.target.value)}
                      value={selectedOptionClgTop}
                      style={{
                        fontSize: '14px',
                        color: 'rgb(157,190,210)',
                        fontWeight: 'bold',
                        borderRadius: '8px',
                        backgroundColor: '#3e4954',
                        width: '100px',
                        padding: '10px',
                      }}
                    >
                      <option value="MCQ">MCQ</option>
                      <option value="Coding">Coding</option>
                    </select>
                  </div>
                  {selectedOptionClgTop === 'MCQ' && (
                    <table className="table" style={{ backgroundColor: '#3e4954' }}>
                      <thead>
                        <tr>
                          <th
                            style={{
                              fontWeight: 'bold',
                              color: '#9dafc1',
                              backgroundColor: '#3e4954',
                              fontSize: '14px',
                            }}
                          >
                            Names
                          </th>
                          <th
                            style={{
                              fontWeight: 'bold',
                              color: '#9dafc1',
                              backgroundColor: '#3e4954',
                              fontSize: '14px'
                            }}
                          >
                            Department
                          </th>
                          <th
                            style={{
                              fontWeight: 'bold',
                              color: '#9dafc1',
                              backgroundColor: '#3e4954',
                              fontSize: '14px'
                            }}
                          >
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: '#3e4954' }}>
                        {clgTopper.map((item) => (
                          <tr key={item.id}>
                            <td
                              style={{
                                color: '#a7bfd2',
                                backgroundColor: '#3e4954',
                                fontSize: '14px'
                              }}
                            >
                              {item.student_name}
                            </td>
                            <td
                              style={{
                                color: '#a7bfd2',
                                backgroundColor: '#3e4954',
                                fontSize: '14px'
                              }}
                            >
                              {item.department}
                            </td>
                            <td
                              style={{
                                color: '#a7bfd2',
                                backgroundColor: '#3e4954',
                                fontSize: '14px'
                              }}
                            >
                              {item.max_total_score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  {selectedOptionClgTop === 'Coding' && (
                    <table className="table" style={{ backgroundColor: '#3e4954' }}>
                      <thead>
                        <tr>
                          <th
                            style={{
                              fontWeight: 'bold',
                              color: '#9dafc1',
                              backgroundColor: '#3e4954',
                              fontSize: '14px'
                            }}
                          >
                            Names
                          </th>
                          <th
                            style={{
                              fontWeight: 'bold',
                              color: '#9dafc1',
                              backgroundColor: '#3e4954',
                            }}
                          >
                            Department
                          </th>
                          <th
                            style={{
                              fontWeight: 'bold',
                              color: '#9dafc1',
                              backgroundColor: '#3e4954',
                            }}
                          >
                            Score
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: '#3e4954' }}>
                        {clgTopperCode.map((item) => (
                          <tr key={item.id}>
                            <td
                              style={{
                                color: '#a7bfd2',
                                backgroundColor: '#3e4954',
                              }}
                            >
                              {item.student_name}
                            </td>
                            <td
                              style={{
                                color: '#a7bfd2',
                                backgroundColor: '#3e4954',
                              }}
                            >
                              {item.department}
                            </td>
                            <td
                              style={{
                                color: '#a7bfd2',
                                backgroundColor: '#3e4954',
                              }}
                            >
                              {item.max_total_score}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                  <div />

                </Col>

                <Col className="border p-3 assessment-taken" style={{ marginTop: '20px' }}>
                  <div className="test2">
                    <h6>COURSE LIST</h6>
                    <select>
                      <option value="">Topic</option>
                    </select>
                  </div>
                  <table className="table" style={{ backgroundColor: '#3e4954' }}>
                    <thead>
                      <tr>
                        <th style={{
                          fontWeight: 'bold',
                          color: '#9dafc1',
                          backgroundColor: '#3e4954',
                        }}>Topic</th>
                        <th style={{
                          fontWeight: 'bold',
                          color: '#9dafc1',
                          backgroundColor: '#3e4954',
                        }}>Department</th>
                        <th style={{
                          fontWeight: 'bold',
                          color: '#9dafc1',
                          backgroundColor: '#3e4954',
                        }}>STATUS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {trainingFeedbackData.length > 0 ? (
                        trainingFeedbackData.map((feedback) => (
                          <tr key={feedback.id}>
                            <td style={{
                              color: '#a7bfd2',
                              backgroundColor: '#3e4954',
                            }}>{feedback.topic_id}</td>
                            <td style={{
                              color: '#a7bfd2',
                              backgroundColor: '#3e4954',
                            }}>{feedback.department_id}</td>
                            <td style={{
                              color: '#a7bfd2',
                              backgroundColor: '#3e4954',
                            }}>{feedback.completion_status}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="3">No training feedback data available.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Col>

              </Row>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Dashboard;
