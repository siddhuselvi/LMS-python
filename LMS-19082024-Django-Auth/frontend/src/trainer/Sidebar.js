import React, { useState } from 'react';
import { Link } from 'react-router-dom';
//import './Sidebar.css';
import '../Components/Sidebar.css'
import menuIcon from '../assets/Images/menu.png';
import DashboardIcon from '../assets/Images/dashboard.png';
import DatabaseIcon from '../assets/Images/Database.png';
import TestIcon from '../assets/Images/Test.png';
import PracticesIcon from '../assets/Images/practice.png';
import LMSIcon from '../assets/Images/lms.png';
import CompanyIcon from '../assets/Images/company-statestic.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [islmsOpen, setIslmsOpen] = useState(false);
  const [ispracticeOpen, setIspracticeOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const togglelmsMenu = () => {
    setIslmsOpen(!islmsOpen);
  };

  const toggleTestMenu = () => {
    setIsTestOpen(!isTestOpen);
  };

  const togglepracticeMenu = () => {
    setIspracticeOpen(!ispracticeOpen);
  };

  const toggleDatabaseMenu = () => {
    setIsDatabaseOpen(!isDatabaseOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
       
      </button>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <img src={DashboardIcon} alt="Dashboard" className='icon-image'/>
            <Link to="/">Dashboard</Link>
          </li>
          <li>
            <div className={`test-section ${islmsOpen ? 'open' : ''}`}>
              <div className="test-header" onClick={togglelmsMenu}>
                <img src={LMSIcon} alt="Learning Material" className='icon-image'/>
                <span>LMS</span>
              </div>
              {islmsOpen && (
                <ul className="test-options">
                  <li className="test-option">
                    <Link to="/Lms/upload-video">LearningMaterial</Link>
                  </li>
                 
                </ul>
              )}
            </div>
          </li>
          <li>
            <div className="test-section">
              <div className="test-header" onClick={toggleTestMenu}>
                <img src={TestIcon} alt="Test" className='icon-image'/>
                <span>Test</span>
              </div>
              {isTestOpen && (
                <ul className="test-options">
                  <li className="test-option">
                    <Link to="/test/schedule">TestSchedule</Link>
                  </li>
                  <li className="test-option">
                    <Link to="/test/report">TestReport</Link>
                  </li>
                  
                </ul>
              )}
            </div>
          </li>
          <li>
            <div className={`test-section ${isDatabaseOpen ? 'open' : ''}`}>
              <div className="test-header" onClick={toggleDatabaseMenu}>
                <img src={DatabaseIcon} alt="Database" className='icon-image' />
                <span>Database</span>
              </div>
              {isDatabaseOpen && (
                <ul className="test-options">
                  <li className="test-option">
                    <Link to="/Database/upload-profile">TrainerProfile</Link>
                  </li>
                  <li className="test-option">
                    <Link to="/Database/Attendance">Attendancesheet</Link>
                  </li>
                 
                </ul>
              )}
            </div>
          </li>
         
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
