// // App.js
// import React, { useState } from 'react';
// import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
// import Sidebar from './trainer/Sidebar'
// import Dashboard from './trainer/Dashboard/Dashboard'

// import LearningMaterial from './trainer/LMS/LearningMaterial';
// //import { ContextProvider } from './Components/Test/context/TestTypeContext';
// import Header from './Header/Header';
// import { CssBaseline } from '@mui/material';
// import ThemeContextProvider from './ThemeContext';
// //import ThemeContextProvider from './ThemeContext';
// import './App.css';

// import { SearchProvider } from './AllSearch/SearchContext';

// import TestReport from './trainer/Test/TestReport'
// import TrainerProfile from './trainer/Database/TrainerProfile';
// const Trainer = ({ collegeName, username, institute,userRole }) => {
//   const [theme, setTheme] = useState('black');

//   const toggleTheme = () => {
//     setTheme(theme === 'light' ? 'dark' : 'light');
//   };
//   return (
//     <div className='App-header'>
//       <Router>
//         <div className={`app ${theme}`}>
//           <SearchProvider>
//             <div className='content-wrapper'>

//               <ThemeContextProvider>
//                 <CssBaseline />
//                 <Header theme={theme} toggleTheme={toggleTheme} username={username} />

//                 <Sidebar />
//                 <main className="main-content" style={{ marginLeft: "232px", marginTop: '60px' }}>
//                   <Routes>
//                     <Route path="/" element={<Dashboard username={username} institute={institute}  />} />
//                     <Route path="/lms/upload-video" element={<LearningMaterial username={username} />} />

                    
//                     <Route path="/test/report" element={<TestReport />} />
//                     <Route path="/database/upload-profile" element={<TrainerProfile username={username} userRole={userRole}/>} />
                   



//                   </Routes>
//                 </main>
//               </ThemeContextProvider>

//             </div>
//           </SearchProvider>
//         </div>
//       </Router></div>
//   );
// };

// export default Trainer;
// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './trainer/Sidebar';
import Dashboard from './trainer/Dashboard/Dashboard';
import LearningMaterial from './trainer/LMS/LearningMaterial';
import Header from './Header/Header';
import { CssBaseline } from '@mui/material';
import ThemeContextProvider from './ThemeContext';
import './App.css';
import { SearchProvider } from './AllSearch/SearchContext';
import TestReport from './trainer/Test/TestReport';
import TrainerProfile from './trainer/Database/TrainerProfile';
import InstructionPopup from './trainer/Database/InstructionPopup';  // Import the popup component

const Trainer = ({ collegeName, username, institute, userRole }) => {
  const [theme, setTheme] = useState('black');
  const [accepted, setAccepted] = useState(false);  // State to track if the user accepted the instructions
  const [openPopup, setOpenPopup] = useState(true);  // State to control the popup visibility

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleAccept = () => {
    setAccepted(true);
    setOpenPopup(false);
  };

  const handleDecline = () => {
    setAccepted(false);
  };

  return (
    <div className='App-header'>
      <Router>
        {openPopup && <InstructionPopup open={openPopup} handleAccept={handleAccept} handleDecline={handleDecline} />}
        {accepted ? (
          <div className={`app ${theme}`}>
            <SearchProvider>
              <div className='content-wrapper'>
                <ThemeContextProvider>
                  <CssBaseline />
                  <Header theme={theme} toggleTheme={toggleTheme} username={username} />
                  <Sidebar />
                  <main className="main-content" style={{ marginLeft: "232px", marginTop: '60px' }}>
                    <Routes>
                      <Route path="/" element={<Dashboard username={username} institute={institute} />} />
                      <Route path="/lms/upload-video" element={<LearningMaterial username={username} />} />
                      <Route path="/test/report" element={<TestReport />} />
                      <Route path="/database/upload-profile" element={<TrainerProfile username={username} userRole={userRole} />} />
                    </Routes>
                  </main>
                </ThemeContextProvider>
              </div>
            </SearchProvider>
          </div>
        ) : (
          <Navigate to="/Components/auth/Login" />  // Redirect to login if declined
        )}
      </Router>
    </div>
  );
};

export default Trainer;
