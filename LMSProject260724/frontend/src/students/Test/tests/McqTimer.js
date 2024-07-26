import React, { useState, useEffect } from 'react';
import { FaHourglass } from 'react-icons/fa';
import sandClock from'../../../assets/Images/sandClock.png';

const McqTimer = ({ duration, setTimeLeftCallback, handleTestCompletionTimer }) => {
    const [remainingTime, setRemainingTime] = useState(duration * 1000);

    console.log('remaining Time: ', remainingTime);

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    setTimeLeftCallback(0);
                    handleTestCompletionTimer(); // Call handleSubmit when time is up
                    return 0;
                }
                const newTime = prevTime - 10;
                setTimeLeftCallback(newTime / 1000);
                return newTime;
            });
        }, 10); // 1 second in milliseconds

        return () => clearInterval(timer);
    }, [duration, setTimeLeftCallback, handleTestCompletionTimer]);

    // Format the remaining time to HH:MM:SS
    const formatTime = (time) => {
        const milliseconds = Math.floor((time % 1000) / 10); // Convert to 2-digit milliseconds
        const totalSeconds = Math.floor(time / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}`;
    };

    return (
        <div style={{ position: 'relative', color: 'black' ,width:"100%", backgroundColor:"#F1A128"}}> {/* Set text color to white */}
            <h4 style={{ marginBottom: '10px', }}>Time Left</h4>
            <div>
                {/* <FaHourglass style={{ color: 'black', marginRight: '5px' }} /> {/* Set icon color to white */}  
                <img
                        style={{ borderRadius: '8px', width: '40px', height: 'auto' }}
                        src={sandClock}
                        className="Campus-logo"
                    />
                <span style={{ fontWeight: 'bold' }}>{formatTime(remainingTime)}</span>
            </div>
        </div>
    );
};

export default McqTimer;
