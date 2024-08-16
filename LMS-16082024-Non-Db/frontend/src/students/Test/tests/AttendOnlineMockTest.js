import React, { useState, useEffect, useCallback } from 'react';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import {
    getTestsApi,
    getQuestionApi_IO,
    getcandidatesApi,
    getTestTypeCategory_testNameApi,
    updateTestcadidateApi_is_active,

    updateTestcadidateApi_submitted,
    updateTestcadidateApi_teststarted,
    addTestAnswerMapApi,
    updateTotalScoreTestcandidateApi,
    updateAvgMarkTestcandidateApi,
    getTestcandidate_MCQ_Api,
    getQuestionApi_Filter_IO_MCQ
} from "../../../api/endpoints";
//import Sidebar from '../../Sidebar';
import '../../../Styles/global.css';
import CombinedReviewSection from './Renderreview';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import McqTimer from './McqTimer';
import ErrorModal from '../../../Components/auth/ErrorModal';
import BinaryToImages from './BinaryToImages';



const AttendOnlineMockTest = ({ collegeName, username, isSidebarOpen, disableSidebar, enableSidebar }) => {
    const [testCandidates, setTestCandidates] = useState([]);
    const [upcommingTests, setUpcommingTests] = useState([]);
    const [testStartTime, setTestStartTime] = useState(null);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [selectedTestCandidate, setSelectedTestCandidate] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [optionF, setOptionF] = useState('');
    const [testID, setTestID] = useState('');
    const [questionID, setQuestionID] = useState('');
    const [studentID, setStudentID] = useState('');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [results, setResults] = useState(0);
    const [testCompleted, setTestCompleted] = useState(false);
    const [totalMarks, setTotalMarks] = useState(0);
    const [countMarks, setCountMarks] = useState(0);
    // const [isSidebarDisabled, setIsSidebarDisabled] = useState(false);

    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [testName, setTestName] = useState('');
    const navigate = useNavigate();

    const [reviewMode, setReviewMode] = useState(false);
    const [minsTaken, setMinsTaken] = useState('');
    const [secTaken, setSecTaken] = useState('');
    const [sbar, setSBar] = useState(false);

    const [salutation, setSalutation] = useState('');
    const [isReviewComplete, setIsReviewComplete] = useState(false);
    const currentDateOLD = new Date();

    const [testTypeCategory, setTestTypeCategory] = useState(null);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleCloseError = () => {
        setShowError(false);
    };
    useEffect(() => {
        getTestTypeCategory_testNameApi(testName)
            .then(result => {
                setTestTypeCategory(result.test_type_category);
            })
            .catch(error => {
                console.error('Error fetching test type category:', error);
            });
    }, [testName]);

    useEffect(() => {
        const now = new Date();
        const indianTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }));
        const hours = indianTime.getHours();

        let greeting = '';
        if (hours < 12) {
            greeting = 'Good Morning';
        } else if (hours < 17) {
            greeting = 'Good Afternoon';
        } else {
            greeting = 'Good Evening';
        }
        setSalutation(greeting);
    }, []);
    useEffect(() => {
        const preventScreenshot = (e) => {
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                setErrorMessage('Screenshots are disabled for this page.');
                setShowError(true);
            }
        };

        const preventContextMenu = (e) => {
            e.preventDefault();
            setErrorMessage('Right-click is disabled for this page.');
            setShowError(true);
        };

        const preventMobileScreenshot = () => {
            setErrorMessage('Screenshots are disabled for this page.');
            setShowError(true);
        };

        window.addEventListener('keyup', preventScreenshot);
        window.addEventListener('contextmenu', preventContextMenu);
        window.addEventListener('visibilitychange', preventMobileScreenshot);

        return () => {
            window.removeEventListener('keyup', preventScreenshot);
            window.removeEventListener('contextmenu', preventContextMenu);
            window.removeEventListener('visibilitychange', preventMobileScreenshot);
        };
    }, []);

    useEffect(() => {
        const preventScreenshot = (e) => {
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                // alert('Screenshots are disabled for this page.');
                setErrorMessage('Screenshots are disabled for this page.');
                setShowError(true);

            }
        };

        const preventContextMenu = (e) => {
            // e.preventDefault();
            //setErrorMessage('Right-click is disabled for this page.');
            setShowError(true);

            //alert('Right-click is disabled for this page.');    
        };

        window.addEventListener('keyup', preventScreenshot);
        window.addEventListener('contextmenu', preventContextMenu);

        return () => {
            window.removeEventListener('keyup', preventScreenshot);
            window.removeEventListener('contextmenu', preventContextMenu);
        };
    }, []);




    useEffect(() => {
        const requestFullScreen = () => {
            const element = document.documentElement;
            if (element.requestFullscreen) {
                element.requestFullscreen().catch((err) => console.error(err));
            } else if (element.mozRequestFullScreen) { // Firefox
                element.mozRequestFullScreen().catch((err) => console.error(err));
            } else if (element.webkitRequestFullscreen) { // Chrome, Safari, and Opera
                element.webkitRequestFullscreen().catch((err) => console.error(err));
            } else if (element.msRequestFullscreen) { // IE/Edge
                element.msRequestFullscreen().catch((err) => console.error(err));
            }
        };

        const handleBeforeUnload = (e) => {
            if (!testCompleted) {
                const confirmationMessage = 'You cannot leave the page till you complete the test. Once you leave, you cannot attend the test again.';
                e.returnValue = confirmationMessage; // Standard for most browsers
                return confirmationMessage; // For some old browsers
            }
        };

        const handleVisibilityChange = () => {
            if (document.hidden) {
                //alert('You cannot leave the page till you complete the test. Once you leave, you cannot attend the test again.');
            }
        };

        const preventContextMenu = (e) => {
            e.preventDefault();
            setErrorMessage('Right-click is disabled for this page.');
            setShowError(true);

            //alert('Right-click is disabled for this page.');        
        };

        const handleBlur = () => {
            // alert('You cannot leave the page till you complete the test. Once you leave, you cannot attend the test again.');
            window.focus();
        };

        const handleFullscreenChange = () => {
            if (!testCompleted && !document.fullscreenElement) {
                requestFullScreen();
                setErrorMessage('If you exit the screen, you cannot attend the test again.');
                setShowError(true);

                // alert('If you exit the screen, you cannot attend the test again.');
            }
        };

        const handleKeydown = (e) => {
            if (e.key === 'Escape' && !testCompleted) {
                e.preventDefault();
                setErrorMessage('If you exit the screen, you cannot attend the test again.');
                setShowError(true);

                //alert('If you exit the screen, you cannot attend the test again.');
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        window.addEventListener('contextmenu', preventContextMenu);
        window.addEventListener('blur', handleBlur);
        document.addEventListener('fullscreenchange', handleFullscreenChange);
        document.addEventListener('keydown', handleKeydown);

        requestFullScreen();

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('contextmenu', preventContextMenu);
            window.removeEventListener('blur', handleBlur);
            document.removeEventListener('fullscreenchange', handleFullscreenChange);
            document.removeEventListener('keydown', handleKeydown);
        };
    }, [testCompleted]);

    const handleTestCompletion = (e) => {
        e.preventDefault();
        handleSubmit(e); // Assume handleSubmit is defined elsewhere
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => console.error(err));
        }
        setTestCompleted(true);
    };

    const handleSave = (e) => {
        e.preventDefault();
        setAnswers({});
        setCountMarks(0);
        setReviewMode(false)
        enableSidebar();

        setSBar(false);
        if (isReviewComplete) {
            // Handle save/finish logic
            console.log("Finished");
        }

        navigate('/dashboard');
        // Additional logic if needed
    };

    const handleReviewClick = () => {
        setReviewMode(true);
        setTimeout(() => {
            setIsReviewComplete(true);
        }, 1000);
    };



    useEffect(() => {
        if (selectedTestCandidate) {

            getTestsApi()
                .then(data => {
                    const filterTests = data.filter(test => test.test_name === selectedTestCandidate.test_name);
                    if (filterTests.length > 0) {
                        setTestID(filterTests[0].id); // Assuming test_id maps to id
                    }
                })
                .catch(error => {
                    console.error('Error Fetching Tests:', error);
                });

            getQuestionApi_IO()
                .then(data => {
                    const filterQuestions = data.filter(ques => ques.question_paper_name === selectedTestCandidate.question_paper_name && ques.question_name_id === selectedTestCandidate.question_id);
                    if (filterQuestions.length > 0) {
                        setQuestionID(filterQuestions[0].id); // Assuming question_id maps to id
                    }
                })
                .catch(error => {
                    console.error('Error Fetching Questions:', error);
                });

            getcandidatesApi()
                .then(data => {
                    const filterStu = data.filter(stu => stu.user_name === selectedTestCandidate.user_name);
                    if (filterStu.length > 0) {
                        setStudentID(filterStu[0].id); // Assuming student_id maps to id
                    }
                })
                .catch(error => {
                    console.error('Error Fetching Candidates:', error);
                });
        }
    }, [selectedTestCandidate]);

    useEffect(() => {
        getTestCandidates();
    }, [collegeName, username]);

    const getTestCandidates = () => {
        const today = new Date(); // Get today's date
        today.setHours(0, 0, 0, 0);
        getTestcandidate_MCQ_Api(username)
            .then(testCandidatesData => {
                setTestCandidates(testCandidatesData);
                setUpcommingTests(testCandidatesData);
                console.log('upcomming Test: ', testCandidatesData);
            })
            .catch(error => {
                console.error('Error fetching test candidates:', error);
            });
    };
    const handleGoForTest = async (selectedCandidateId) => {
        try {
            // Find the selected candidate
            const candidate = testCandidates.find(candidate => candidate.id === selectedCandidateId);
            setSelectedTestCandidate(candidate);
            console.log('candidates: ', candidate);

            // Set test name and start time
            setTestName(candidate.test_name);
            console.log('setTestName: ', candidate.test_name);

            setTestStartTime(new Date());
            disableSidebar();

            setSBar(true);

            // Fetch the questions data
            const questionsData = await getQuestionApi_Filter_IO_MCQ(candidate.question_id);

            // Set the questions data
            setQuestions(questionsData);
            console.log('setQuestions: ', questionsData);

            // Calculate total marks
            const totalMarks1 = questionsData.reduce((total, question) => total + question.mark, 0);
            console.log('total marks: ', totalMarks1);
            setCountMarks(totalMarks1);

            // Set the current question index to the first question
            setCurrentQuestionIndex(0);

            // Update test candidate status to 'test started'
            await updateTestcadidateApi_teststarted(selectedCandidateId);

        } catch (error) {
            // Log any errors that occur
            console.error('Error fetching questions or starting the test:', error);
        }
    };

    /*  const handleGoForTest = async(selectedCandidateId) => {
  
          const candidate = testCandidates.find(candidate => candidate.id === selectedCandidateId);
          setSelectedTestCandidate(candidate);
          console.log('candidates: ', candidate);
  
          setTestName(candidate.test_name);
          console.log('setTestName: ', candidate.test_name);
  
          setTestStartTime(new Date());
          disableSidebar();
  
          setSBar(true);
          getQuestionApi_Filter_IO(candidate.question_id)
              .then(questionsData => {
                
                  setQuestions(questionsData);
                  console.log('setQuestions: ', questionsData);
  
                  // Calculate total marks
                  const totalMarks1 = questionsData.reduce((total, question) => total + question.mark, 0);
                  console.log('total marks: ', totalMarks1);
                  setCountMarks(totalMarks1);
  
                  setCurrentQuestionIndex(0);
  
              })
              .catch(error => {
                  console.error('Error fetching questions:', error);
              });
      };*/

    {/*}    const handleOptionSelect = (option) => {
        setOptionF(option);
        console.log('Options: ', option);
    };       */}

    const handleOptionSelect = (selectedOptionLabel) => {
        const questionId = questions[currentQuestionIndex].id;
        const updatedAnswers = { ...answers, [questionId]: selectedOptionLabel };
        setAnswers(updatedAnswers);
        setOptionF(selectedOptionLabel);
        console.log('setOptionF: ', selectedOptionLabel);
        console.log('Set Answers: ', updatedAnswers);
    };
    /*
        const handleSubmit = (e) => {
            e.preventDefault();
           // setTestCompleted(true);
            const formData = new FormData(e.target);
    
            // Capture the current time when the user submits the test
            const endTime = new Date();
    
            // Calculate the time taken in seconds
            const timeTakenInSeconds = Math.floor((endTime - testStartTime) / 1000);
    
            // Convert the time taken to minutes and seconds
            const minutesTaken = Math.floor(timeTakenInSeconds / 60);
            setMinsTaken(minutesTaken);
            const secondsTaken = timeTakenInSeconds % 60;
            setSecTaken(secondsTaken);
    
            // Display the time taken
            console.log(`Time taken: ${minutesTaken} minutes and ${secondsTaken} seconds`);
    
    
            // Fetch questions data
            getQuestionApi_IO()
                .then(data => {
                    console.log("Data from API:", data); // Log the data fetched from the API
    
                    // Construct answer objects
                    const dataToSubmit = Object.keys(answers).map(questionId => {
                        const correctQuestion = questions.find(q => q.id === parseInt(questionId)); // Find the correct question
                        console.log('correct Questions: ', correctQuestion);
    
                        const userAnswer = answers[questionId]; // Get the user's answer for this question
    
                        // Find the corresponding question from the fetched data based on question text and name
                        const matchingQuestion = data.find(ques =>
                            ques.question_text === correctQuestion.question_text &&
                            ques.question_name_id === correctQuestion.question_name_id &&
                            ques.answer === userAnswer
                        );
    
                        // Set results based on whether a match is found or not
                        const resultValue = matchingQuestion ? correctQuestion.mark : 0;
    
                        return {
                            test_id: testName,
                            question_id: parseInt(questionId),
                            student_id: studentID,
                            answer: userAnswer,
                            result: resultValue,
                            dtm_start: testStartTime, // Use the captured start time
                            dtm_end: new Date(),
                        };
                    });
    
    
                    console.log("Answer Data: ", dataToSubmit);
    
                    // Submit each row of data to the API using a for loop
                    const submitPromises = [];
                    for (let i = 0; i < dataToSubmit.length; i++) {
                        const row = dataToSubmit[i];
                        submitPromises.push(addTestAnswerMapApi(row)); // Corrected: Passing row directly instead of [row]
                    }
    
                    // Execute all promises in sequence
                    let allPromises = Promise.resolve();
                    for (let i = 0; i < submitPromises.length; i++) {
                        allPromises = allPromises.then(submitPromises[i]);
                    }
    
                    allPromises.then(async () => {
                        alert("Submitted Successfully");
    
                        // Update total marks
                        const totalResultValue = dataToSubmit.reduce((total, answer) => total + answer.result, 0);
                        const updatedTotalMarks = totalMarks + totalResultValue; // Calculate updated total marks
                        setTotalMarks(updatedTotalMarks); // Update total marks in state
                        console.log('Total MArks: ', updatedTotalMarks); // Log updated total marks
    
                        const avgMarks = Math.round((updatedTotalMarks / countMarks) * 100);
                        console.log('Avg Mark: ', avgMarks);
    
                        // Check if this is the last question
                        setTestCompleted(true);
                        await updateTestcadidateApi_is_active(selectedCandidateId);
                        await updateTotalScoreTestcandidateApi(selectedCandidateId, { total_score: updatedTotalMarks }); // Use updated total marks
                        await updateAvgMarkTestcandidateApi(selectedCandidateId, { avg_mark: avgMarks }); // Use updated total marks
                    })
                        .catch((error) => {
                            console.log("Failed to submit", error);
                            alert("Not Submitted");
                        });
                })
                .catch(error => {
                    console.error('Error Fetching Tests:', error);
                });
        };*/

    const handleSubmit = (e) => {
        if (e) e.preventDefault();


        // const formData = new FormData();

        // Capture the current time when the user submits the test
        const endTime = new Date();

        // Calculate the time taken in seconds
        const timeTakenInSeconds = Math.floor((endTime - testStartTime) / 1000);

        // Convert the time taken to minutes and seconds
        const minutesTaken = Math.floor(timeTakenInSeconds / 60);
        setMinsTaken(minutesTaken);
        const secondsTaken = timeTakenInSeconds % 60;
        setSecTaken(secondsTaken);

        // Display the time taken
        console.log(`Time taken: ${minutesTaken} minutes and ${secondsTaken} seconds`);


        // Fetch questions data
        getQuestionApi_IO()
            .then(data => {
                console.log("Data from API:", data); // Log the data fetched from the API

                // Construct answer objects
                const dataToSubmit = Object.keys(answers).map(questionId => {
                    const correctQuestion = questions.find(q => q.id === parseInt(questionId)); // Find the correct question
                    console.log('correct Questions: ', correctQuestion);

                    const userAnswer = answers[questionId]; // Get the user's answer for this question

                    // Find the corresponding question from the fetched data based on question text and name
                    const matchingQuestion = data.find(ques =>
                        ques.question_text === correctQuestion.question_text &&
                        ques.question_name_id === correctQuestion.question_name_id &&
                        ques.answer === userAnswer
                    );

                    // Set results based on whether a match is found or not
                    const resultValue = matchingQuestion ? correctQuestion.mark : 0;

                    return {
                        test_id: testName,
                        question_id: parseInt(questionId),
                        student_id: studentID,
                        answer: userAnswer,
                        result: resultValue,
                        dtm_start: testStartTime, // Use the captured start time
                        dtm_end: new Date(),
                    };
                });


                console.log("Answer Data: ", dataToSubmit);

                // Submit each row of data to the API using a for loop
                const submitPromises = [];
                for (let i = 0; i < dataToSubmit.length; i++) {
                    const row = dataToSubmit[i];
                    submitPromises.push(addTestAnswerMapApi(row)); // Corrected: Passing row directly instead of [row]
                }

                // Execute all promises in sequence
                let allPromises = Promise.resolve();
                for (let i = 0; i < submitPromises.length; i++) {
                    allPromises = allPromises.then(submitPromises[i]);
                }

                allPromises.then(async () => {
                    setErrorMessage('Submitted Successfully');
                    setShowError(true);

                    // alert("Submitted Successfully");

                    // Update total marks
                    const totalResultValue = dataToSubmit.reduce((total, answer) => total + answer.result, 0);
                    const updatedTotalMarks = totalMarks + totalResultValue; // Calculate updated total marks
                    setTotalMarks(updatedTotalMarks); // Update total marks in state
                    console.log('Total MArks: ', updatedTotalMarks); // Log updated total marks

                    const avgMarks = Math.round((updatedTotalMarks / countMarks) * 100);
                    console.log('Avg Mark: ', avgMarks);

                    // Check if this is the last question
                    await updateTestcadidateApi_is_active(selectedCandidateId);
                    await updateTestcadidateApi_submitted(selectedCandidateId);

                    await updateTotalScoreTestcandidateApi(selectedCandidateId, { total_score: updatedTotalMarks }); // Use updated total marks
                    await updateAvgMarkTestcandidateApi(selectedCandidateId, { avg_mark: avgMarks }); // Use updated total marks
                    setTestCompleted(true);
                })
                    .catch((error) => {
                        console.log("Failed to submit", error);
                        setErrorMessage('No Submitted ');
                        setShowError(true);

                        // alert("Not Submitted");
                    });
            })
            .catch(error => {
                console.error('Error Fetching Tests:', error);
            });
    };


    const handleSubmitTimer = useCallback((e) => {
        if (e) e.preventDefault();

        const formData = new FormData(); // Create an empty FormData object since there's no form

        // Capture the current time when the user submits the test
        const endTime = new Date();

        // Calculate the time taken in seconds
        const timeTakenInSeconds = Math.floor((endTime - testStartTime) / 1000);

        // Convert the time taken to minutes and seconds
        const minutesTaken = Math.floor(timeTakenInSeconds / 60);
        setMinsTaken(minutesTaken);
        const secondsTaken = timeTakenInSeconds % 60;
        setSecTaken(secondsTaken);

        // Display the time taken
        console.log(`Time taken: ${minutesTaken} minutes and ${secondsTaken} seconds`);

        // Fetch questions data
        getQuestionApi_IO()
            .then(data => {
                console.log("Data from API:", data); // Log the data fetched from the API

                // Construct answer objects
                const dataToSubmit = Object.keys(answers).map(questionId => {
                    const correctQuestion = questions.find(q => q.id === parseInt(questionId)); // Find the correct question
                    console.log('correct Questions: ', correctQuestion);

                    const userAnswer = answers[questionId]; // Get the user's answer for this question

                    // Find the corresponding question from the fetched data based on question text and name
                    const matchingQuestion = data.find(ques =>
                        ques.question_text === correctQuestion.question_text &&
                        ques.question_name_id === correctQuestion.question_name_id &&
                        ques.answer === userAnswer
                    );

                    // Set results based on whether a match is found or not
                    const resultValue = matchingQuestion ? correctQuestion.mark : 0;

                    return {
                        test_id: testName,
                        question_id: parseInt(questionId),
                        student_id: studentID,
                        answer: userAnswer,
                        result: resultValue,
                        dtm_start: testStartTime, // Use the captured start time
                        dtm_end: new Date(),
                    };
                });

                console.log("Answer Data: ", dataToSubmit);

                // Submit each row of data to the API using a for loop
                const submitPromises = [];
                for (let i = 0; i < dataToSubmit.length; i++) {
                    const row = dataToSubmit[i];
                    submitPromises.push(addTestAnswerMapApi(row)); // Corrected: Passing row directly instead of [row]
                }

                // Execute all promises in sequence
                let allPromises = Promise.resolve();
                for (let i = 0; i < submitPromises.length; i++) {
                    allPromises = allPromises.then(submitPromises[i]);
                }

                allPromises.then(async () => {
                    setErrorMessage('Submitted Successfully');
                    setShowError(true);

                    //  alert("Submitted Successfully");

                    // Update total marks
                    const totalResultValue = dataToSubmit.reduce((total, answer) => total + answer.result, 0);
                    const updatedTotalMarks = totalMarks + totalResultValue; // Calculate updated total marks
                    setTotalMarks(updatedTotalMarks); // Update total marks in state
                    console.log('Total Marks: ', updatedTotalMarks); // Log updated total marks

                    const avgMarks = Math.round((updatedTotalMarks / countMarks) * 100);
                    console.log('Avg Mark: ', avgMarks);

                    // Check if this is the last question
                    await updateTestcadidateApi_is_active(selectedCandidateId);
                    await updateTestcadidateApi_submitted(selectedCandidateId);

                    await updateTotalScoreTestcandidateApi(selectedCandidateId, { total_score: updatedTotalMarks }); // Use updated total marks
                    await updateAvgMarkTestcandidateApi(selectedCandidateId, { avg_mark: avgMarks }); // Use updated total marks
                    setTestCompleted(true);
                })
                    .catch((error) => {
                        console.log("Failed to submit", error);
                        setErrorMessage('No Submitted');
                        setShowError(true);

                        //alert("Not Submitted");
                    });
            })
            .catch(error => {
                console.error('Error Fetching Tests:', error);
            });
    }, [testStartTime, testName, studentID, answers, questions, totalMarks, countMarks, selectedCandidateId]);


    const handleTestCompletionTimer = (e) => {
        if (e) e.preventDefault();
        handleSubmitTimer(e); // Assume handleSubmit is defined elsewhere
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => console.error(err));
        }
        setTestCompleted(true);
    };


    const calculateRemainingTime = (endTime) => {
        const end = moment(endTime);
        const now = moment();
        const remainingSeconds = end.diff(now, 'seconds');
        return remainingSeconds;
    };

    const renderTimer = () => {
        if (selectedTestCandidate.duration_type === 'Start&EndTime') {
            const remainingTimeFromEndTime = calculateRemainingTime(selectedTestCandidate.dtm_end);
            const remainingTime = selectedTestCandidate.duration * 60; // Calculate initial duration in seconds

            // console.log('Remaining time from End Time:', remainingTimeFromEndTime);
            // console.log('SelectedTestCandidate.dtm_end:', selectedTestCandidate.dtm_end);
            return (
                <McqTimer
                    duration={remainingTime <= 0 ? 0 : remainingTime} // Pass duration in seconds
                    setTimeLeftCallback={setTimeLeft}
                    handleTestCompletionTimer={handleTestCompletionTimer}
                    dtmEnd={selectedTestCandidate.dtm_end}
                />
            );
        } else if (selectedTestCandidate.duration_type === 'QuestionTime') {
            const remainingTime = selectedTestCandidate.duration * 60; // Assuming duration is in minutes
            return (
                <McqTimer
                    duration={remainingTime <= 0 ? 0 : remainingTime} // Pass duration in seconds
                    setTimeLeftCallback={setTimeLeft}
                    handleTestCompletionTimer={handleTestCompletionTimer}
                />
            );
        }
        return null; // Return null if none of the conditions match
    };

    const handleArrowClick = (candidateId) => {
        setSelectedCandidateId(candidateId);
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };


    const renderQuestions = ({ timeLeft, setTimeLeft }) => {


        if (questions.length === 0) {
            console.log("Questions: ", questions)
            return <p>No questions available.</p>;
        }

        const totalQuestions = questions.length;


        if (testCompleted) {
            if (secTaken === 0) {
                return <p>Please wait...</p>;
            }

            const questionsWrong = totalQuestions - totalMarks;
            // Display the "Thank you" message and total marks when on the last question
            return (
                <>

                    <div className='dash-border'><h6 style={{ textAlign: "center" }}>Here You Go...</h6></div><br></br>
                    <div className='mcq-border' style={{ padding: "10px", border: '1px solid white', width: '100%', boxSizing: "border-box", boxShadow: "0 8px 16px 0 rgba(0, 0, 0, 0.2)" }}>
                        <h4 style={{ textAlign: 'center' }}>Scores</h4><br></br>
                        <p style={{ color: '#DDFB35' }}>Your Total Marks: {totalMarks}/{countMarks}</p>
                        <p>{questionsWrong} Questions are wrong</p>

                        <p>You have Completed Test in {minsTaken} minutes and {secTaken} seconds </p>
                        <br>
                        </br>
                        <div>
                            {(testTypeCategory === 'Mock/Interview' || testTypeCategory === 'Assessment') && (
                                <button style={{ float: "left", width: "100px" }} onClick={handleReviewClick} className='button-ques-save'>Review</button>
                            )}

                            {(testTypeCategory === 'Mock/Interview' || testTypeCategory === 'Assessment') ? (
                                <button style={{ float: "right", width: "100px" }} disabled={!isReviewComplete} onClick={handleSave} className='button-ques-save'> Finish</button>
                            ) :
                                (
                                    <button style={{ float: "right", width: "100px" }} onClick={handleSave} className='button-ques-save'> Finish</button>
                                )}

                        </div>
                        <p style={{ height: "10px" }}></p>
                        <br></br>
                    </div><br></br>

                    {reviewMode && <CombinedReviewSection questions={questions} answers={answers} />}


                </>
            );
        }

        const renderQuestionButtons = () => {
            const buttonStyle = {
                width: '40px', // Set the fixed width
                height: '40px', // Set the fixed height
                borderRadius: '50%',
                margin: '5px',

                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderStyle: 'double',
                borderColor: 'gray',
            };

            const buttons = [];
            for (let i = 0; i < totalQuestions; i++) {
                //const isCompleted = !!answers[questions[i].id]; // Check if the question is answered
                const isCompleted = !!answers[questions[i].id]; // Check if the question is answered
                const isActive = currentQuestionIndex === i; // Check if the question is active

                // Determine background color based on completion and active status
                const backgroundColor = isActive
                    ? '#F1A128' // Active question color
                    : (isCompleted ? '#F1A128' : 'grey');

                buttons.push(
                    <button
                        key={i}
                        style={{ ...buttonStyle, backgroundColor }}
                        onClick={() => setCurrentQuestionIndex(i)}
                    // variant={currentQuestionIndex === i ? 'rgb(253, 121, 13)' : (isCompleted ? 'success' : 'secondary')}
                    // variant={variant}
                    >
                        {i + 1}
                    </button>
                );
            }

            // Create rows with 4 buttons each
            const rows = [];
            for (let i = 0; i < buttons.length; i += 5) {
                rows.push(
                    <div key={i} style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
                        {buttons.slice(i, i + 5)}
                    </div>
                );
            }

            return rows;
        };



        return (
            <>
                <div className="no-screenshot-overlay"></div>
                <div className='no-select'>
                    <div className='Box'>
                        {selectedTestCandidate && (
                            <div className='duration'>Duration: {selectedTestCandidate.duration} mins</div>
                        )}
                        <div className='questions'>Questions: {questions.length}</div>
                        <div className='marks'>Marks: {countMarks}</div>

                        {/*} <form onSubmit={handleTestCompletion}>
                            <button
                                type="submit"
                                className='button-save12'
                            >
                                Submit
                            </button>
                        </form>*/}
                    </div>
                    <div className='test-container-mcq'>

                        <div className="question-container1-mcq">
                            <div key={questions[currentQuestionIndex].id}>
                                <p className='questions'>{currentQuestionIndex + 1})</p>
                                <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                                    <code>{questions[currentQuestionIndex].question_text}</code>
                                </pre>
                                {questions[currentQuestionIndex].question_image_data && (
                                    <BinaryToImages binaryData={questions[currentQuestionIndex].question_image_data} width="200px" height="200px" />
                                )}
                                <ul style={{ listStyleType: 'none', padding: 0 }}>
                                    {['A', 'B', 'C', 'D'].map(optionLabel => {
                                        const optionText = questions[currentQuestionIndex][`option_${optionLabel.toLowerCase()}`];
                                        const optionImageData = questions[currentQuestionIndex][`option_${optionLabel.toLowerCase()}_image_data`];

                                        // Render if either optionText or optionImageData is not empty
                                        if (optionText || optionImageData) {
                                            return (
                                                <li key={optionLabel} style={{ marginBottom: '10px' }}>
                                                    <label style={{ cursor: 'pointer', display: 'flex' }}>
                                                        <input
                                                            type="radio"
                                                            name={`question_${questions[currentQuestionIndex].id}`}
                                                            value={optionLabel}
                                                            checked={answers[questions[currentQuestionIndex].id] === optionLabel}
                                                            onChange={() => handleOptionSelect(optionLabel)}
                                                            style={{ marginRight: '8px' }}
                                                        />
                                                        <div
                                                            className="option-circle"
                                                            onClick={() => handleOptionSelect(optionLabel)}
                                                        >
                                                            {optionText}
                                                            {optionImageData && (
                                                                <BinaryToImages
                                                                    binaryData={optionImageData}
                                                                    width="60px"
                                                                    height="60px"
                                                                />
                                                            )}
                                                        </div>
                                                    </label>
                                                </li>
                                            );
                                        }

                                        // Return null if optionText is empty
                                        return null;
                                    })}
                                </ul>
                                <br />
                            </div>
                            <div></div>
                            <div className="navigation-container">
                                <button style={{ widh: "110px" }}
                                    onClick={handlePreviousQuestion}
                                    disabled={currentQuestionIndex === 0}
                                    className="button-ques-back-next back-button"
                                >
                                    <FaArrowLeft />
                                    <span className="button-text">Back</span>
                                </button>
                                <div className="submit-button-container">
                                    <button
                                        onClick={handleNextQuestion}
                                        disabled={currentQuestionIndex === questions.length - 1}
                                        className="button-ques-back-next next-button"
                                    >
                                        <FaArrowRight />
                                        <span className="button-text">Next</span>
                                    </button></div>

                                <form onSubmit={handleTestCompletion} >
                                    <button style={{ widh: "110px" }}
                                        type="submit"
                                        className='button-save12'
                                    >
                                        Finish
                                    </button>
                                </form>
                            </div>
                        </div>

                        <div className="question-buttons-container1-mcq">
                            <div style={{ marginBottom: '30px', width: '100%', textAlign: 'center' }}>
                                <div style={{
                                    position: 'relative',
                                    border: '1px solid #ccc',
                                    borderRadius: '5px',
                                    marginBottom: '30px',
                                    padding: '5px',
                                    width: '100%',
                                    background: '#F1A128'
                                }}>
                                    {renderTimer()}

                                    {/*}    <Timer duration={selectedTestCandidate.duration} setTimeLeftCallback={setTimeLeft} />       */}
                                </div>
                                {renderQuestionButtons()}
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );

    };

    const formatDate1 = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        let hours = date.getUTCHours();
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12; // the hour '0' should be '12'
        const strHours = hours.toString().padStart(2, '0');
        return `${day}/${month}/${year} ${strHours}:${minutes} ${ampm}`;
    };

    const currentDateUTC = new Date();
    // console.log('currentUTC: ', currentDateUTC);

    const extractDateComponents = (date) => ({
        day: date.getUTCDate(),
        month: date.getUTCMonth() + 1,
        year: date.getUTCFullYear(),
        hours: date.getUTCHours(),
        minutes: date.getUTCMinutes()
    });

    const currentDateComponents = extractDateComponents(currentDateUTC);
    // console.log('currentDateComponents: ', currentDateComponents);




    return (

        <div className='no-select'>
            <div className="no-screenshot-overlay"></div>
            <div className='product-table-container' style={{ marginLeft: sbar ? '-10px' : '0px' }} >

                <div>
                    <div>
                        {selectedCandidateId === null ? (
                            <div>
                                <div className='hai2'><h6 style={{ textAlign: "center" }}>Hii {salutation}, You have only three chances for the test,<br></br> If you skip all three test, you will be marked 0 and your eligibilty will go down</h6>
                                </div><br></br>

                                <div className="hai2">
                                    <div className='dash-border'>
                                        <h5 style={{ fontWeight: "bold" }}>Upcoming Tests</h5>
                                        <div className="dash-test-container" >
                                            {/* Display test IDs and start dates */}
                                            <header>
                                                <p style={{ width: "380px" }}><strong>Test Name</strong></p>
                                                {/*}  <p style={{ width: "500px" }}><strong>Duration Type</strong></p>*/}
                                                <p style={{ width: "320px", textAlign: "center" }}><strong>Start Date</strong></p>
                                                <p style={{ width: "320px", textAlign: "center" }}><strong>End Date</strong></p>
                                                <p><strong>Start</strong></p>
                                            </header>

                                            {upcommingTests.map(candidate => {
                                                const dtmStart = new Date(candidate.dtm_start.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));
                                                const dtmEnd = new Date(candidate.dtm_end.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));

                                                // console.log('format1 dtm_start: ', formatDate1(candidate.dtm_start));
                                                // console.log('format1 dtm_end: ', formatDate1(candidate.dtm_end));

                                                // console.log('Test:', candidate.test_name);
                                                // console.log('dtmStart:', dtmStart);
                                                // console.log('dtmEnd:', dtmEnd);
                                                // console.log('currentDate:', currentDateOLD);

                                                const isButtonAccessible = candidate.duration_type === 'QuestionTime' ||
                                                    (candidate.duration_type === 'Start&EndTime' &&
                                                        currentDateUTC >= dtmStart && currentDateUTC <= dtmEnd);

                                                return (
                                                    <div key={candidate.id} className="dash-test-item">
                                                        <p style={{ width: "380px" }}>{candidate.test_name}</p>
                                                        {/*} <p style={{ width: "500px" }}>{candidate.duration_type}</p>*/}
                                                        <p style={{ width: "320px", textAlign: "center" }}>{formatDate1(candidate.dtm_start)}</p>
                                                        <p style={{ width: "320px", textAlign: "center" }}>{formatDate1(candidate.dtm_end)}</p>

                                                        <p>
                                                            <button
                                                                style={{
                                                                    backgroundColor: isButtonAccessible ? "#F1A128" : "#ccc",
                                                                    padding: "10px",
                                                                    border: "none",
                                                                    borderRadius: "4px",
                                                                    cursor: isButtonAccessible ? "pointer" : "not-allowed"
                                                                }}
                                                                onClick={isButtonAccessible ? () => handleArrowClick(candidate.id) : null}
                                                                disabled={!isButtonAccessible}
                                                            >
                                                                <FaArrowRight style={{ color: "black" }} />
                                                            </button>
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>

                            </div>

                        ) : null} {/* Render nothing when a candidate is selected */}
                    </div>
                </div>
                {/* Render questions */}
                <div className='form-ques-mcq23'>{selectedTestCandidate && renderQuestions({ timeLeft, setTimeLeft })}</div>

                {/* Start Test Section */}
                {selectedCandidateId !== null && !selectedTestCandidate && (
                    <div className='hai2' >
                        <div className='hai2'><h6 style={{ textAlign: "center" }}>YOU MUST BEFORE YOU GO...</h6></div><br></br>

                        <div className="hai2">
                            <div className="instructions">
                                {testCandidates
                                    .find(candidate => candidate.id === selectedCandidateId)
                                    .instruction.split(/(?<=\.)\s/).map((instruction, index) => (
                                        <p key={index} className="instruction-item">
                                            {index + 1}. {instruction.trim()}
                                        </p>
                                    ))}
                            </div>
                            < p></p>
                            <div style={{ display: 'grid', placeItems: 'center' }}>
                                <button
                                    style={{ border: 'none', width: "100px" }}
                                    onClick={() => handleGoForTest(selectedCandidateId)}
                                    className='ques-save'
                                >
                                    Start
                                </button>
                            </div>

                        </div>





                    </div>
                )}
                <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

            </div></div>
    );
};

export default AttendOnlineMockTest;
