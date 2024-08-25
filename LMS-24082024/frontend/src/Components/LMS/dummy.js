import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css'; // Assuming you have an external CSS file for styles

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeMenuItem, setActiveMenuItem] = useState('');

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleMenuItemClick = (menuItem, isLastSubMenu) => {
    setActiveMenuItem(menuItem);
    if (isLastSubMenu) {
      setIsOpen(false);
    }
  };

  const handleSkillType = (type) => {
    console.log(`Skill type selected: ${type}`);
  };

  const handleSkillTypeLMS = (type) => {
    console.log(`Skill type LMS selected: ${type}`);
  };

  return (
    <div className={`sidebar ${isOpen ? '' : 'collapsed'}`} style={{ maxHeight: '100vh', overflowY: 'auto', scrollbarWidth: 'thin' }}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? '<' : '>'}
      </button>
      <SkilltypeAptitude
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
        handleSkillType={handleSkillType}
      />
      <SkilltypeAptitudeLMS
        activeMenuItem={activeMenuItem}
        handleMenuItemClick={handleMenuItemClick}
        handleSkillTypeLMS={handleSkillTypeLMS}
      />
    </div>
  );
};

const SkilltypeAptitude = ({ activeMenuItem, handleMenuItemClick, handleSkillType }) => (
  <ul className='test-options' style={{ paddingLeft: '15px' }}>
    <li className={`test-option ${activeMenuItem === 'quants' ? 'active' : ''}`} onClick={() => handleMenuItemClick('quants', false)}>
      <Link to='/test/test-access' onClick={() => handleSkillType('Quants')} onContextMenu={(e) => e.preventDefault()}>Quants</Link>
    </li>
    <li className={`test-option ${activeMenuItem === 'logical' ? 'active' : ''}`} onClick={() => handleMenuItemClick('logical', false)}>
      <Link to='/test/test-access' onClick={() => handleSkillType('Logical')} onContextMenu={(e) => e.preventDefault()}>Logical</Link>
    </li>
    <li className={`test-option ${activeMenuItem === 'verbal' ? 'active' : ''}`} onClick={() => handleMenuItemClick('verbal', true)}>
      <Link to='/test/test-access' onClick={() => handleSkillType('Verbal')} onContextMenu={(e) => e.preventDefault()}>Verbal</Link>
    </li>
  </ul>
);

const SkilltypeAptitudeLMS = ({ activeMenuItem, handleMenuItemClick, handleSkillTypeLMS }) => (
  <ul className='test-options' style={{ paddingLeft: '25px' }}>
    <li className={`test-option ${activeMenuItem === 'quants' ? 'active' : ''}`} onClick={() => handleMenuItemClick('quants', false)}>
      <Link to='/Lms/upload-video' onClick={() => handleSkillTypeLMS('Quants')} onContextMenu={(e) => e.preventDefault()}>Quants</Link>
    </li>
    <li className={`test-option ${activeMenuItem === 'logical' ? 'active' : ''}`} onClick={() => handleMenuItemClick('logical', false)}>
      <Link to='/Lms/upload-video' onClick={() => handleSkillTypeLMS('Logical')} onContextMenu={(e) => e.preventDefault()}>Logical</Link>
    </li>
    <li className={`test-option ${activeMenuItem === 'verbal' ? 'active' : ''}`} onClick={() => handleMenuItemClick('verbal', true)}>
      <Link to='/Lms/upload-video' onClick={() => handleSkillTypeLMS('Verbal')} onContextMenu={(e) => e.preventDefault()}>Verbal</Link>
    </li>
  </ul>
);

export default Sidebar;
