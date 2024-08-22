import React, { useEffect, useRef, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Form } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";
import {
  getTotalTestCount,
  getEligibleStudent_Registered_CountApi,
  getAvgScoreByDepartment,
  getAvgScoreByDepartmentCoding,
  getMaxScoreByDepartment,
  getMaxScoreByDepartmentCoding,
  getTotalCompanyCount,
  getDistinctTestNameCountToday,
  getAvgTotalPresent,
  getAvgTotalAbsent,
  getcollegeApi,
  upcommingInterviewApi,
  interviewStatusCountApi,
  interviewResultStudntApi,
  interviewResultStudntEmailAddressApi,
  totalNoOfOffersApi,
  getStudentsRequestApi,
  getAnnouncementMasterApi,
  getTrainingfeedbackApi,
  getTrainingReportApi,
  getdepartmentApi,
  getcompanyApi,
  getcandidatesApi_ALL,
} from "../../api/endpoints";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';
import Sidebar from './Sidebar';
import CalendarComponent from './Calender';
import EventForm from './EventForm';
import EventList from './EventList';


Chart.register(...registerables);

const Dashboard = ({ collegeName, username }) => {
  const [totalTestCount, setTotalTestCount] = useState(null);
  const [totalComapnyCount, setTotalCompanyCount] = useState(null);
  const [collegeId, setCollegeID] = useState(null);
  const [selectedOption, setSelectedOption] = useState('Aptitude');
  const [selectedDateSlicer, setSelectedDateSlicer] = useState(new Date());
  const [avgAptitudeScore, setAvgAptitudeScore] = useState([]);
  const [avgCodingScore, setAvgCodingScore] = useState([]);
  const [clgTopper, setClgTopper] = useState([]);
  const [selectedOptionClgTop, setSelectedOptionClgTop] = useState('MCQ');
  const [clgTopperCode, setClgTopperCode] = useState([]);
  const [avgPresent, setAvgPresent] = useState([]);
  const [avgAbsent, setAvgAbsent] = useState([]);
  const [upcomming, setUpcomming] = useState([]);
  const [offerStatus, setOfferStatus] = useState([]);
  const [totOffers, setTotOffers] = useState(null);
  const [totRequest, setTotRequest] = useState(null);


  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDetails, setEventDetails] = useState([]);
  const [trainingFeedbackData, setTrainingFeedbackData] = useState([]);
  const [deptId, setDeptId] = useState([]);
  const [departmentId, setDepartmentId] = useState(null);
  const [company, setCompany] = useState([]);
  const [cmpyId, setCmpyId] = useState(null);
  const [assessmentData1, setAssessmentData1] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [assessmentData, setAssessmentData] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [trainingFeedbackData1, setTrainingFeedbackData1] = useState([]);





  const fetchDepartmentId = async () => {
    try {
      const response = await getdepartmentApi(); // Await the promise
      console.log('Departments: ', response);
      setDeptId(response); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchCompany = async () => {
    try {
      const response = await getcompanyApi(); // Await the promise
      console.log('Companies: ', response);
      setCompany(response); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
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

  const getCollegeId = () => {
    getcollegeApi()
      .then(college => {
        const filteredCandidates = college.filter(clg => {
          console.log("Collge CLG : ", collegeName)
          console.log("user name CLG: ", username)
          return clg.college === collegeName
        });

        if (filteredCandidates.length > 0) {
          setCollegeID(filteredCandidates[0].id);
          console.log('setCollegeID: ', filteredCandidates);
        }
      })
      .catch(error => {
        console.error('Error fetching candidates:', error);
      });
  };


  const [announcements, setAnnouncements] = useState([]); // Define announcements state

  const fetchAnnouncements = () => {
    getAnnouncementMasterApi()
      .then(data => {
        setAnnouncements(data);
      })
      .catch(error => console.error('Error fetching announcements:', error));
  };




  const fetchTestNameCount = async () => {
    try {
      const response = await getDistinctTestNameCountToday(collegeId); // Await the promise
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

  const fetchTotalOffer = async () => {
    try {
      const response = await totalNoOfOffersApi(collegeId); // Await the promise
      console.log('response of total test count: ', response);
      setTotOffers(response.total_offers); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
  };


  const getRequests = async () => {
    try {
      const response = await getStudentsRequestApi();
      console.log('Students Request: ', response.pending_requests);
      setTotRequest(response.pending_requests);
    } catch (err) {
      console.log(err.message);
    }
  };




  const aptitudeAvgScore = async () => {
    try {
      const response = await getAvgScoreByDepartment(collegeId, selectedDateSlicer);
      console.log('Avg score of Department: ', response);
      setAvgAptitudeScore(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  const CodingAvgScore = async () => {
    try {
      const response = await getAvgScoreByDepartmentCoding(collegeId, selectedDateSlicer);
      console.log('Coding Avg score of Department: ', response);
      setAvgCodingScore(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getCollegeTopper = () => {
    getMaxScoreByDepartment(collegeId)
      .then(data => {
        setClgTopper(data);
      })
      .catch(error => console.error('Error fetching getting College Topper:', error));
  };

  const getCollegeTopperCoding = () => {
    getMaxScoreByDepartmentCoding(collegeId)
      .then(data => {
        setClgTopperCode(data);
      })
      .catch(error => console.error('Error fetching getting College Topper:', error));
  };


  {/*}

  const getTotalPresentAttendance = async () => {
    try {
      const response = await getAvgTotalPresent();
      console.log('Avg Attendance of Present: ', response);
      setAvgPresent(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getTotalAbsentAttendance = async () => {
    try {
      const response = await getAvgTotalAbsent();
      console.log('Coding Avg Attendance of Absent: ', response);
      setAvgAbsent(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  */}

  const getUpcomming = () => {
    upcommingInterviewApi(collegeId, departmentId)
      .then(data => {
        setUpcomming(data);
      })
      .catch(error => console.error('Error fetching getting upcomming interview:', error));
  };

  const getOfferStatus = () => {
    interviewStatusCountApi(collegeId, cmpyId)
      .then(data => {
        setOfferStatus(data);
      })
      .catch(error => console.error('Error fetching getting upcomming interview:', error));
  };

  


  

  const fetchData = () => {
    getcandidatesApi_ALL()
      .then(data => {
        console.log("response", data);

        const totalOffers = data.reduce((acc, item) => acc + item.number_of_offers, 0);
        const itOffers = data.reduce((acc, item) => acc + item.it_of_offers, 0);
        const coreOffers = data.reduce((acc, item) => acc + item.core_of_offers, 0);
        const otherCount = data.filter(item => item.number_of_offers === 0).length;

        console.log("total", totalOffers);
        console.log("it", itOffers);
        console.log("core", coreOffers);
        console.log("others count", otherCount);

        const assessmentData = [
          { type: 'IT Offers', percentage: Number(((itOffers / totalOffers) * 100).toFixed(2)), color: 'blue' },
          { type: 'Core Offers', percentage: Number(((coreOffers / totalOffers) * 100).toFixed(2)), color: 'green' },
        ];

        if (otherCount > 0) {
          assessmentData.push({
            type: 'Others',
            percentage: Number(((otherCount / (totalOffers + otherCount)) * 100).toFixed(2)),
            color: 'grey',
          });
        }

        setAssessmentData1(assessmentData);
      })
      .catch(error => console.error('Error fetching data:', error));
  };



  const fetchCourseCompletion = () => {
    getTrainingfeedbackApi()
      .then(data => {
        console.log("API Data:", data);
        // Filter data based on college name if needed
        const filteredData = data.filter(item => item.college_id === collegeName);
        console.log("filtered data", filteredData);

        // Extract unique trainers for the dropdown
        const uniqueTrainers = [...new Set(filteredData.map(item => item.trainer_id))];
        setTrainers(uniqueTrainers);

        setTrainingFeedbackData1(filteredData);
      })
      .catch(error => console.error('Error fetching feedback data:', error));
  };


  useEffect(() => {
    if (selectedTrainer) {
      const filteredData = trainingFeedbackData.filter(item => item.trainer_id === selectedTrainer);
      const totalTopics = filteredData.length;

      const completedCount = filteredData.filter(item => item.completion_status === 'completed').length;
      const ongoingCount = filteredData.filter(item => item.completion_status === 'On Going').length;
      const scheduledCount = filteredData.filter(item => item.completion_status === 'Scheduled').length;
      const pendingCount = filteredData.filter(item => item.completion_status === 'Pending').length;

      const assessmentData = [
        { type: 'Completed', percentage: ((completedCount / totalTopics) * 100).toFixed(2), color: 'green' },
        { type: 'On Going', percentage: ((ongoingCount / totalTopics) * 100).toFixed(2), color: 'blue' },
        { type: 'Scheduled', percentage: ((scheduledCount / totalTopics) * 100).toFixed(2), color: 'orange' },
        { type: 'Pending', percentage: ((pendingCount / totalTopics) * 100).toFixed(2), color: 'red' },
      ];

      setAssessmentData(assessmentData);
    }
  }, [selectedTrainer, trainingFeedbackData]);

  useEffect(() => {
    if (pieChartRef.current && assessmentData.length) {
      const pieChart = new Chart(pieChartRef.current, {
        type: 'doughnut',
        data: {
          labels: assessmentData.map((data) => data.type),
          datasets: [
            {
              data: assessmentData.map((data) => data.percentage),
              backgroundColor: assessmentData.map((data) => data.color),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) =>
                  `${tooltipItem.label}: ${tooltipItem.raw}%`,
              },
            },
          },
          cutout: '50%',
        },
      });

      return () => {
        pieChart.destroy();
      };
    }
  }, [assessmentData]);






  // Use useEffect to call fetchTestNameCount when collegeId changes
  useEffect(() => {
    fetchTestNameCount();
    fetchCompanyCount();
    aptitudeAvgScore();
    CodingAvgScore();
    getCollegeTopper();
    getCollegeTopperCoding();
    getUpcomming();
    getOfferStatus();
    fetchTotalOffer();
    getRequests();
    fetchDepartmentId();
    fetchCompany();
    fetchEventDataForDate(selectedDate);
    getCollegeId();
    fetchAnnouncements();
    fetchData();
    fetchCourseCompletion();
  }, [selectedDate, collegeName, username, collegeId, selectedDateSlicer, departmentId, cmpyId]);



  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
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
    scales: {
      x: {
        ticks: {
          color: "#ACBFD2",
        },
        title: {
          display: true,
          color: "#ACBFD2",
        },
      },
      y: {
        min: 0,
        max: 100,
        ticks: {
          color: "#ACBFD2",
          stepSize: 10,
          callback: function (value) {
            if (value % 10 === 0) {
              return value;
            }
          },
        },
        title: {
          display: true,
          color: "#ACBFD2",
        },
      },
    },
  };





  const attendanceData = useMemo(
    () => [
      { department: "MECH", x: 1, y: 75, color: "white" },
      { department: "EEE", x: 2, y: 85, color: "white" },
      { department: "CSE", x: 3, y: 95, color: "red" },
      { department: "IT", x: 3, y: 95, color: "red" },
      { department: "ding-category 1", x: 3, y: 95, color: "red" },
      { department: "MECH", x: 3, y: 95, color: "red" },
      { department: "EEE", x: 3, y: 95, color: "red" },
      { department: "CSE", x: 3, y: 95, color: "red" },
      { department: "IT", x: 3, y: 95, color: "red" },
    ],
    []
  );



  const pieChartRef = useRef(null);
  const pieChartRef1 = useRef(null);

  useEffect(() => {
    const getColor = (variant) => {
      switch (variant) {
        case "danger":
          return "#0abde3";
        case "warning":
          return "#10ac84";
        case "primary":
          return "#5352ed";
        case "info":
          return "#feca57";
        case "success":
          return "#f368e0";
        default:
          return "#6c757d";
      }
    };

    if (pieChartRef.current) {
      const pieChart = new Chart(pieChartRef.current, {
        type: "doughnut",
        data: {
          labels: assessmentData.map((data) => data.department),
          datasets: [
            {
              data: assessmentData.map((data) => data.percentage),
              backgroundColor: assessmentData.map((data) =>
                getColor(data.color)
              ),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) =>
                  `${tooltipItem.label}: ${tooltipItem.raw}%`,
              },
            },
          },
          cutout: "50%",
        },
      });
      return () => {
        pieChart.destroy();
      };
    }
  }, [assessmentData]);


  // Render the pie chart whenever assessmentData1 changes
  useEffect(() => {
    if (pieChartRef1.current && assessmentData1.length) {
      const pieChart1 = new Chart(pieChartRef1.current, {
        type: 'doughnut',
        data: {
          labels: assessmentData1.map((data) => data.type),
          datasets: [
            {
              data: assessmentData1.map((data) => data.percentage),
              backgroundColor: assessmentData1.map((data) => data.color),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            tooltip: {
              callbacks: {
                label: (tooltipItem) =>
                  `${tooltipItem.label}: ${tooltipItem.raw}%`,
              },
            },
          },
          cutout: '50%',
        },
      });

      return () => {
        pieChart1.destroy();
      };
    }
  }, [assessmentData1]);

  function getColor(variant) {
    switch (variant) {
      case "danger":
        return "#70a1ff";
      case "warning":
        return "#1e90ff";
      case "primary":
        return "#badc58";
      case "info":
        return "#f6e58d";
      case "success":
        return "#e74c3c";
      default:
        return "#6c757d";
    }
  }

  return (
    <div>
      <section className="card-list" style={{ backgroundColor: "#323B44" }}>
        <div
          className="card"
          style={{
            borderLeft: "6px solid #3742fa",
            backgroundColor: "#323B44",
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
            backgroundColor: "#323B44",
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
            backgroundColor: "#323B44",
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
              {totOffers}
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
            backgroundColor: "#323B44",
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
              {totRequest}
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





        <Container>
          <Row md={12}>
            <Col className="border p-3 department-attendance" style={{ marginTop: "20px" }}>
              <div className="test" style={{ backgroundColor: "#3e4954", padding: "10px" }}>
                <h6 style={{ fontWeight: "700", fontSize: "18px" }}>Test Report</h6>
              </div>

              <div style={{ marginTop: "10px", marginBottom: "10px", padding: "10px" }}>
                <h5>Avg Score-Aptitude</h5>
                <div style={{ width: '250px', height: '150px' }}>
                  <Line
                    data={{
                      labels: avgAptitudeScore.map(data => data.department_name),
                      datasets: [
                        {
                          data: avgAptitudeScore.map(data => data.avg_score || 0),
                          borderColor: "rgba(75,192,192,1)",
                          backgroundColor: "rgba(75,192,192,0.4)",
                          fill: false,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px", marginBottom: "10px", padding: "10px" }}>
                <h5>Avg Score-Coding</h5>
                <div style={{ width: '250px', height: '150px' }}>
                  <Line
                    data={{
                      labels: avgCodingScore.map(data => data.department_name),
                      datasets: [
                        {
                          data: avgCodingScore.map(data => data.avg_score || 0),
                          borderColor: "rgba(75,192,192,1)",
                          backgroundColor: "rgba(75,192,192,0.4)",
                          fill: false,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </Col>

            <Col xs={12} md={6} className="border p-3 department-attendance" style={{ marginTop: "20px" }}>
              <div className="test" style={{ backgroundColor: "#3e4954", padding: "10px" }}>
                <h6 style={{ fontWeight: "700", fontSize: "18px" }}>ATTENDANCE</h6>
              </div>

              <div style={{ marginTop: "10px", marginBottom: "10px", padding: "10px" }}>
                <h5>Total Present</h5>
                <div style={{ width: '250px', height: '150px' }}>
                  <Line
                    data={{
                      labels: avgPresent.map(data => data.department_name),
                      datasets: [
                        {
                          data: avgPresent.map(data => data.total_present_avg || 0),
                          borderColor: "rgba(75,192,192,1)",
                          backgroundColor: "rgba(75,192,192,0.4)",
                          fill: false,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>

              <div style={{ marginTop: "10px", marginBottom: "10px", padding: "10px" }}>
                <h5>Total Absent</h5>
                <div style={{ width: '250px', height: '150px' }}>
                  <Line
                    data={{
                      labels: avgAbsent.map(data => data.department_name),
                      datasets: [
                        {
                          data: avgAbsent.map(data => data.total_absent_avg || 0),
                          borderColor: "rgba(75,192,192,1)",
                          backgroundColor: "rgba(75,192,192,0.4)",
                          fill: false,
                          tension: 0.4,
                        },
                      ],
                    }}
                    options={chartOptions}
                  />
                </div>
              </div>
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "3px",
                marginTop: "20px",
              }}
            >
              <h6
                style={{
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                COURSE COMPLETION
              </h6>

              <select
                value={selectedTrainer}
                onChange={(e) => setSelectedTrainer(e.target.value)}
                style={{
                  color: 'rgb(157,190,210)',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  backgroundColor: '#3e4954',
                  width: '100px',
                  padding: '10px',
                }}>
                <option value="">Trainers</option>
                {trainers.map((trainer, index) => (
                  <option key={index} value={trainer}>{trainer}</option>
                ))}
              </select>


              <div
                style={{
                  width: "10px",
                  height: "20px",
                  marginBottom: "10px",
                }}
              ></div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#3e4954",
                }}
              ></div>


              <canvas ref={pieChartRef} />
            </Col>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "8px",
                backgroundColor: "#3e4954",
                marginTop: "20px",
              }}
            >
              <div className="test2" style={{
                marginBottom: "20px",
                backgroundColor: "#3e4954",
              }}>
                <h6
                  style={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  College Topper
                </h6>
                <select
                  onChange={(e) => setSelectedOptionClgTop(e.target.value)}
                  value={selectedOptionClgTop}
                  style={{
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
                <table
                  className="table"
                  style={{ backgroundColor: "#3e4954" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          fontWeight: "bold",
                          color: "#9dafc1",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        Names
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          color: "#9dafc1",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        Department
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          color: "#9dafc1",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#3e4954" }}>
                    {clgTopper.map((item) => (
                      <tr key={item.id}>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }}
                        >
                          {item.student_name}
                        </td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }}
                        >
                          {item.department}

                        </td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
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
                <table
                  className="table"
                  style={{ backgroundColor: "#3e4954" }}
                >
                  <thead>
                    <tr>
                      <th
                        style={{
                          fontWeight: "bold",
                          color: "#9dafc1",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        Names
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          color: "#9dafc1",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        Department
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          color: "#9dafc1",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        Score
                      </th>
                    </tr>
                  </thead>
                  <tbody style={{ backgroundColor: "#3e4954" }}>
                    {clgTopperCode.map((item) => (
                      <tr key={item.id}>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }}
                        >
                          {item.student_name}
                        </td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }}
                        >
                          {item.department}

                        </td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }}
                        >
                          {item.max_total_score}
                        </td>
                      </tr>

                    ))}
                  </tbody>
                </table>
              )}

            </Col>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "8px",
                backgroundColor: "#3e4954",
                marginTop: "20px",
              }}
            >
              <div className="test2" style={{ marginBottom: "20px" }}>
                <h6
                  style={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#3e4954",
                  }}
                >
                  COURSE LIST
                </h6>
                <select
                  name="Data"
                  id=""
                  style={{
                    fontWeight: "bold",
                    fontWeight: "700",
                    borderRadius: "10px",
                    backgroundColor: "#3e4954",
                    marginRight: "20px",
                  }}
                >
                  <option value="">Skills</option>
                </select>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }}
                    >
                      Topic
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }}
                    >
                      Department
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }}
                    >
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#3e4954" }}>
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
        </Container>

        <Container>
          <Row>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "3px",
                marginTop: "20px",
              }}
            >
              <h6
                style={{
                  fontWeight: "bold",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                PLACEMENT
              </h6>
              <div
                style={{
                  width: "10px",
                  height: "20px",
                  marginBottom: "10px",
                }}
              ></div>
              <canvas ref={pieChartRef1} />
              <div
                className="month"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  backgroundColor: "#3e4954",
                  marginLeft: "20px",
                }}
              >
                <select
                  name="Data"
                  id=""
                  style={{
                    borderRadius: "10px",
                    backgroundColor: "#3e4954",
                    fontWeight: "bold",
                  }}
                >
                  <option value="">Month</option>
                </select>

              </div>
            </Col>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "8px",
                backgroundColor: "#3e4954",
                marginTop: "20px",
              }}
            >
              <div className="test2" style={{ marginBottom: "20px" }}>
                <h6
                  style={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Upcoming Interview
                </h6>
                <select
                  onChange={(e) => setDepartmentId(e.target.value)}
                  value={departmentId}
                  name="Data"
                  id=""
                  style={{
                    fontWeight: "bold",
                    fontWeight: "700",
                    borderRadius: "10px",
                    backgroundColor: "#3e4954",
                  }}
                >
                  {deptId.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.department}
                    </option>
                  ))}
                </select>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}
                    >
                      Test
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}
                    >
                      REGISTERED
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}
                    >
                      Dates
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomming.map((item) => (
                    <tr key={item.id}>
                      <td style={{
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}>
                        {item.company_id__company_name}
                      </td>

                      <td style={{
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}>
                        {item.student_count}
                      </td>

                      <td style={{
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}>
                        {item.dtm_interview}
                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </Col>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginLeft: "5px",
                marginTop: "20px",
                marginRight: "5px",
                backgroundColor: "#3e4954",
              }}
            >
              <div className="test2" style={{ marginBottom: "20px" }}>
                <h6
                  style={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  Offer Status
                </h6>
                <select
                  onChange={(e) => setCmpyId(e.target.value)}
                  value={cmpyId}
                  name="Data"
                  id=""
                  style={{
                    fontWeight: "bold",
                    fontWeight: "700",
                    borderRadius: "10px",
                    backgroundColor: "#3e4954",
                  }}
                >
                  {company.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.company_name}
                    </option>
                  ))}
                </select>
              </div>
              <table className="table">
                <thead>
                  <tr>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}
                    >
                      STATUS
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#a7bfd2",
                        backgroundColor: "#3e4954",
                      }}
                    >
                      COUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {offerStatus.map((item) => (
                    <tr key={item.id}>
                      <td
                        style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        {item.status}
                      </td>
                      <td
                        style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }}
                      >
                        {item.status_count}
                      </td>
                    </tr>

                  ))}
                </tbody>
              </table>
            </Col>
          </Row>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              margin: "50px 0px",
            }}
          >
            <button
              style={{
                fontWeight: "bold",
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "3e4954",
                color: "#a7bfd2",
                height: "90px",
                width: "300px",
              }}
            >
              <DatePicker
                selected={selectedDateSlicer}
                onChange={(date) => setSelectedDateSlicer(date)}
                dateFormat="dd-MMM-yyyy"
                className="input-date-picker"
              />
              {" "}
            </button>
            <button
              style={{
                fontWeight: "bold",
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "3e4954",
                color: "#a7bfd2",
                height: "90px",
                width: "300px",
              }}
            >
              SLICER!_@_SKILL BASED{" "}
            </button>
            {/*}  <button
              style={{
                fontWeight: "bold",
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "3e4954",
                color: "#a7bfd2",
                height: "90px",
                width: "300px",
              }}
            ></button>    */}
          </div>
          <div
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              textAlign: "center",
              backgroundColor: "3e4954",
              fontWeight: "bold",
            }}
          >
            <p>@Copyrights Campus Connection 2024. All rights reserved</p>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default Dashboard;
