import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './students/Sidebar';
import Dashboard from './students/Dashboard/Dashboard'

import CompanyStatistic from './students/Company/Company';
import LearningMaterial from './students/LMS/LearningMaterial';
import AttendCodeTest from './students/Test/tests/AttendCodeTest';
import AttendOnlineMockTest from './students/Test/tests/AttendOnlineMockTest'
import Footer from './Footer/Footer';

import './App.css';
import TestSchedule from './students/Test/TestSchedule';
//import TopNavbar from '../src/students/TopNavbar';
import { TestProvider } from '../src/students/Test/contextSub/Context'
import Uploadstudent from './students/Database/updateall';
import UploadStudentProfile from './students/Database/uploadstudentprofile';
import {
  getTestcandidateApi,
  getNeedInfoStuApi,
  getStudentNeedInfo
} from './api/endpoints';
//import { ContextProvider } from './Components/Test/context/TestTypeContext';
import Header from './Header/Header';
import CssBaseline from '@mui/material';
import ThemeContextProvider from './ThemeContext';
import { SearchProvider } from './AllSearch/SearchContext';


const Students = ({ collegeName, username, institute,userRole }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [needInfo, setNeedInfo] = useState(false);
  const [studentsNeedInfoData, setStudentsNeedInfoData] = useState([]);
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    // Fetch student's need_candidate_info when the component mounts
    getStudentNeedInfo(username)
      .then(data => {
        setNeedInfo(data.need_candidate_info);
        setStudentsNeedInfoData(data);
        // console.log('setNeedInfo: ', data);
      })
      .catch(error => {
        // Handle error if needed
        console.error('Error fetching need info:', error);
      });
  }, [username, needInfo, studentsNeedInfoData]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const enableSidebar = () => {
    setIsSidebarOpen(true);
  };

  const disableSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className='App-header' style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>

      <Router>

        <div className={`app ${theme}`}>
          <SearchProvider>


            {needInfo === true ? (
              <Uploadstudent username={username} collegeName={collegeName} institute={institute}/>
            ) : (
              <div>
                <ThemeContextProvider>
                  <Header theme={theme} toggleTheme={toggleTheme} username={username} collegeName={collegeName} userRole={userRole} />
                  <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}`} style={{ marginTop: '60px' }}>
                    <TestProvider>
                      <Routes>
                        <Route path="/" element={<Dashboard username={username} collegeName={collegeName} institute={institute} isSidebarOpen={isSidebarOpen} disableSidebar={disableSidebar} enableSidebar={enableSidebar} />} />
                        <Route path="/dashboard" element={<Dashboard username={username} collegeName={collegeName} isSidebarOpen={isSidebarOpen} disableSidebar={disableSidebar} enableSidebar={enableSidebar} />} />
                        <Route path="/Lms/lms" element={<LearningMaterial username={username} collegeName={collegeName} institute={institute} />} />
                        <Route path="/test/ts-online" element={<AttendOnlineMockTest username={username} collegeName={collegeName} isSidebarOpen={isSidebarOpen} disableSidebar={disableSidebar} enableSidebar={enableSidebar} />} />
                        <Route path="/test/ts-code" element={<AttendCodeTest username={username} collegeName={collegeName} isSidebarOpen={isSidebarOpen} disableSidebar={disableSidebar} enableSidebar={enableSidebar} />} />
                        <Route path="/test/Testschedule" element={<TestSchedule username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/test/student" element={<TestSchedule username={username} collegeName={collegeName} institute={institute} />} />

                        <Route path="/database/upload-student" element={<Uploadstudent username={username} collegeName={collegeName} />} />
                        <Route path="/database/upload-student-profile" element={<UploadStudentProfile username={username} collegeName={collegeName} />} />
                      
                             {/*}  <Route path="index.html" element={<Navigate to="/" />} />   */}
                      </Routes>
                    </TestProvider>
                  </div>
                </ThemeContextProvider>
              </div>
            )}
          </SearchProvider>
        </div>

      </Router>
      <Footer /></div>
  );
};

export default Students;
