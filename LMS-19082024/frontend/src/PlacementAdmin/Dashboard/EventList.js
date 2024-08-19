import React, { useEffect, useRef, useMemo ,useState} from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col,Form } from "react-bootstrap";
import { Line } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import "./Dashboard.css";
import {getcandidatesApi_ALL, getTrainingReportApi} from '../../api/endpoints'
Chart.register(...registerables);

const Dashboard = ({collegeName}) => {
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
  const [trainingFeedbackData, setTrainingFeedbackData] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState('');
  const [assessmentData, setAssessmentData] = useState([]);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchCourseCompletion = () => {
      getTrainingReportApi()
        .then(data => {
          // Filter data based on college name if needed
          const filteredData = data.filter(item => item.college_id === collegeName);
          console.log("filtered data", filteredData);
          
          // Extract unique trainers for the dropdown
          const uniqueTrainers = [...new Set(filteredData.map(item => item.trainer_id))];
          setTrainers(uniqueTrainers);

          setTrainingFeedbackData(filteredData);
        })
        .catch(error => console.error('Error fetching feedback data:', error));
    };

    fetchCourseCompletion();
  }, []);

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

  const pieChartRef1 = useRef(null);
  const [assessmentData1, setAssessmentData1] = useState([]);

  useEffect(() => {
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

    fetchData();
  }, []);

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
              367
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
              Total Test Count
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
              26
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
              46
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
              3
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
        <Container>
          <Row>
            <Col
              className="border p-3 department-attendance"
              style={{
                marginRight: "5px",
                marginTop: "20px",
                marginLeft: "8px",
                backgroundColor: "#ecf0f1",
              }}
            >
              <div
                className="test"
                style={{ backgroundColor: "#ecf0f1", padding: "10px" }}
              >
                <h6
                  style={{
                    fontWeight:"bold",
                  }}
                >
                  TEST REPORTS
                </h6>
                <select
                  name=""
                  id=""
                  style={{
                    fontWeight: "bold",
                    borderRadius: "8px",
                    backgroundColor: "#ecf0f1",
                    marginRight: "20px",
                  }}
                >
                  <option value="">Graph Type</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "10px",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <div style={{ marginRight: "60px", marginTop: "10px" }}>
                  <h5>Avq Score-Aptitude</h5>
                  <h6>70.5%</h6>
                </div>
                <div style={{ marginRight: "60px", marginTop: "10px" }}>
                  <h5>Avq Score-Coding</h5>
                  <h6>70.5%</h6>
                </div>
              </div>
              <Line
                data={{
                  labels: attendanceData.map((data) => data.department),
                  datasets: [
                    {
                      data: attendanceData.map((data) => data.percentage),
                      borderColor: "#ecf0f1",
                      backgroundColor: attendanceData.map((data) =>
                        getColor(data.color)
                      ),
                      fill: false,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      titleColor: "#2c3e50",
                      bodyColor: "#2c3e50",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "#2c3e50",
                      },
                      title: {
                        display: true,
                        color: "#2c3e50",
                      },
                    },
                    y: {
                      min: 30,
                      max: 80,
                      ticks: {
                        color: "#2c3e50",
                        stepSize: 10,
                        callback: function (value) {
                          if (value % 10 === 0) {
                            return value;
                          }
                        },
                      },
                      title: {
                        display: true,
                        color: "#2c3e50",
                      },
                    },
                  },
                }}
              />
            </Col>
            <Col
              className="border p-3 department-attendance"
              style={{
                marginRight: "5px",
                marginTop: "20px",
                marginLeft: "8px",
                backgroundColor: "#ecf0f1",
              }}
            >
              <div
                className="test"
                style={{ backgroundColor: "#ecf0f1", padding: "10px" }}
              >
                <h6
                  style={{
                    fontWeight:"bold",
                  }}
                >
                  ATTENDANCE
                </h6>
                <select
                  name=""
                  id=""
                  style={{
                    fontWeight: "bold",
                    borderRadius: "8px",
                    backgroundColor: "#ecf0f1",
                    marginRight: "20px",
                  }}
                >
                  <option value="">Graph Type</option>
                </select>
              </div>
              <div
                style={{
                  display: "flex",
                  marginTop: "10px",
                  marginBottom: "10px",
                  padding: "10px",
                }}
              >
                <div style={{ marginRight: "150px", marginTop: "10px" }}>
                  <h5>Present</h5>
                  <h6>70.5%</h6>
                </div>
                <div style={{ marginRight: "60px", marginTop: "10px" }}>
                  <h5>Abscent</h5>
                  <h6>70.5%</h6>
                </div>
              </div>
              <Line
                data={{
                  labels: attendanceData.map((data) => data.department),
                  datasets: [
                    {
                      data: attendanceData.map((data) => data.percentage),
                      borderColor: "#ecf0f1",
                      backgroundColor: attendanceData.map((data) =>
                        getColor(data.color)
                      ),
                      fill: false,
                      tension: 0.4,
                    },
                  ],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    legend: {
                      display: false,
                    },
                    tooltip: {
                      titleColor: "#2c3e50",
                      bodyColor: "#2c3e50",
                      backgroundColor: "rgba(0, 0, 0, 0.8)",
                    },
                  },
                  scales: {
                    x: {
                      ticks: {
                        color: "#2c3e50",
                      },
                      title: {
                        display: true,
                        color: "#2c3e50",
                      },
                    },
                    y: {
                      min: 30,
                      max: 80,
                      ticks: {
                        color: "#2c3e50",
                        stepSize: 10,
                        callback: function (value) {
                          if (value % 10 === 0) {
                            return value;
                          }
                        },
                      },
                      title: {
                        display: true,
                        color: "#2c3e50",
                      },
                    },
                  },
                }}
              />
            </Col>
          </Row>
        </Container>

        <Container>
          <Row>
          <Col className="border p-3 assessment-taken" style={{ marginTop: "20px", backgroundColor: "#ecf0f1" }}>
          <h6 style={{ fontWeight: "bold", textAlign: "center" }}>Placement</h6>
          <Form.Group controlId="trainerSelect">
            <Form.Label>Select Trainer</Form.Label>
            <Form.Control as="select" value={selectedTrainer} onChange={(e) => setSelectedTrainer(e.target.value)}>
              <option value="">Select a trainer</option>
              {trainers.map((trainer, index) => (
                <option key={index} value={trainer}>{trainer}</option>
              ))}
            </Form.Control>
          </Form.Group>
          <canvas ref={pieChartRef}></canvas>
        </Col>


            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "8px",
                backgroundColor: "#ecf0f1",
                marginTop: "20px",
              }}
            >
              <div className="test2" style={{ marginBottom: "20px" }}>
                <h6
                  style={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ecf0f1",
                  }}
                >
                  College Topper
                </h6>
                <select
                  name="Data"
                  id=""
                  style={{
                    fontWeight: "bold",
                    fontWeight: "700",
                    borderRadius: "10px",
                    backgroundColor: "#ecf0f1",
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
                        backgroundColor: "#ecf0f1",
                        color: "#2c3e50",
                      }}
                    >
                      Test
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#ecf0f1",
                        color: "#2c3e50",
                      }}
                    >
                      Department
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#ecf0f1",
                        color: "#2c3e50",
                      }}
                    >
                      Score
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#ecf0f1" }}>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Kumar
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      EEE
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      98
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Sonu
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      MECH
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      97
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Sheethal
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      IT
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      92
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Jaya
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      IT
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      89
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Krithi
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      CSE
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      88
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "8px",
                backgroundColor: "#ecf0f1",
                marginTop: "20px",
              }}
            >
              <div className="test2" style={{ marginBottom: "20px" }}>
                <h6
                  style={{
                    fontWeight: "bold",
                    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                    backgroundColor: "#ecf0f1",
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
                    backgroundColor: "#ecf0f1",
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
                        backgroundColor: "#ecf0f1",
                        color: "#2c3e50",
                      }}
                    >
                      Test
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#ecf0f1",
                        color: "#2c3e50",
                      }}
                    >
                      Department
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        backgroundColor: "#ecf0f1",
                        color: "#2c3e50",
                      }}
                    >
                      STATUS
                    </th>
                  </tr>
                </thead>
                <tbody style={{ backgroundColor: "#ecf0f1" }}>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Kumar
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      EEE
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      PENDING
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Sonu
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      MECH
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      ON GOING
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Sheethal
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      IT
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      COMPLETED
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Jaya
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      IT
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      SCHEDULED
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      Krithi
                    </td>
                    <td
                      style={{ color: "#2c3e50", backgroundColor: "#ecf0f1" }}
                    >
                      CSE
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      PENDING
                    </td>
                  </tr>
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
            backgroundColor: "#ecf0f1",
          }}
        >
          <h6
            style={{
              fontWeight: "bold",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
           Placement
          </h6>
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
              backgroundColor: "#ecf0f1",
            }}
          ></div>
          <canvas ref={pieChartRef1} />
        </Col>
           
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginRight: "8px",
                backgroundColor: "#ecf0f1",
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
                    fontWeight: "bold",
                    fontWeight: "700",
                    borderRadius: "10px",
                    backgroundColor: "#ecf0f1",
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
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      Test
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      REGISTERED
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      Dates
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      TCS
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      300
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      3-May
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      ACCENTURE
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      200
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      5-May
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      WIPRO
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      12
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      6-May
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      HEXAWARE
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      43
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      8-May
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      BRITANNIA
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      82
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      10-May
                    </td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col
              className="border p-3 assessment-taken"
              style={{
                marginLeft: "5px",
                marginTop: "20px",
                marginRight: "5px",
                backgroundColor: "#ecf0f1",
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
                  name="Data"
                  id=""
                  style={{
                    fontWeight: "bold",
                    fontWeight: "700",
                    borderRadius: "10px",
                    backgroundColor: "#ecf0f1",
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
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      STATUS
                    </th>
                    <th
                      style={{
                        fontWeight: "bold",
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      COUNT
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      style={{
                        color: "#ecf0f1",
                        backgroundColor: "#e74c3c",
                        fontWeight: "bold",
                      }}
                    >
                      REGISTRATION
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                        fontWeight: "bold",
                      }}
                    >
                      356
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      1ST ROUND
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      200
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      APTITUDE
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      126
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#ecf0f1",
                        backgroundColor: "#e74c3c",
                        fontWeight: "bold",
                      }}
                    >
                      TECHNICAL
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                        fontWeight: "bold",
                      }}
                    >
                      87
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      FINAL ROUND
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      36
                    </td>
                  </tr>
                  <tr>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                      }}
                    >
                      OFFER
                    </td>
                    <td
                      style={{
                        color: "#2c3e50",
                        backgroundColor: "#ecf0f1",
                        fontWeight: "bold",
                      }}
                    >
                      16
                    </td>
                  </tr>
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
                backgroundColor: "white",
                color: "#2c3e50",
                height: "90px",
                width: "300px",
              }}
            >
              SLICER!_DATE BASED{" "}
            </button>
            <button
              style={{
                fontWeight: "bold",
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                color: "#2c3e50",
                height: "90px",
                width: "300px",
              }}
            >
              SLICER!_@_SKILL BASED{" "}
            </button>
            <button
              style={{
                fontWeight: "bold",
                boxShadow: "4px 4px 8px rgba(0, 0, 0, 0.1)",
                backgroundColor: "white",
                color: "#2c3e50",
                height: "90px",
                width: "300px",
              }}
            ></button>
          </div>
          <div
            style={{
              paddingTop: "20px",
              paddingBottom: "20px",
              textAlign: "center",
              backgroundColor: "white",
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
