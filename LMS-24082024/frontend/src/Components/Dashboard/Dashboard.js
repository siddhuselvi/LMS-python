import React, { useEffect, useRef, useMemo, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, FormControl, InputGroup } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faMagnifyingGlass,
  faArrowRightLong,
  faCog,
} from "@fortawesome/free-solid-svg-icons";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";
import Footer from "../../Footer/Footer";
import {
  getTotalTestCount,
  getAvgScoreByDepartment,
  getAvgScoreByDepartmentCoding,
  getMaxScoreByDepartment,
  getMaxScoreByDepartmentCoding,
  getTotalCompanyCount,
  upcommingInterviewApi,
  interviewStatusCountApi,
  interviewResultStudntApi,
  interviewResultStudntEmailAddressApi,
  getcollegeApi,
  getOffer_College_id_API,
  getTotalOffers_college_id_API,
  getRequestCount_college_id_API,
  getAnnouncementMasterApi,
  getdepartmentApi,
  getcompanyApi,
} from "../../api/endpoints";
import { Link } from "react-router-dom";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { format } from 'date-fns';


Chart.register(...registerables);

const Dashboard = () => {
  const [upcoming, setUpcoming] = useState([]); /*changes */
  const [totalTestCount, setTotalTestCount] = useState(null);
  const [totalComapnyCount, setTotalCompanyCount] = useState(null);
  const [collegeId, setCollegeID] = useState(1);
  const [selectedOption, setSelectedOption] = useState('Aptitude');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [avgAptitudeScore, setAvgAptitudeScore] = useState([]);
  const [avgCodingScore, setAvgCodingScore] = useState([]);
  const [clgTopper, setClgTopper] = useState([]);
  const [selectedOptionClgTop, setSelectedOptionClgTop] = useState('MCQ');
  const [clgTopperCode, setClgTopperCode] = useState([]);
  const [upcomming, setUpcomming] = useState([]);
  const [offerStatus, setOfferStatus] = useState([]);
  const [offerPackage, setOfferPackage] = useState([]);
  const [studentCmpyDet, setStudentCmpyDet] = useState([]);
  const [college, setCollege] = useState([]);
  const [assessmentData1, setAssessmentData1] = useState([]);
  const [totalOffers, setTotalOffers] = useState(null);
  const [totalRequest, setTotalRequest] = useState(null);
  const [department, setDepartment] = useState([]);
  const [deptID, setDeptID] = useState(1);
  const [companies, setCompanies] = useState([]);
  const [cmpyID, setCmpyID] = useState(1);



  const fetchCollege = async () => {
    try {
      const response = await getcollegeApi(); // Await the promise
      console.log('College: ', response);
      setCollege(response); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchDepartment = async () => {
    try {
      const response = await getdepartmentApi(); // Await the promise
      console.log('Departments: ', response);
      setDepartment(response); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
  };

  
  const fetchCompanies = async () => {
    try {
      const response = await getcompanyApi(); // Await the promise
      console.log('Companies: ', response);
      setCompanies(response); // Access data directly
    } catch (err) {
      console.log(err.message);
    }
  };



  const fetchTotalOffers = async () => {
    try {
      const response = await getTotalOffers_college_id_API(collegeId);
      console.log('Total Offers: ', response);
      console.log('Total Offers...1: ', response.number_of_offers);
      setTotalOffers(response.number_of_offers);
    } catch (err) {
      console.log(err.message);
    }
  };


  const fetchRequestCount = async () => {
    try {
      const response = await getRequestCount_college_id_API(collegeId);
      console.log('Total Request: ', response);
      console.log('Total Request...1: ', response.request_count);
      setTotalRequest(response.request_count);
    } catch (err) {
      console.log(err.message);
    }
  };



  const fetchTestNameCount = async () => {
    try {
      const response = await getTotalTestCount(collegeId); // Await the promise
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

  const aptitudeAvgScore = async () => {
    try {
      const response = await getAvgScoreByDepartment(collegeId, selectedDate);
      console.log('Avg score of Department: ', response);
      setAvgAptitudeScore(response);
    } catch (err) {
      console.log(err.message);
    }
  };

  const getCodingAvgCore = async () => {
    try {
      console.log('coding avg entering........');
      const response = await getAvgScoreByDepartmentCoding(collegeId, selectedDate);
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


  const getUpcomming = () => {
    upcommingInterviewApi(collegeId, deptID)
      .then(data => {
        setUpcomming(data);
      })
      .catch(error => console.error('Error fetching getting upcomming interview:', error));
  };

  const getOfferStatus = () => {
    interviewStatusCountApi(collegeId, cmpyID)
      .then(data => {
        setOfferStatus(data);
      })
      .catch(error => console.error('Error fetching getting upcomming interview:', error));
  };

  const getOfferPackage = () => {
    interviewResultStudntApi(collegeId)
      .then(data => {
        setOfferPackage(data);
      })
      .catch(error => console.error('Error fetching getting upcomming interview:', error));
  };


  const getStudentCmpyDet = () => {
    interviewResultStudntEmailAddressApi(collegeId)
      .then(data => {
        setStudentCmpyDet(data);
      })
      .catch(error => console.error('Error fetching getting upcomming interview:', error));
  };


  const [announcements, setAnnouncements] = useState([]); // Define announcements state


  const fetchAnnouncements = () => {
    getAnnouncementMasterApi()
      .then(data => {
        setAnnouncements(data);
      })
      .catch(error => console.error('Error fetching announcements:', error));
  };


  // Use useEffect to call fetchTestNameCount when collegeId changes
  useEffect(() => {
    fetchCollege();
    fetchTestNameCount();
    fetchCompanyCount();
    fetchTotalOffers();
    fetchRequestCount();
    aptitudeAvgScore();
    getCodingAvgCore();
    getCollegeTopper();
    getOfferStatus();
    fetchData();
    getCollegeTopperCoding();
    getUpcomming();
    getOfferPackage();
    getStudentCmpyDet();
    fetchAnnouncements();
    fetchDepartment();
    fetchCompanies();
  }, [collegeId, selectedDate, deptID, cmpyID]);



  const fetchData = () => {
    getOffer_College_id_API(collegeId)
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




  const pieChartRef = useRef(null);

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
          labels: assessmentData1.map((data) => data.type),
          datasets: [
            {
              data: assessmentData1.map((data) => data.percentage),
              backgroundColor: assessmentData1.map((data) => data.color
              ),
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
              labels: {
                color: "rgb(157, 190, 210", // Set legend text color to rgb(157, 190, 210
              },
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
  }, [assessmentData1]);

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
      default:
        return "#6c757d";
    }
  }

  return (
    <div
      className="App"
      style={{ backgroundColor: "#323B44", color: "#ACBFD2" }}
    >
      <div>
        <select
          className="college-select"
          onChange={(e) => setCollegeID(e.target.value)}
          value={collegeId}
        >
          {college.map((item) => (
            <option key={item.id} value={item.id}>
              {item.college}
            </option>
          ))}
        </select>
      </div>

      <div>
        <section className="card-list">

          <div className="card-lms card-test-count">
            <div className="card-content-wrapper">
              <h6 className="card-title">Total Test Count</h6>
              <p className="card-content">{totalTestCount}</p>
            </div>
          </div>
          <div className="card-lms card-companies">
            <div className="card-content-wrapper">
              <h2 className="card-title">Total Companies</h2>
              <p className="card-content">{totalComapnyCount}</p>
            </div>
          </div>
          <div className="card-lms card-offers">
            <div className="card-content-wrapper">
              <h2 className="card-title">Total No Of Offers</h2>
              <p className="card-content">{totalOffers}</p>
            </div>
          </div>
          <div className="card-lms card-requests">
            <div className="card-content-wrapper">
              <h2 className="card-title">Requests</h2>
              <p className="card-content">{totalRequest}</p>
            </div>
          </div>

          <Container>
            <Row className="my-row">
              <Col className="border p-3 department-attendance col-department-attendance">
                <div className="test test-report">
                  <h6 className="h6-bold" style={{ color: "rgb(157, 190, 210)" }}>TEST REPORT</h6>
                  <div className="date-picker-wrapper">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      dateFormat="dd-MMM-yyyy"
                      className='input-date-custom1'
                    />
                  </div>
                  {/* 
          <select className="graph-type-select">
            <option value="">Graph Type</option>
          </select> 
        */}
                </div>

                <div className="score-charts">
                  <div className="chart-wrapper">
                    <p className="chart-title">Avg Score-Aptitude</p>
                    <div className="chart-container">
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

                  <div className="chart-wrapper">
                    <p className="chart-title">Avg Score-Coding</p>
                    <div className="chart-container">
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
                </div>
              </Col>

              <Col className="border p-3 department-attendance col-department-attendance">
                <div className="test test-college-topper">
                  <h6 className="h6-bold" style={{ color: "rgb(157, 190, 210)" }}>COLLEGE TOPPER</h6>
                  <select
                    onChange={(e) => setSelectedOptionClgTop(e.target.value)}
                    value={selectedOptionClgTop}
                    className="college-topper-select"
                  >
                    <option value="MCQ">MCQ</option>
                    <option value="Coding">Coding</option>
                  </select>
                </div>

                {selectedOptionClgTop === 'MCQ' && (
                  <table className="table college-topper-table">
                    <thead>
                      <tr>
                        <th style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }} className="table-header">Name</th>
                        <th style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }} className="table-header">Department</th>
                        <th style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }} className="table-header">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clgTopper.map((item) => (
                        <tr key={item.id}>
                          <td style={{
                            color: "#a7bfd2",
                            backgroundColor: "#3e4954",
                          }} className="table-cell">{item.student_name}</td>
                          <td style={{
                            color: "#a7bfd2",
                            backgroundColor: "#3e4954",
                          }} className="table-cell">{item.department}</td>
                          <td style={{
                            color: "#a7bfd2",
                            backgroundColor: "#3e4954",
                          }} className="table-cell">{item.max_total_score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                {selectedOptionClgTop === 'Coding' && (
                  <table className="table college-topper-table">
                    <thead>
                      <tr>
                        <th style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }} className="table-header">Name</th>
                        <th style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }} className="table-header">Department</th>
                        <th style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }} className="table-header">Score</th>
                      </tr>
                    </thead>
                    <tbody>
                      {clgTopperCode.map((item) => (
                        <tr key={item.id}>
                          <td style={{
                            color: "#a7bfd2",
                            backgroundColor: "#3e4954",
                          }} className="table-cell">{item.student_name}</td>
                          <td style={{
                            color: "#a7bfd2",
                            backgroundColor: "#3e4954",
                          }} className="table-cell">{item.department}</td>
                          <td style={{
                            color: "#a7bfd2",
                            backgroundColor: "#3e4954",
                          }} className="table-cell">{item.max_total_score}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}

                <div />
              </Col>
            </Row>
          </Container>

          <div className="news-updates-training">
            <div className="news-updates-header">
              <h6 className="h6-bold">NEWS UPDATES</h6>
            </div>
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

          <div className="container">
            <div className="row">
              <div className="col-dashboard">
                <h6 className="h6-bold">OFFER CHART</h6>
                <div className="pie-chart-container">
                  <canvas ref={pieChartRef}></canvas>
                </div>
                {/*} <div className="select-container">
            <select name="Data" className="select-dropdown">
              <option value="">Month</option>
            </select>
            <select name="" className="select-dropdown">
              <option value="">Graph Type</option>
            </select>
          </div>*/}
              </div>
              <div className="col-dashboard">
                <div className="test2">
                  <h6 className="h6-bold">UPCOMING INTERVIEW</h6>

                  <select
                    className="select-dropdown"
                    onChange={(e) => setDeptID(e.target.value)}
                    value={deptID}
                  >
                    {department.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.department}
                      </option>
                    ))}
                  </select>


                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Test</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Registered</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {upcomming.map((item) => (
                      <tr key={item.id}>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.company_id__company_name}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.student_count}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.dtm_interview}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="col-dashboard">
                <div className="test2">
                  <h6 className="h6-bold">OFFER STATUS</h6>

                  <select
                    className="select-dropdown"
                    onChange={(e) => setCmpyID(e.target.value)}
                    value={cmpyID}
                  >
                    {companies.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.company_name}
                      </option>
                    ))}
                  </select>

                </div>
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Status</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Count</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offerStatus.map((item) => (
                      <tr key={item.id}>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.status}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.status_count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* <Container>
            <Row>
              <Col
                className="border p-3 assessment-taken"
                style={{ marginRight: "8px", marginTop: "20px" }}
              >
                <h6
                  style={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  OFFER CHART
                </h6>
                <div
                  style={{
                    width: "10px",
                    height: "20px",
                    marginBottom: "10px",
                  }}
                ></div>
                <canvas ref={pieChartRef} />
                <br />
                <div
                  className="month"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    backgroundColor: "#3e4954",
                  }}
                >
                  <select
                    name="Data"
                    id=""
                    style={{
                      color: "rgb(157,190,210)",
                      borderRadius: "10px",
                      backgroundColor: "#3e4954",
                    }}
                  >
                    <option value="">Month</option>
                  </select>
                  <select
                    name=""
                    id=""
                    style={{
                      color: "rgb(157,190,210)",
                      borderRadius: "10px",
                      backgroundColor: "#3e4954",
                    }}
                  >
                    <option value="">Graph Type</option>
                  </select>
                </div>
              </Col>
              <Col
                className="border p-3 assessment-taken"
                style={{
                  marginRight: "8px",
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
                    name="Data"
                    id=""
                    style={{
                      color: "rgb(157,190,210)",
                      fontWeight: "bold",
                      fontWeight: "700",
                      borderRadius: "10px",
                      backgroundColor: "#3e4954",
                    }}
                  >
                    <option value="">DEPT</option>
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
                        Test
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }}
                      >
                        REGISTERED
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
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
                style={{ marginRight: "8px", marginTop: "20px" }}
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
                    name="Data"
                    id=""
                    style={{
                      color: "rgb(157,190,210)",
                      fontWeight: "bold",
                      fontWeight: "700",
                      borderRadius: "10px",
                      backgroundColor: "#3e4954",
                    }}
                  >
                    <option value="">COMPANY</option>
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
          </Container>   */}

          {/* <container>
            <Row>
              <Col
                className="border p-3 assessment-taken"
                style={{
                  marginBottom: "20px",
                  marginRight: "20px",
                  backgroundColor: "#3e4954",
                  color: "#a7bfd2",
                  marginTop: "20px",
                  marginLeft: "20px",
                  borderRadius: "10px",
                }}
              >
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
                        Name
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }}
                      >
                        Company
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
                        Offer Date
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }}
                      >
                        Package
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {offerPackage.map((item) => (
                      <tr key={item.id}>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.student_id__students_name}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.company_id__company_name}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.student_id__department_id__department}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.dtm_offer}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.package}
                        </td>
                      </tr>

                    ))}
                  </tbody>
                </table>
              </Col></Row>
            <Row>
              <Col
                className="border p-3 assessment-taken2"
                style={{
                  width: "900px",
                  marginBottom: "20px",
                  backgroundColor: "#3e4954",
                  color: "#a7bfd2",
                  marginTop: "20px",
                  marginLeft: "10px",
                  borderRadius: "10px",
                }}
              >
                <table className="table" style={{ height: "100%" }}>
                  <thead>
                    <tr>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }}
                      >
                        Name
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }}
                      >
                        Company
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }}
                      >
                        Email
                      </th>
                      <th
                        style={{
                          fontWeight: "bold",
                          backgroundColor: "#3e4954",
                          color: "#a7bfd2",
                        }}
                      >
                        Adress
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentCmpyDet.map((item) => (
                      <tr key={item.id}>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {" "}
                          {item.student_id__students_name}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.company_id__company_name}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.student_id__email_id}
                        </td>
                        <td
                          style={{
                            backgroundColor: "#3e4954",
                            color: "#a7bfd2",
                          }}
                        >
                          {item.company_id__company_profile}
                        </td>
                      </tr>

                    ))}

                  </tbody>
                </table>
              </Col>
            </Row>
          </container> */}

          <div className="container">
            <div className="row">
              <div className="col-dashboard-pkg">
                <table className="table">
                  <thead>
                    <tr>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Name</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Company</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Department</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Offer Date</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Package</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offerPackage.map((item) => (
                      <tr key={item.id}>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.student_id__students_name}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.company_id__company_name}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.student_id__department_id__department}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.dtm_offer}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.package}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col-dashboard-pkg col-wide-dashboard-pkg">
                <table className="table" style={{ height: '100%' }}>
                  <thead>
                    <tr>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Name</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Company</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Email</th>
                      <th style={{
                        fontWeight: "bold",
                        backgroundColor: "#3e4954",
                        color: "#a7bfd2",
                      }} className="table-header">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentCmpyDet.map((item) => (
                      <tr key={item.id}>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.student_id__students_name}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.company_id__company_name}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.student_id__email_id}</td>
                        <td style={{
                          color: "#a7bfd2",
                          backgroundColor: "#3e4954",
                        }} className="table-cell">{item.company_id__company_profile}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        <div className="progress-section">
          <div className="assessment-taken1">
            <div className="buttons-foo">
              <button className="button">
                <Link to={'/reports'} className="link">
                  REPORTS
                </Link>
                <FontAwesomeIcon icon={faArrowRightLong} size="lg" className="link" />
              </button>
              <button className="button">
                ANNOUNCEMENT
                <FontAwesomeIcon icon={faArrowRightLong} size="lg" className="link" />
              </button>
              <button className="button">
                <Link to={'/database/upload-student'} className="link">
                  DATABASE
                </Link>
                <FontAwesomeIcon icon={faArrowRightLong} size="lg" className="link" />
              </button>
              <button className="button">
                STUDENT'S REQUESTS
                <FontAwesomeIcon icon={faArrowRightLong} size="lg" className="link" />
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>

  );
};

export default Dashboard;
