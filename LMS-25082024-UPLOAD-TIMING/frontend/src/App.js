// App.js
import React, { useState,useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link,Navigate } from 'react-router-dom';
import Sidebar from './Components/Sidebar'
import Dashboard from './Components/Dashboard/Dashboard';
//import Test from './Components/Test/Test';
import Database from './Components/Database/Database';
//import PracticingSession from './Components/Practices/Practices';

import LearningMaterial from './Components/LMS/LearningMaterial';
import { SearchProvider } from './AllSearch/SearchContext';
import UploadStudentProfile from './Components/Database/UploadStudent';
import Settings from './Components/Database/settings';

import Testaccess from './Components/Test/Testaccess'
import './App.css'
//import Lmsvideo from './Components/LMS/Lmsvideo';
import LoginCreate from './Components/Database/LoginCreate';
import Footer from './Footer/Footer';


import { ContextProvider } from './Components/Test/context/TestTypeContext';
import MCQForm from './Components/Questions/MCQForm';
import QuesPaperTb from './Components/Questions/QuesPaperTb';
import Update_MCQForm from './Components/Questions/Update_MCQForm';
import QuestionPaperMCQ from './Components/Questions/QuestionPaperMCQ';
import QuestionPaperCode from './Components/Questions/QuestionPaperCode';
import Update_CodeForm from './Components/Questions/Update_CodeForm';
import TestReport from './Components/Reports/TestReport';
import UpdateTestAccessForm from './Components/Test/UpdateTest';
import NonDatabaseForm from './Components/Test/NonDatabaseForm';
import TestResult from './Components/Reports/TestResult';
import TestReports from './Components/Reports/TestReportold';
import TestSchedules from './Components/Test/TestSchedules';
import AddDBCandidates from './Components/Test/AddCandidates/AddDBCandidates';
import AddNonDBCandidates from './Components/Test/AddCandidates/AddNonDBCandidates';
import Lms from './Components/LMS/Lms';

import Header from './Header/Header';
import { CssBaseline } from '@mui/material';
import ThemeContextProvider from './ThemeContext';
import LMSMap from './Components/LMS/Maplms';
import ViewLms from './Components/LMS/ViewLMS';
import BinaryToImage from './Components/Questions/BinaryToImage';
import TrainerList from './Components/Database/TrainerList';


const App = ({ collegeName, username }) => {
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
                  <Header theme={theme} toggleTheme={toggleTheme}  username={username}  />
                  <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                  <div className={`main-content ${isSidebarOpen ? 'shifted' : ''}` } style={{ marginTop: '60px'}}>
                     <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/lms/upload-video" element={<LearningMaterial />} />
                      <Route path="/lms/" element={<Lms />} />
                      <Route path="/lms/map/" element={<LMSMap/>} />
                      <Route path="/lms/table/" element={<ViewLms/>} />

                      <Route path="/question/mcq" element={<QuestionPaperMCQ />} />
                      <Route path="/question/code" element={<QuestionPaperCode />} />

                      <Route path="/question" element={<MCQForm />} />
                      <Route path="/question-paper-table" element={<QuesPaperTb />} />
                      <Route path="/update-mcq-form/:id" element={<Update_MCQForm />} />
                      <Route path="/update-code-form/:id" element={<Update_CodeForm />} />

                      <Route path="/test-report/:test_name" element={<TestReport />} />
                      <Route path="/test-result/:test_name" element={<TestResult />} />
                      {/*}  <Route path="/lms/content-map" element={<ContentMap />} />  */}


                      <Route path="/reports" element={<TestReports />} />
                      
                      <Route path="/add-candidate/:test_name" element={<AddDBCandidates />} />
                      <Route path="/add/non-db-candidate" element={<AddNonDBCandidates />} />


                      <Route path="/testaccess" element={<Testaccess />} />
                      <Route path="/database/upload-student" element={<UploadStudentProfile />} />
                     
                      <Route path="/test/test-access" element={<Testaccess />} />
                      <Route path="/test-access/non-db/" element={<NonDatabaseForm />} />
                      <Route path="/test/test-schedules/" element={<TestSchedules />} />
                      <Route path="/testschedule/" element={<TestSchedules />} />

                      <Route path="/update-test/" element={<UpdateTestAccessForm />} />

                      <Route path="/database/settings" element={<Settings />} />
                      <Route path="/database/login" element={<LoginCreate />} />
                      <Route path="/database" element={<Database />} />
                      <Route path="/database/upload-trainer" element={<TrainerList/>} />

                     
                      <Route path="/binary/to/image" element={<BinaryToImage />} />
                    {/*}  <Route path="index.html" element={<Navigate to="/" />} />   */}
                    </Routes>
                  </div>
              
                </ThemeContextProvider>
              </ContextProvider>
            </div>
          </SearchProvider>
        </div>
      </Router>
      <Footer/>
    </div>
  );
};

export default App;
