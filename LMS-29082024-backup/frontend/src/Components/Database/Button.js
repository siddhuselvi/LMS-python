import React, { useState } from 'react';
import '../../Styles/global.css'
import QuestionsManagement from './QuestionType';
import SkillsManagement from './SkillType';
import TestTypeManagement from './TestType';
import CollegeManagement from './CollegeMaster';
import DepartmentManagement from './DepartmentMaster';
import Skill from './Skillsmaster';
import RulesManagement from './Rules';

const Buttons = () => {
    const [activeButton, setActiveButton] = useState(null);

    const handleButtonClick = (buttonName) => {
        console.log(`${buttonName} button clicked`);
        setActiveButton(buttonName);
    };

    return (
        <div className='form-ques' style={{height:"1000px"}}>
        <>
        <div className="header">
        <h5 >Choose the Master Table here!</h5>
        </div>
        
        <br></br><p></p>
        <div>
            <select onChange={(e) => handleButtonClick(e.target.value)} className="input-ques" >
                <option value="" >Select Option</option>
                <option value="Skill Type">Skill Type</option>
                <option value="Test Type">Test Type</option>
                <option value="Question Type">Question Type</option>
                <option value="College Master">College Master</option>
                <option value="Department Master">Department Master</option>
              <option value="Skill Master">Skill Master</option>
               {/* <option value="course Master">Course Master</option> 
                <option value="Topic Master">Topic Master</option>*/} 
                
                <option value="Rules">Rules</option>
            </select></div>
<div style={{height:"120px"}}></div>
            <div className="button-group" style={{marginLeft:"0px",marginTop:"-90px"}}>
                {activeButton === 'Question Type' && <QuestionsManagement />}
                {activeButton === 'Skill Type' && <SkillsManagement />}
                {activeButton === 'Test Type' && <TestTypeManagement />}
                {activeButton === 'College Master' && <CollegeManagement />}
                {activeButton === 'Department Master' && <DepartmentManagement />}
             
              {activeButton === 'Skill Master' && <Skill />}
 
                {activeButton === 'Rules' && <RulesManagement />}
            </div>
        </></div>
    );
};

export default Buttons;
