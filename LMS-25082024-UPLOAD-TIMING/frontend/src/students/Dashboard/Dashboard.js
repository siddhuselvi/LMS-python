import React, { useEffect, useRef, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTextWidth,
  faBars,
  faLayerGroup,
  faPenToSquare,
  faBell,
} from "@fortawesome/free-solid-svg-icons";
import { Line, Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import Profile from '../../../src/assets/Images/Profile.jpeg'
import "./Dashboard.css";

import ErrorModal from "../../Components/auth/ErrorModal";
import {
  geteligiblestudentsAllApi,
  update_is_DeclineApi,
  update_is_acceptApi,
  getEventsClgDept,
  getcandidatesApi,
  studentCourseProgressApi,
  StudentReportDashApi,
  MCQTestPerformanceApi,
  getAnnouncementMasterApi,
  getTrainingReportApi,
  getTotalTestTaken_API,
  getTotalOffers_API,
  getRequestCount_API,
  getAptitudeAvgScore_API,
  getSoftskill_AvgScore_API,
  getTechnical_AvgScore_API,
  getCoding_AvgScore_API,
  getStudentPlan_API,
  getStudentDetails_API,
  get_studens_announcement_API,
} from "../../api/endpoints";

import { format } from 'date-fns';
import Sidebar from './Sidebar';
import CalendarComponent from './Calender';
import EventForm from './EventForm';
import BinaryToImages from "../Test/tests/BinaryToImages";


Chart.register(...registerables);

const Dashboard = ({ collegeName, username, institute }) => {
  const [departmentId, setDepartmentId] = useState(null);
  const [clgID, setClgID] = useState(null);
  const [events, setEvents] = useState([]);
  const [stuID, setStuID] = useState(null);
  const [courseInprogress, setCourseInprogress] = useState(null);
  const [courseCompleted, setCourseCompleted] = useState(null);
  const [testReport, setTestReport] = useState([]);
  const [testPerformance, setTestPerformance] = useState([]);
  const [announcements, setAnnouncements] = useState([]); // Define announcements state
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetails, setEventDetails] = useState([]);
  const [totalTestTaken, setTotalTestTaken] = useState(null);
  const [totalOffers, setTotalOffers] = useState(null);
  const [totalRequest, setTotalRequest] = useState(null);
  const [aptitudeAvgScore, setAptitudeAvgScore] = useState([]);
  const [softSkillAvgScore, setSoftSkillAvgScore] = useState([]);
  const [technicalAvgScore, setTechnicalAvgScore] = useState([]);
  const [codingAvgScore, setCodingAvgScore] = useState([]);
 

  const getDepartmentId = () => {
    getStudentDetails_API(username)
      .then(candidates => {
        console.log('candidates details: ', candidates)
        const candidate = candidates[0];
        setDepartmentId(candidate.department_id);
        setClgID(candidate.college_id);
        setStuID(candidate.id);

      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  };


  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    getAnnouncementMasterApi()
      .then(data => {
        setAnnouncements(data);
      })
      .catch(error => console.error('Error fetching announcements:', error));
  };
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleCloseError = () => {
    setShowError(false);
  };
  useEffect(() => {
    const preventScreenshot = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        setErrorMessage('Screenshots are disabled for this page.');
        setShowError(true);
      }
    };

    const preventContextMenu = (e) => {
      e.preventDefault();
      setErrorMessage('Right-click is disabled for this page.');
      setShowError(true);
    };

    const preventMobileScreenshot = () => {
      setErrorMessage('Screenshots are disabled for this page.');
      setShowError(true);
    };

    window.addEventListener('keyup', preventScreenshot);
    window.addEventListener('contextmenu', preventContextMenu);
    window.addEventListener('visibilitychange', preventMobileScreenshot);

    return () => {
      window.removeEventListener('keyup', preventScreenshot);
      window.removeEventListener('contextmenu', preventContextMenu);
      window.removeEventListener('visibilitychange', preventMobileScreenshot);
    };
  }, []);


  const handleDateChange = (date) => {
    console.log('handleDateChange Date: ', date)
    setSelectedDate(date);
    fetchEventDataForDate(date);
  };


  const fetchEventDataForDate = (date) => {
    getStudentPlan_API(format(date, 'yyyy-MM-dd'), stuID)
      .then(data => {
        console.log('getStudentPlan_API data: ', data);

        if (data.length > 0) {
          const formattedEventData = data.map(event => ({
            date: format(new Date(event.dtm_start), 'dd-MM-yyyy'),
            topic: event.topic_name,
            subTopic: event.subtopic_name,
            department: event.department_name,
            collegeName: event.college_name,
            year: event.year,
            test_name: event.test_name
          }));
          console.log('formattedEventData: ', formattedEventData);
          setEventDetails(formattedEventData);
        } else {
          setEventDetails([]);
        }
      })
      .catch(error => console.error('Error fetching event data:', error));
  };



  const fetchCourseProgress = async () => {
    try {
      const response = await getTotalTestTaken_API(stuID); // Await the promise
      console.log('response of Course Progress count: ', response);
      setCourseInprogress(response.Course_Inprogress);
      setCourseCompleted(response.Course_Completed);
    } catch (err) {
      console.log(err.message);
    }
  };


  const EventsData = async () => {
    try {
      const response = await get_studens_announcement_API(stuID);
      console.log('Events Fetching...: ', response);
      setEvents(response);
      console.log('Events: ', response);
    } catch (err) {
      console.log(err.message);
    }
  };


  const getTestReports = async () => {
    try {
      console.log('Student id: ', stuID);

      const response = await StudentReportDashApi(stuID);
      console.log('Reports: ', response);
      setTestReport(response);
    } catch (err) {
      console.log(err.message);
    }
  };


  const getTestPerformance = async () => {
    try {
      const response = await MCQTestPerformanceApi(stuID);
      console.log('Test Performance: ', response);
      setTestPerformance(response);
    } catch (err) {
      console.log(err.message);
    }
  };



  const fetchTotalTestTaken = async () => {
    try {
      const response = await getTotalTestTaken_API(stuID);
      console.log('Total Test Count: ', response);
      console.log('Total Test Count...1: ', response.count);
      setTotalTestTaken(response.count);
    } catch (err) {
      console.log(err.message);
    }
  };

  const fetchTotalOffers = async () => {
    try {
      const response = await getTotalOffers_API(stuID);
      console.log('Total Offers: ', response);
      console.log('Total Offers...1: ', response.number_of_offers);
      setTotalOffers(response.number_of_offers);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchRequestCount = async () => {
    try {
      const response = await getRequestCount_API(stuID);
      console.log('Total Request: ', response);
      console.log('Total Request...1: ', response.request_count);
      setTotalRequest(response.request_count);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchAptitudeAvgScore = async () => {
    try {
      const response = await getAptitudeAvgScore_API(stuID);
      console.log('Aptitude Avg Score: ', response);
      setAptitudeAvgScore(response);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchSoftSkill_AvgScore = async () => {
    try {
      const response = await getSoftskill_AvgScore_API(stuID);
      console.log('SoftSkills Avg Score: ', response);
      setSoftSkillAvgScore(response);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchTechnical_AvgScore = async () => {
    try {
      const response = await getTechnical_AvgScore_API(stuID);
      console.log('Technical Avg Score: ', response);
      setTechnicalAvgScore(response);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchCoding_AvgScore = async () => {
    try {
      const response = await getCoding_AvgScore_API(stuID);
      console.log('Coding Avg Score: ', response);
      setCodingAvgScore(response);
    } catch (err) {
      console.log(err.message);
    }
  };




  // Use useEffect to call fetchTestNameCount when collegeId changes
  useEffect(() => {
    getDepartmentId();
    EventsData();
    fetchCourseProgress();
    getTestReports();
    getTestPerformance();
    fetchTotalTestTaken();
    fetchTotalOffers();
    fetchRequestCount();
    fetchAptitudeAvgScore();
    fetchSoftSkill_AvgScore();
    fetchTechnical_AvgScore();
    fetchCoding_AvgScore();
    fetchEventDataForDate(selectedDate);
  }, [stuID, selectedDate, institute, departmentId]);


  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    const dayOptions = { weekday: 'long' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };

    const day = date.toLocaleDateString('en-US', dayOptions);
    const time = date.toLocaleTimeString('en-US', timeOptions);
    return `${day} ${time}`;
  };


  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short' });
  };

  useEffect(() => {
    getCandidates();
  }, [collegeName, username, institute]);
  const [Candidates, setCandidates] = useState([]);

  const getCandidates = () => {
    geteligiblestudentsAllApi(institute, username, collegeName)
      .then(CandidatesData => {
        // Filter the data based on username and collegeName
        const filteredCandidates = CandidatesData.filter(candidate =>
          candidate.students_id__user_name === username &&
          candidate.students_id__college_id__college === collegeName
        );

        setCandidates(filteredCandidates);
        console.log('Filtered Candidates: ', filteredCandidates);
      })
      .catch(error => {
        console.error('Error fetching test candidates:', error);
      });
  };

  const handleAccept = (id) => {
    update_is_acceptApi(id)
      .then(response => {
        console.log('Accepted job:', id, response);
        setCandidates(prevCandidates =>
          prevCandidates.map(candidate =>
            candidate.id === id ? { ...candidate, is_accept: true } : candidate
          )
        );
        setErrorMessage('Job ${id} accepted successfully!');
        setShowError(true);
        //alert(`Job ${id} accepted successfully!`);
      })
      .catch(error => {
        console.error('Error accepting job:', id, error);
      });
  };

  const handleDecline = (id) => {
    update_is_DeclineApi(id)
      .then(response => {
        console.log('Declined job:', id, response);
        setCandidates(prevCandidates =>
          prevCandidates.map(candidate =>
            candidate.id === id ? { ...candidate, is_accept: false } : candidate
          )
        );
        setErrorMessage('Job ${id} declined successfully!');
        setShowError(true);
  
       // alert(`Job ${id} declined successfully!`);
      })
      .catch(error => {
        console.error('Error declining job:', id, error);
      });
  };

  const handleQuery = (jobId) => {
    console.log('Query for job:', jobId);
    // Add your query logic here
  };
  const attendanceData = useMemo(
    () => [
      { department: "S", y: 1, x: 35, color: "danger" },
      { department: "M", y: 2, x: 45, color: "warning" },
      { department: "T", y: 3, x: 55, color: "success" },
      { department: "W", y: 4, x: 65, color: "info" },
      { department: "T", y: 5, x: 75, color: "primary" },
      { department: "F", y: 6, x: 85, color: "secondary" },
      { department: "S", y: 7, x: 90, color: "dark" },
    ],
    []
  );

  const assessmentData = useMemo(
    () => [
      { department: "Jun", x: 1, y: 75, color: "danger" },
      { department: "Feb", x: 2, y: 85, color: "danger" },
      { department: "Mar", x: 3, y: 95, color: "danger" },
      { department: "Apr", x: 3, y: 95, color: "danger" },
      { department: "May", x: 3, y: 95, color: "danger" },
      { department: "June", x: 3, y: 95, color: "danger" },
    ],
    []
  );
  function getColor(variant) {
    switch (variant) {
      case "danger":
        return "#70a1ff";
      case "warning":
        return "#1e90ff";
      case "primary":
        return "#5352ed";
      case "info":
        return "#8e44ad";
      case "success":
        return "#9b59b6";
      case "secondary":
        return "#9b59b6";
      case "dark":
        return "#9b59b6";
      default:
        return "#6c757d";
    }
  }
  return (
    <div>


      <div >

        <div className="stu-board">
          <div
            className="App-stu"
          >
            <header
              className="header-stu"
            >
              <h5 className="h5-stu"
              >
                Overview
              </h5>
            </header>
            <section
              className="card-list-stu"
            >
              <div className="card-stu">
                <div
                  className="card-green"
                >
                  <div
                    className="card-content-wrapper-stu"
                  >
                    <h6
                      className="card-title-stu"
                    >
                      Total Present
                    </h6>
                    <p
                      className="card-content-stu"
                    >
                      2
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-stu">
                <div
                  className="card-purple"
                >
                  <div
                    className="card-content-wrapper-stu"
                  >
                    <h2
                      className="card-title-stu"
                    >
                      Total Test Taken
                    </h2>
                    <p
                      className="card-content-stu"
                    >
                      {totalTestTaken}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-stu">
                <div
                  className="card-paint"
                >
                  <div
                    className="card-content-wrapper-stu"
                  >
                    <h2
                      className="card-title-stu"
                    >
                      Total No.of Offers
                    </h2>
                    <p
                      className="card-content-stu"
                    >
                      {totalOffers}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card-stu">
                <div
                  className="card-yellow"
                >
                  <div
                    className="card-content-wrapper-stu"
                  >
                    <h2
                      className="card-title-stu"
                    >
                      Request
                    </h2>
                    <p
                      className="card-content-stu"
                    >
                      {totalRequest}
                    </p>
                  </div>
                </div>
              </div>
            </section>


            <div className="dashboard-stu">

              <div className="event-form-list-container-stu">
                <div>
                  <h5 className="h5-plan">What's your plan for today?</h5>
                </div>
                <EventForm selectedDate={selectedDate} eventDetails={eventDetails} />
              </div>
              <div className="calendar-container-stu">
                <CalendarComponent onDateChange={handleDateChange} />
                <div className="card-container-event-stu">
                  {Array.isArray(eventDetails) && eventDetails.length > 0 ? (
                    <React.Fragment>
                      <div className="card12-stu">
                        <h5>Present</h5>
                        <h4>{eventDetails[0].total_present}</h4>
                      </div>
                      <div className="card12-stu">
                        <h5>Absent</h5>
                        <h4>{eventDetails[0].total_absent}</h4>
                      </div>
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      <div className="card12-stu">
                        <h5>Present</h5>
                        <h4>0</h4>
                      </div>
                      <div className="card12-stu">
                        <h5>Absent</h5>
                        <h4>0</h4>
                      </div>
                    </React.Fragment>
                  )}
                </div>
              </div>
              <div className="news-container-stu">
                <h6 className="h6-stu">
                  Upcomming Events
                </h6>
                {events.length > 0 ? (
                  events.map((data, index) => (
                    <tr key={index}>
                      <td className="td-stu" style={{ width: '300px' }}>
                        {data.announcement_image && (
                          <div className="image-container">
                            <BinaryToImages
                              binaryData={data.announcement_image}
                              width="60px"
                              height="60px"
                            />
                          </div>
                        )}
                        <div className="announcement-text">
                          <p>{data.announcement}</p>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <p>No Events available.</p>
                )}
              </div>

            </div>

            <div className="dashboard-tables">
              <table className="product-table box-size">
                <thead className="table-thead box-size">
                  {/* First Header Row for the Group Titles */}
                  <tr>
                    <th colSpan="3" className="box-size" style={{ textAlign: "center" }}>Job Details</th>
                    <th colSpan="3" className="box-size" style={{ textAlign: "center" }}>Actions</th>
                  </tr>
                  {/* Second Header Row for the Actual Columns */}
                  <tr className="box-size">
                    <th className="box-size">Interview Date</th>
                    <th className="box-size">Company Name</th>
                    <th className="box-size">Location</th>
                    <th className="box-size">Accept</th>
                    <th className="box-size">Decline</th>
                    <th className="box-size">Query</th>
                  </tr>
                </thead>
                <tbody className="table-tbody" >
                  {Candidates.map(candidate => (
                    <tr key={candidate.id} className="box-size">
                      <td className="box-size">{candidate.job_id__interview_date}</td>
                      <td className="box-size">{candidate.job_id__company_name}</td>
                      <td className="box-size">{candidate.job_id__location}</td>
                      <td className="box-size">
                        <button className='button-to-accept' onClick={() => handleAccept(candidate.id)}>Accept</button>
                      </td>
                      <td className="box-size">
                        <button className='button-to-accept' onClick={() => handleDecline(candidate.id)}>Decline</button>
                      </td>
                      <td className="box-size">
                        <button className='button-to-accept' onClick={() => handleQuery(candidate.id)}>Query</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              className="progress-section-stu">
              <Container className="container-stu">
                <Row>
                  <div
                    className="assessment-taken-stu"
                  >
                    <div
                      className="test1-stu"
                    >
                      <h6 className="h6-report-stu">Test Report</h6>
                    </div>
                    <Row>
                      <Col>
                        <h6>Avg-Score Aptitude</h6>
                        <div className="apti-stu">
                          <Line className="chart-stu"
                            data={{
                              labels: aptitudeAvgScore.map((data) => data.month),
                              datasets: [
                                {
                                  data: aptitudeAvgScore.map((data) => data.avg_score),
                                  borderColor: "rgba(75,192,192,1)",
                                  backgroundColor: "rgba(75,192,192,0.4)",
                                  fill: false,
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  min: 0,
                                  max: 100,
                                  ticks: {
                                    font: {
                                      size: 12, // Adjust the font size of the Y-axis labels
                                    },
                                    stepSize: 10, // Adjust the step size between ticks
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  titleColor: "#ACBFD2",
                                  bodyColor: "#ACBFD2",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                },
                              },
                            }}
                          />
                        </div>
                      </Col>
                      <Col>
                        <h6>Avg-Score Softskills</h6>
                        <div className="apti-stu">
                          <Line className="chart-stu"
                            data={{
                              labels: softSkillAvgScore.map((data) => data.month),
                              datasets: [
                                {
                                  data: softSkillAvgScore.map((data) => data.avg_score),
                                  borderColor: "rgba(75,192,192,1)",
                                  backgroundColor: "rgba(75,192,192,0.4)",
                                  fill: false,
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  min: 0,
                                  max: 100,
                                  ticks: {
                                    font: {
                                      size: 12, // Adjust the font size of the Y-axis labels
                                    },
                                    stepSize: 10, // Adjust the step size between ticks
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  titleColor: "#ACBFD2",
                                  bodyColor: "#ACBFD2",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                },
                              },
                            }}
                          />
                        </div>
                      </Col>
                      <Col>
                        <h6>Avg-Score Technical</h6>
                        <div className="apti-stu">
                          <Line className="chart-stu"
                            data={{
                              labels: technicalAvgScore.map((data) => data.month),
                              datasets: [
                                {
                                  data: technicalAvgScore.map((data) => data.avg_score),
                                  borderColor: "rgba(75,192,192,1)",
                                  backgroundColor: "rgba(75,192,192,0.4)",
                                  fill: false,
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  min: 0,
                                  max: 100,
                                  ticks: {
                                    font: {
                                      size: 12, // Adjust the font size of the Y-axis labels
                                    },
                                    stepSize: 10, // Adjust the step size between ticks
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  titleColor: "#ACBFD2",
                                  bodyColor: "#ACBFD2",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                },
                              },
                            }}
                          />
                        </div>
                      </Col>
                      <Col>
                        <h6>Avg-Score Coding</h6>
                        <div className="apti-stu">
                          <Line className="chart-stu"
                            data={{
                              labels: codingAvgScore.map((data) => data.month),
                              datasets: [
                                {
                                  data: codingAvgScore.map((data) => data.avg_score),
                                  borderColor: "rgba(75,192,192,1)",
                                  backgroundColor: "rgba(75,192,192,0.4)",
                                  fill: false,
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              scales: {
                                y: {
                                  min: 0,
                                  max: 100,
                                  ticks: {
                                    font: {
                                      size: 12, // Adjust the font size of the Y-axis labels
                                    },
                                    stepSize: 10, // Adjust the step size between ticks
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  titleColor: "#ACBFD2",
                                  bodyColor: "#ACBFD2",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                },
                              },
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Row>
              </Container>
            </div>

            <p></p>

            <div
              className="progress-section-stu"
            >
              <Container className="container-stu">
                <Row>
                  <div
                    className="assessment-taken-stu"
                  >
                    <div
                      className="test1"
                    >
                      <h6 className="h6-report-stu" >Attendance</h6>
                    </div>
                    <Row>
                      <Col>
                        <h6>% of Forenoon</h6>
                        <div className="apti-stu">
                          <Line
                            className="chart-stu"
                            data={{
                              labels: testPerformance.map((data) => data.month),
                              datasets: [
                                {
                                  data: testPerformance.map((data) => data.avg_total_score1),
                                  borderColor: "rgba(75,192,192,1)",
                                  backgroundColor: "rgba(75,192,192,0.4)",
                                  fill: false,
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false, // Important for setting specific width and height
                              scales: {
                                y: {
                                  min: 0,
                                  max: 100,
                                  ticks: {
                                    font: {
                                      size: 12, // Adjust the font size of the Y-axis labels
                                    },
                                    stepSize: 10, // Adjust the step size between ticks
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  titleColor: "#ACBFD2",
                                  bodyColor: "#ACBFD2",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                },
                              },
                            }}
                          />
                        </div>
                      </Col>
                      <Col>
                        <h6>% of Afternoon</h6>
                        <div className="apti-stu">
                          <Line
                            className="chart-stu"
                            data={{
                              labels: testPerformance.map((data) => data.month),
                              datasets: [
                                {
                                  data: testPerformance.map((data) => data.avg_total_score1),
                                  borderColor: "rgba(75,192,192,1)",
                                  backgroundColor: "rgba(75,192,192,0.4)",
                                  fill: false,
                                  tension: 0.4,
                                },
                              ],
                            }}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false, // Important for setting specific width and height
                              scales: {
                                y: {
                                  min: 0,
                                  max: 100,
                                  ticks: {
                                    font: {
                                      size: 12, // Adjust the font size of the Y-axis labels
                                    },
                                    stepSize: 10, // Adjust the step size between ticks
                                  },
                                },
                              },
                              plugins: {
                                legend: {
                                  display: false,
                                },
                                tooltip: {
                                  titleColor: "#ACBFD2",
                                  bodyColor: "#ACBFD2",
                                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                                },
                              },
                            }}
                          />
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Row>
              </Container>
            </div>
          </div>
        </div>
        <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

      </div>
    </div>
  );
};

export default Dashboard;
