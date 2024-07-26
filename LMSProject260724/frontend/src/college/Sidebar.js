import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/Sidebar.css'
import menuIcon from '../assets/Images/menu.png';
import DashboardIcon from '../assets/Images/dashboard.png';
import DatabaseIcon from '../assets/Images/Database.png';
import TestIcon from '../assets/Images/Test.png';
import PracticesIcon from '../assets/Images/practice.png';
//import LMSIcon from '../assets/Images/lms.png';
import CompanyIcon from '../assets/Images/company-statestic.png';
const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [iscmpyOpen, setIscmpyOpen] = useState(false);
  const [ispracticeOpen, setIspracticeOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const togglecmpyMenu = () => {
    setIscmpyOpen(!iscmpyOpen);
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
            <div className="test-section">
              <div className="test-header" onClick={toggleTestMenu}>
                <img src={TestIcon} alt="Test" className='icon-image'/>
                <span>Test</span>
              </div>
              {isTestOpen && (
                <ul className="test-options">
                  <li className="test-option">
                    <Link to="/test/test-access">Test Schedules</Link>
                  </li>
                 <li className="test-option">
                    <Link to="/test/test-report">Test Report</Link>
              </li>  
                 
                </ul>
              )}
            </div>
          </li>
          <li>
            <div className={`test-section ${isDatabaseOpen ? 'open' : ''}`}>
              <div className="test-header" onClick={toggleDatabaseMenu}>
                <img src={DatabaseIcon} alt="Database" className='icon-image'/>
                <span>Database</span>
              </div>
              {isDatabaseOpen && (
                <ul className="test-options">
                  <li className="test-option">
                    <Link to="/Database/student">Student Feedback</Link>
                  </li>
                  <li className="test-option">
                    <Link to="/Database/announce">Announcements</Link>
                  </li>
                  <li className="test-option">
                    <Link to="/Database/Attendance">Attendancesheet</Link>
                  </li>
                 
                  <li className="test-option">
                    <Link to="/Database/settings">Settings</Link>
                  </li>
                </ul>
              )}
            </div>
          </li>
          <li>
            <div className="test-section">
              <div className="test-header" onClick={togglepracticeMenu}>
                <img src={PracticesIcon} alt="Training" className='icon-image'/>
                <span>Training</span>
              </div>
              {ispracticeOpen && (
                <ul className="test-options">
                  <li className="test-option">
                    <Link to="/training/profile">Trainer Profile</Link>
                  </li>
                {/*}  <li className="test-option">
                    <Link to="/training/report">Trainer Report</Link>
              </li>    */}
                  <li className="test-option">
                    <Link to="/training/schedule">Training Schedule</Link>
                  </li>
                  <li className="test-option">
                    <Link to="/training/skill">Skill Map</Link>
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
