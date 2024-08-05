import React, { useState, useEffect } from 'react';
import { FaHourglass } from 'react-icons/fa';
import sandClock from'../../../assets/Images/sandClock.png';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';

const CodingTimer = ({ duration, setTimeLeftCallback, handleTestCompletionTimer, showFinalPage, dtmEnd }) => {
    const [remainingTime, setRemainingTime] = useState(duration * 1000); // Initialize in milliseconds

    // console.log('remaining Time: ', remainingTime);

    useEffect(() => {
        if (remainingTime === 0 || showFinalPage) {
            console.log('Timer should stop because remaining time is 0 or showFinalPage is true');
            setTimeLeftCallback(0);
            if (!showFinalPage) handleTestCompletionTimer(); // Call handleTestCompletionTimer only if time is up and not due to showFinalPage
            return;
        }

        
        if (dtmEnd) {
            const endDateTime = new Date(dtmEnd.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));

            const timer = setInterval(() => {
                const currentDateTime = new Date();
                console.log('CodingTime...currentDateTime: ', currentDateTime.toString());
                console.log('CodingTime...endDateTime: ', endDateTime);

                if (currentDateTime >= endDateTime) {
                    setRemainingTime(0);
                    setTimeLeftCallback(0);
                    handleTestCompletionTimer();
                    clearInterval(timer);
                } else {
                    const remainingTimeFromEndTime = (endDateTime - currentDateTime) / 1000;
                    setRemainingTime(remainingTimeFromEndTime * 1000);
                    setTimeLeftCallback(remainingTimeFromEndTime);
                }

                setRemainingTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setTimeLeftCallback(0);
                        handleTestCompletionTimer();
                        return 0;
                    }
                    const newTime = prevTime - 10;
                    setTimeLeftCallback(newTime / 1000);
                    return newTime;
                });
            }, 10);

            return () => clearInterval(timer);
        } else {
            const timer = setInterval(() => {
                setRemainingTime(prevTime => {
                    if (prevTime <= 1) {
                        clearInterval(timer);
                        setTimeLeftCallback(0);
                        handleTestCompletionTimer();
                        return 0;
                    }
                    const newTime = prevTime - 10;
                    setTimeLeftCallback(newTime / 1000);
                    return newTime;
                });
            }, 10);

            return () => clearInterval(timer);
        }

        
    }, [duration, setTimeLeftCallback, handleTestCompletionTimer, showFinalPage]);

    const formatTime = (time) => {
        const milliseconds = Math.floor((time % 1000) / 10); // Convert to 2-digit milliseconds
        const totalSeconds = Math.floor(time / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours < 10 ? '0' + hours : hours}:${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}.${milliseconds < 10 ? '0' + milliseconds : milliseconds}`;
    };

    return (
        <div style={{ position: 'relative', color: 'black', width: "100%", backgroundColor: "#F1A128" }}>
            <h4 style={{ marginBottom: '10px' }}>Time Left</h4>
            <div>
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

CodingTimer.propTypes = {
    duration: PropTypes.number.isRequired,
    setTimeLeftCallback: PropTypes.func.isRequired,
    handleTestCompletionTimer: PropTypes.func.isRequired,
    dtmEnd: PropTypes.string
};


export default CodingTimer;