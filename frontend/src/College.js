// App.js
import React ,{useState}from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './college/Sidebar'
import Dashboard from './college/Dashboard/Dashboard';
//import Test from './college/Test/Test';
import Announcements from './college/Database/Announcements';
//import PracticingSession from './college/Practices/Practices';
import CompanyStatistic from './college/Company/Company';
//import TrainerSchedule from './college/Training/TrainingSchedule'
import { SearchProvider } from './AllSearch/SearchContext';
import Header from './Header/Header';
import { CssBaseline } from '@mui/material';
import ThemeContextProvider from './ThemeContext';
//import CodeTest1 from './college/Practices/CodeTest';
import TrainerProfile from './college/Training/TrainerProfile';
import TrainerReport from './college/Training/TrainingReport';

import TestReports from './college/Test/TestReport';

import StudentFeedback from './college/Database/StudentFeedback';
import Settings from './college/Database/settings';
import Attendance from './college/Database/Attendance';
import TrainingSchedule from './college/Training/TrainingSchedule';
import TestSchedule from './college/Test/TestSchedule';
// @ts-ignore
//import { AuthProvider } from '../src/college/Database/Authcontext'
import './App.css'
import SkillMap from './college/Training/SkillMap';

const College =  ({ collegeName,username})=> {
  const [theme, setTheme] = useState('black');
  
  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };
  return (
    
    <Router>
    <div className={`app ${theme}`}>
      <SearchProvider>
      <div className='content-wrapper'>
             
                <ThemeContextProvider>
                  <CssBaseline />
                  <Header theme={theme} toggleTheme={toggleTheme}  username={username} collegeName={collegeName} />
  
        <Sidebar />
        <main className="main-content" style={{ marginLeft: "232px", marginTop: '60px' }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
           
            <Route path="/test/test-access" element={<TestSchedule collegeName={collegeName} />
} />

            <Route path="/test/test-report" element={<TestReports collegeName={collegeName} />} />
           
            <Route path="/database/student" element={<StudentFeedback />} />
            <Route path="/database/attendance" element={<Attendance />} />
           
            <Route path="/database/settings" element={<Settings />} /> 
<Route path="/database/announce" element={<Announcements collegeName={collegeName} />} />
<Route path="/training/profile" element={<TrainerProfile />} />
            <Route path="/training/report" element={<TrainerReport/>} />
            <Route path="/training/schedule" element={<TrainingSchedule/>} />
            <Route path="/training/skill" element={<SkillMap/>} />
            

          </Routes>
        </main>
        </ThemeContextProvider>
            
            </div>
        </SearchProvider>
      </div>
    </Router>
   
  );
};

export default College;
