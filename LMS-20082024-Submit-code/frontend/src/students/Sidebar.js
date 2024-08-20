import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../Components/Sidebar.css';
import menuIcon from '../assets/Images/menu.png';
import DashboardIcon from '../assets/Images/dashboard.png';
import DatabaseIcon from '../assets/Images/Database.png';
import TestIcon from '../assets/Images/Test.png';
import PracticesIcon from '../assets/Images/practice.png';
import LMSIcon from '../assets/Images/lms.png';
import CompanyIcon from '../assets/Images/company-statestic.png';

const Sidebar = ({ isSidebarOpen }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isTestOpen, setIsTestOpen] = useState(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState(false);
  const [islmsOpen, setIslmsOpen] = useState(false);
  const [ispracticeOpen, setIspracticeOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    if (isSidebarOpen === false) {
      setIsOpen(false);
      setIsTestOpen(false);
      setIsDatabaseOpen(false);
      setIslmsOpen(false);
      setIspracticeOpen(false);
    } else if (isSidebarOpen === true) {
      setIsOpen(true);
      setIsTestOpen(true);
    }
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (menuItem) => {
    setActiveMenuItem(menuItem);
    setIsOpen(false); // Collapse the sidebar when a menu item is clicked
  };

  const toggleMenu = (menu) => {
    setIsTestOpen(menu === 'test' ? !isTestOpen : false);
    setIsDatabaseOpen(menu === 'database' ? !isDatabaseOpen : false);
    setIslmsOpen(menu === 'lms' ? !islmsOpen : false);
    setIspracticeOpen(menu === 'practice' ? !ispracticeOpen : false);
    if (!isOpen) {
      setIsOpen(true); // Expand the sidebar if it's collapsed
    }
  };

  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}${isDisabled ? 'disabled' : ''}`} id="sidebar">
      <button className="toggle-btn" onClick={toggleSidebar}>
        <span className="arrow">{isOpen ? '<' : '>'}</span>
      </button>

      <div style={{ marginTop: '20px' }}>
        <nav className="sidebar-nav">
          <ul>
            <li className={activeMenuItem === 'dashboard' ? 'active' : ''} onClick={() => handleMenuItemClick('dashboard')}>
              <img src={DashboardIcon} alt="Dashboard" className="icon-image" />
              <Link to="/" onContextMenu={(e) => e.preventDefault()}>Dashboard</Link>
            </li>
            <li>
              <div className={`test-section ${islmsOpen ? 'open' : ''}`}>
                <div className="test-header" onClick={() => toggleMenu('lms')}>
                  <img src={LMSIcon} alt="Learning Material" className="icon-image" />
                  <span>LMS</span>
                </div>
                {islmsOpen && isOpen && (
                  <ul className="test-options" style={{ paddingLeft: '15px' }}>
                    <li className={`test-option ${activeMenuItem === 'learningMaterial' ? 'active' : ''}`} onClick={() => handleMenuItemClick('learningMaterial')}>
                      <Link to="/Lms/lms" onContextMenu={(e) => e.preventDefault()}>Learning Material</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div className={`test-section ${isTestOpen ? 'open' : ''}`}>
                <div className="test-header" onClick={() => toggleMenu('test')}>
                  <img src={TestIcon} alt="Test" className="icon-image" />
                  <span>Test</span>
                </div>
                {isTestOpen && isOpen && (
                  <ul className="test-options" style={{ paddingLeft: '15px' }}>
                    <li className={`test-option ${activeMenuItem === 'onlineTest' ? 'active' : ''}`} onClick={() => handleMenuItemClick('onlineTest')}>
                      <Link to="/test/ts-online" onContextMenu={(e) => e.preventDefault()}>MCQ Test</Link>
                    </li>
                    <li className={`test-option ${activeMenuItem === 'codeTest' ? 'active' : ''}`} onClick={() => handleMenuItemClick('codeTest')}>
                      <Link to="/test/ts-code" onContextMenu={(e) => e.preventDefault()}>Code Test</Link>
                    </li>
                    <li className={`test-option ${activeMenuItem === 'testSchedule' ? 'active' : ''}`} onClick={() => handleMenuItemClick('testSchedule')}>
                      <Link to="/test/Testschedule" onContextMenu={(e) => e.preventDefault()}>Test Schedule</Link>
                    </li>
                  </ul>
                )}
              </div>
            </li>
            <li>
              <div className={`test-section ${isDatabaseOpen ? 'open' : ''}`}>
                <div className="test-header" onClick={() => toggleMenu('database')}>
                  <img src={DatabaseIcon} alt="Database" className="icon-image" />
                  <span>Database</span>
                </div>
                {isDatabaseOpen && isOpen && (
                  <ul className="test-options" style={{ paddingLeft: '15px' }}>
                    <li className={`test-option ${activeMenuItem === 'uploadProfile' ? 'active' : ''}`} onClick={() => handleMenuItemClick('uploadProfile')}>
                      <Link to="/Database/upload-student-profile" onContextMenu={(e) => e.preventDefault()}>View Student</Link>
                    </li>
                   
                  </ul>
                )}
              </div>
            </li>
           
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
