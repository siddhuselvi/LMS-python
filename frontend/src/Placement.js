//PlacementAdmin.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,Navigate } from 'react-router-dom';
import Sidebar from './PlacementAdmin/Sidebar'
import Dashboard from './PlacementAdmin/Dashboard/Dashboard'
//import Test from './PlacementAdmin/Test/Test';
import Database from './PlacementAdmin/Database/Database';
//import PracticingSession from './PlacementAdmin/Practices/Practices';
import CompanyStatistic from './PlacementAdmin/Company/Company';
import LearningMaterial from './PlacementAdmin/LMS/LearningMaterial';
import { SearchProvider } from './AllSearch/SearchContext';

import Settings from './PlacementAdmin/Database/settings';
import Attendance from './PlacementAdmin/Database/Attendance';
import Testaccess from './PlacementAdmin/Test/Testaccess'
import './App.css'
//import Lmsvideo from './PlacementAdmin/LMS/Lmsvideo';
import LoginCreate from './PlacementAdmin/Database/LogiCreate';

import Allocate from './PlacementAdmin/Company/allocate';

import { ContextProvider } from './PlacementAdmin/Test/context/TestTypeContext';
import MCQForm from './PlacementAdmin/Questions/MCQForm';
import QuesPaperTb from './PlacementAdmin/Questions/QuesPaperTb';
import Update_MCQForm from './PlacementAdmin/Questions/Update_MCQForm';
import QuestionPaperMCQ from './PlacementAdmin/Questions/QuestionPaperMCQ';
import QuestionPaperCode from './PlacementAdmin/Questions/QuestionPaperCode';
import Update_CodeForm from './PlacementAdmin/Questions/Update_CodeForm';
import TestReport from './PlacementAdmin/Reports/TestReport';
import UpdateTestAccessForm from './PlacementAdmin/Test/UpdateTest';
import NonDatabaseForm from './PlacementAdmin/Test/NonDatabaseForm';
import TestResult from './PlacementAdmin/Reports/TestResult';
import TestReports from './PlacementAdmin/Reports/TestReportold';
import TestSchedules from './PlacementAdmin/Test/TestSchedules';
import AddDBCandidates from './PlacementAdmin/Test/AddCandidates/AddDBCandidates';
import AddNonDBCandidates from './PlacementAdmin/Test/AddCandidates/AddNonDBCandidates';

import Header from './Header/Header';
import { CssBaseline } from '@mui/material';
import ThemeContextProvider from './ThemeContext';
import Uploadjoboffers from './PlacementAdmin/Database/UploadJoboffer';


const PlacementAdmin = ({ collegeName, username, institute }) => {
  const [theme, setTheme] = useState('black');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className='App-header'  style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Router>
        <div className={`app ${theme}`}>
          <SearchProvider>

            <div className='content-wrapper'>
              <ContextProvider >
                <ThemeContextProvider>
                  <CssBaseline />
                  <Header theme={theme} toggleTheme={toggleTheme}  username={username} collegeName={collegeName} institute={institute}  />
                  <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}` } style={{ marginTop: '60px'}}>
                    <Routes>
                      <Route path="/" element={<Dashboard username={username} collegeName={collegeName} institute={institute} />} />
                    {/*}  <Route path="/lms/upload-video" element={<LearningMaterial />} />*/}

                      <Route path="/question/mcq" element={<QuestionPaperMCQ username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/question/code" element={<QuestionPaperCode username={username} collegeName={collegeName} institute={institute} />} />

                      <Route path="/question" element={<MCQForm username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/question-paper-table" element={<QuesPaperTb username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/update-mcq-form/:id" element={<Update_MCQForm username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/update-code-form/:id" element={<Update_CodeForm username={username} collegeName={collegeName} institute={institute} />} />

                      <Route path="/test-report/:test_name" element={<TestReport username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/test-result/:test_name" element={<TestResult username={username} collegeName={collegeName} institute={institute} />} />
                      {/*}  <Route path="/lms/content-map" element={<ContentMap />} />  */}


                      <Route path="/reports" element={<TestReports username={username} collegeName={collegeName} institute={institute} />} />
                      
                      <Route path="/add-candidate/:test_name" element={<AddDBCandidates username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/add/non-db-candidate" element={<AddNonDBCandidates username={username} collegeName={collegeName} institute={institute} />} />



                      <Route path="/database/upload-student" element={<Uploadjoboffers username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/database/attendance" element={<Attendance username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path='/test/test-access' element={<Testaccess username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/test-access/non-db/" element={<NonDatabaseForm username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/test/test-schedules/" element={<TestSchedules username={username} collegeName={collegeName} institute={institute}  />} />

                      <Route path="/update-test/" element={<UpdateTestAccessForm username={username} collegeName={collegeName} institute={institute} />} />

                      <Route path="/database/settings" element={<Settings username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/database/login" element={<LoginCreate username={username} collegeName={collegeName} institute={institute} />} />
                      <Route path="/database" element={<Database />} />

                     
                    {/*}  <Route path="index.html" element={<Navigate to="/" />} />   */}
                    </Routes>
                  </div>
              
                </ThemeContextProvider>
              </ContextProvider>
            </div>
          </SearchProvider>
        </div>
      </Router>
    </div>
  );
};

export default PlacementAdmin;
