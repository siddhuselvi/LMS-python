// import React, { useState } from 'react';
// import { Button, Card } from 'react-bootstrap';

// function Instructions() {
//   const [decision, setDecision] = useState(null);

//   const handleAccept = () => {
//     setDecision('Accepted');
//     // Additional logic for when "Accept" is clicked can be added here
//     console.log('User has accepted the instructions.');
//   };

//   const handleDontAccept = () => {
//     setDecision('Not Accepted');
//     // Additional logic for when "Don't Accept" is clicked can be added here
//     console.log('User has not accepted the instructions.');
//   };

//   return (
//     <div>
//       <Card style={{ width: '400px', margin: '20px auto', padding: '20px', backgroundColor: '#f8f9fa' }}>
//         <Card.Body>
//           <Card.Title>Instructions</Card.Title>
//           <Card.Text>
//             Please read the following instructions carefully before proceeding:
//             <ul>
//               <li>Ensure that you understand all the steps.</li>
//               <li>Follow the guidelines strictly.</li>
//               <li>Reach out to support if you have any questions.</li>
//             </ul>
//           </Card.Text>
//           <div style={{ display: 'flex', justifyContent: 'space-between' }}>
//             <Button variant="success" onClick={handleAccept}>
//               Accept
//             </Button>
//             <Button variant="danger" onClick={handleDontAccept}>
//               Don't Accept
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>

//       {decision && (
//         <div style={{ textAlign: 'center', marginTop: '20px' }}>
//           <h5>User decision: {decision}</h5>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Instructions;
// InstructionPopup.js
import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';

const InstructionPopup = ({ open, handleAccept, handleDecline }) => {
  return (
    <Dialog open={open}>
      <DialogTitle>Instructions</DialogTitle>
      <DialogContent>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
        <p>Here are some important instructions for you to follow before you proceed.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDecline} color="secondary">
          Decline
        </Button>
        <Button onClick={handleAccept} color="primary">
          Accept
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default InstructionPopup;
