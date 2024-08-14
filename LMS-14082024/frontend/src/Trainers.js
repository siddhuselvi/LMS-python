// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './trainer/Sidebar'
import Dashboard from './trainer/Dashboard/Dashboard'

import LearningMaterial from './trainer/LMS/LearningMaterial';
//import { ContextProvider } from './Components/Test/context/TestTypeContext';
import Header from './Header/Header';
import { CssBaseline } from '@mui/material';
import ThemeContextProvider from './ThemeContext';
//import ThemeContextProvider from './ThemeContext';
import './App.css';
import Attendance from './trainer/Database/Attendance';
import { SearchProvider } from './AllSearch/SearchContext';
import TestSchedule from './trainer/Test/TestSchedule';
import TestReport from './trainer/Test/TestReport'
import TrainerProfile from './trainer/Database/TrainerProfile';
const Trainer = ({ collegeName, username, institute }) => {
  const [theme, setTheme] = useState('black');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    <div className='App-header'>
      <Router>
        <div className={`app ${theme}`}>
          <SearchProvider>
            <div className='content-wrapper'>

              <ThemeContextProvider>
                <CssBaseline />
                <Header theme={theme} toggleTheme={toggleTheme} username={username} />

                <Sidebar />
                <main className="main-content" style={{ marginLeft: "232px", marginTop: '60px' }}>
                  <Routes>
                    <Route path="/" element={<Dashboard username={username} institute={institute}  />} />
                    <Route path="/lms/upload-video" element={<LearningMaterial username={username} />} />

                    <Route path="/test/schedule" element={<TestSchedule />} />
                    <Route path="/test/report" element={<TestReport />} />

                    <Route path="/database/upload-profile" element={<TrainerProfile />} />
                    <Route path="/database/attendance" element={<Attendance />} />




                  </Routes>
                </main>
              </ThemeContextProvider>

            </div>
          </SearchProvider>
        </div>
      </Router></div>
  );
};

export default Trainer;