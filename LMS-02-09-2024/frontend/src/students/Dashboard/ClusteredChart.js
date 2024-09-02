import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { getCourseContentFeedbackApi } from '../../../src/api/endpoints';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ClusteredChart = ({ username }) => {
  const [feedbackData, setFeedbackData] = useState([]);

  useEffect(() => {
    fetchFeedbackData();
  }, []);

  const fetchFeedbackData = () => {
    getCourseContentFeedbackApi()
      .then(data => {
        // Filter data based on username (trainer_id)
        const filteredData = data.filter(item => item.trainer_id === username);
        console.log("trainer",filteredData)
        setFeedbackData(filteredData);
      })
      .catch(error => console.error('Error fetching feedback data:', error));
  };

  // Function to process feedback data and generate department-wise counts
  const generateData = () => {
    const departmentCounts = {};

    feedbackData.forEach(feedback => {
      const department = feedback.department_id;
      const feedbackCategory = feedback.feedback;

      if (!departmentCounts[department]) {
        departmentCounts[department] = {
          Excellent: 0,
          Good: 0,
          Average: 0,
          Poor: 0,
        };
      }

      // Increment count based on feedback category
      switch (feedbackCategory) {
        case 'Excellent':
          departmentCounts[department].Excellent++;
          break;
        case 'Good':
          departmentCounts[department].Good++;
          break;
        case 'Average':
          departmentCounts[department].Average++;
          break;
        case 'Poor':
          departmentCounts[department].Poor++;
          break;
        default:
          break;
      }
    });

    // Prepare data in the format required by Chart.js
    const labels = Object.keys(departmentCounts);
    const datasets = Object.keys(departmentCounts[labels[0]]).map(category => ({
      label: category,
      data: labels.map(label => departmentCounts[label][category]),
      backgroundColor: getBackgroundColor(category),
      borderColor: getBorderColor(category),
      borderWidth: 1,
    }));

    return {
      labels: labels,
      datasets: datasets,
    };
  };

  // Helper function to get background color based on feedback category
  const getBackgroundColor = (category) => {
    switch (category) {
      case 'Excellent':
        return '#0F5963';
      case 'Good':
        return '#17BDD3';
      case 'Average':
        return '#4BE8E5';
      case 'Poor':
        return '#30F99F';
      default:
        return '#000000';
    }
  };

  // Helper function to get border color based on feedback category (optional)
  const getBorderColor = (category) => {
    switch (category) {
      case 'Excellent':
        return '#0F5963';
      case 'Good':
        return '#17BDD3';
      case 'Average':
        return '#4BE8E5';
      case 'Poor':
        return '#30F99F';
      default:
        return '#000000';
    }
  };

  // Ensure data is ready before rendering the chart
  if (feedbackData.length === 0) {
    return null; // or loading indicator if needed
  }

  const data = generateData();

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: 'white'  // Set legend label color to white
        }
      },
      title: {
        display: true,
        text: 'Feedback Analysis by Department',
        color: 'white'  // Set title color to white
      },
    },
    scales: {
      x: {
        ticks: {
          color: 'white'  // Set X-axis label color to white
        },
        grid: {
          display: false  // Optional: remove X-axis grid lines
        }
      },
      y: {
        ticks: {
          color: 'white'  // Set Y-axis label color to white
        },
        grid: {
          display: false  // Optional: remove Y-axis grid lines
        }
      }
    }
  };

  return <Bar data={data} options={options} />;
};

export default ClusteredChart;
