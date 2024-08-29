// settings.js
import React from 'react';
import Buttons from './Button';
import Footer from '../../Footer/Footer';
const Settings = ({collegeName}) => {
  return(
    <>
    <Buttons collegeName={collegeName}/>
    <div>
    <p style={{height:"50px"}}></p>
       {/*  <Footer></Footer>*/}
        </div>
    </>
  )

  
};



export default Settings;
