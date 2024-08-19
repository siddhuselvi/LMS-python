import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from 'react-bootstrap';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import {
    updateTestcadidateApi_is_active,
    updateTotalScoreTestcandidateApi,
    getTestAnswerMapApi,
    addTestAnswerMapApi_Code_Submit_Com,
    InsertFirstOutput_API,
    getTestcandidate_CODING_Api,
    getQuestionApi_Filter_IO_CODE,
    deleteTestAnswer_Api,
    getTotalMarks_API,
    updateTestcadidateApi_submitted,
    updateTestcadidateApi_teststarted,
} from "../../../api/endpoints";
import { useNavigate } from 'react-router-dom';
import Timer from './Timer';
import OnlineCoding from '../OnlineCoding'
import ErrorModal from '../../../Components/auth/ErrorModal';
import { useTestContext } from '../contextSub/Context'
import '../../../Styles/global.css';
import moment from 'moment';
import CodingTimer from './CodingTimer';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AttendCodeTest = ({ collegeName, username, isSidebarOpen, disableSidebar, enableSidebar }) => {
    const { questionIdCon,
        setQuestionIdCon,
        testIdCon,
        setTestIdCon,
        studentIdCon,
        setStudentIdCon,
        selectedQuestionsCon,
        setSelectedQuestionsCon,
        testStartTimeCon,
        setTestStartTimeCon,
        outputWinAns,
        setOutputWinans,
        codeWindow,
        setCodeWindow,
        languageSelected,
        setLanguageSelected,
        customInputCom,
        setCustomInputCom } = useTestContext();

    const navigate = useNavigate();
    const [testCandidates, setTestCandidates] = useState([]);
    const [upcommingTests, setUpcommingTests] = useState([]);
    const [selectedCandidateId, setSelectedCandidateId] = useState(null);
    const [selectedTestCandidate, setSelectedTestCandidate] = useState(null);
    const [testStartTime, setTestStartTime] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [questionId_f, setQuestionId_f] = useState(null);
    const [testId_f, setTestId_f] = useState([null]);
    const [studentId_f, setStudentId_f] = useState(null);
    const [selectedQuestionID, setSelectedQuestionID] = useState(null);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [showQuestionPage, setShowQuestionPage] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [timerDuration, setTimerDuration] = useState(null);
    const outerTextRef = useRef('');
    const [completedQuestions, setCompletedQuestions] = useState([]);
    const [totalMarks, setTotalMarks] = useState(0);
    const [countMarks, setCountMarks] = useState(0);
    const [minsTaken, setMinsTaken] = useState('');
    const [secTaken, setSecTaken] = useState('');
    const [testCompleted, setTestCompleted] = useState(false);
    const [showFinalPage, setShowFinalPage] = useState(false); // State to control final page visibility

    const [testId_ans, setTestId_ans] = useState([null]);
    const [studentId_ans, setStudentId_ans] = useState(null);
    const [ansTotalMarks, setAnsTotalMarks] = useState(0);
    const [sbar, setSBar] = useState(false);
    const [salutation, setSalutation] = useState('');
    const [isReviewComplete, setIsReviewComplete] = useState(false);
    const currentDateOLD = new Date();
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [processing, setProcessing] = useState(null);
    const [explainAnswer, setExplainAnswer] = useState(null);
    const [questionMark, setQuestionMark] = useState(0);
    const [questionAnswer, setQuestionAnswer] = useState(null);
    const [submittedResults, setSubmittedResults] = useState([]);
    const [totalResults, setTotalResults] = useState(0);
    const [testAnswers, setTestAnswers] = useState([]);

    const handleCloseError = () => {
        setShowError(false);
    };
    const [testName, setTestName] = useState('');

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
        getTestCandidates();
    }, [collegeName, username]);

    const getTestCandidates = () => {
        getTestcandidate_CODING_Api(username)
            .then(testCandidatesData => {
                setTestCandidates(testCandidatesData);
                setUpcommingTests(testCandidatesData);
                console.log('upcommingTest: ', testCandidatesData)
            })
            .catch(error => {
                console.error('Error fetching test candidates:', error);
            });
    };





    useEffect(() => {
        const preventScreenshot = (e) => {
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                setErrorMessage('Screenshots are disabled for this page.');
                setShowError(true);
                // alert('Screenshots are disabled for this page.');
            }
        };

        const preventContextMenu = (e) => {
            e.preventDefault();
            setErrorMessage('Right-click is disabled for this page.');
            setShowError(true);
            // alert('Right-click is disabled for this page.');
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
            // alert('Right-click is disabled for this page.');
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
                // alert('If you exit the screen, you cannot attend the test again.');
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
        setTestCompleted(true);
        handleSubmit(e); // Assume handleSubmit is defined elsewhere
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => console.error(err));
        }
    };

    const handlefinish = async (e) => {
        if (isReviewComplete) {
            // Handle save/finish logic
            console.log("Finished");

            try {
                // Call the delete API and wait for the response
                await deleteTestAnswer_Api(studentId_ans);

                // Optionally, you can handle any post-delete logic here
                console.log("Test answer deleted successfully");

                // Enable the sidebar and navigate only after successful API call
                enableSidebar();
                navigate('/dashboard');
            } catch (error) {
                // Handle errors from the delete API call
                console.error("Failed to delete test answer:", error);
            }
        } else {
            console.log("Review is not complete");
        }
    };

    const handleSave = async (e) => {
        if (e) e.preventDefault();
        setSBar(false);
        await updateTestcadidateApi_is_active(selectedCandidateId);
        await updateTestcadidateApi_submitted(selectedCandidateId);
        // setTimeout(() => {
        //     setIsReviewComplete(true);
        // }, 1000);
        // enableSidebar();
        // navigate('/dashboard'); 
        // Capture the current time when the user submits the test
        setIsReviewComplete(true);
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

        setTestCompleted(true);

        // Fetch the total marks and update the state
        const { total_marks } = await getTotalMarks_API(studentId_ans, testId_ans);
        setAnsTotalMarks(total_marks); // Adjust if the API returns a different structure


        updateTotalScoreTestcandidateApi(selectedCandidateId, { total_score: total_marks }); // Use updated total marks
        const allQuestionIds = questions.map(question => question.id);
        setCompletedQuestions(allQuestionIds);

        setShowFinalPage(true);

    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleArrowClick = (candidateId) => {
        setSelectedCandidateId(candidateId);
        console.log('selected Test Assign id: ', candidateId);
    };

    const handleGoForTest = async (selectedCandidateId) => {
        const candidate = testCandidates.find(candidate => candidate.id === selectedCandidateId);
        setSelectedTestCandidate(candidate);
        setShowQuestionPage(true);
        console.log('setSelectedTestCandidate: ', candidate);
        setTestIdCon(candidate.test_name);
        console.log('test_name: ', candidate.test_name);

        setTestName(candidate.test_name);
        console.log('setTestName: ', candidate.test_name);


        setTestId_ans(candidate.test_name);
        setStudentId_ans(candidate.student_id__id);

        {/*}    try {
            await InsertFirstOutput_API(candidate.student_id);
            console.log('Inserted empty output for student_id:', candidate.student_id);
        } catch (error) {
            console.error('Error inserting empty output:', error);
            // Handle the error appropriately, e.g., show a message to the user
        }
        */}

        setTestStartTime(new Date());
        setTestStartTimeCon(new Date());
        disableSidebar();
        setSBar(true);
        setShowFinalPage(false);
        getQuestionApi_Filter_IO_CODE(candidate.question_id__id)
            .then(questionsData => {

                setQuestions(questionsData);
                console.log('filtered questions: ', questionsData);

                // Calculate total marks
                const totalMarks1 = questionsData.reduce((total, question) => total + question.mark, 0);
                console.log('total marks: ', totalMarks1);
                setCountMarks(totalMarks1);
            })
            .catch(error => {
                console.error('Error fetching questions:', error);
            });

            // Update test candidate status to 'test started'
            try {
                await updateTestcadidateApi_teststarted(selectedCandidateId);
        
                // Fetch and update test answers
                const testAnswerData = await getTestAnswerMapApi(username);
                setTestAnswers(testAnswerData);
        
                // Update completedQuestions with question IDs from testAnswerData
                setCompletedQuestions(prevCompletedQuestions => [
                    ...prevCompletedQuestions,
                    ...testAnswerData.map(answer => answer.question_id__id)
                ]);

                // Calculate total results from testAnswerData
                const totalResults = testAnswerData.reduce((total, answer) => total + (answer.result || 0), 0);
                setTotalResults(totalResults);
        
                // console.log('Test answers fetched: ', testAnswerData);
            } catch (error) {
                console.error('Error fetching test answers or updating test candidate status:', error);
            }

    };

    const handleBackToQuestions = () => {
        console.log('Going back to question list...');
        setShowQuestionPage(true);
    };

    const renderCommonElements = () => (
        <>
            <div style={{ display: 'flex' }}>
                <div className='Box' style={{ marginLeft: '0px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            {selectedTestCandidate && <div style={{ marginRight: '10px' }}>Duration: {selectedTestCandidate.duration} mins</div>}
                            <div style={{ marginRight: '10px' }}>Questions: {questions.length}</div>
                            {/* Assuming questions have a 'Marks' property */}
                            <div>
                                Marks: {questions.reduce((acc, q) => {
                                    // Check if q.marks is a valid number
                                    if (!isNaN(q.mark)) {
                                        return acc + q.mark;
                                    } else {
                                        return acc;
                                    }
                                }, 0)}
                            </div>
                        </div>
                        <div className='display-flex-code'>
                            {showQuestionPage === false && (
                                <div style={{ margin: '10px' }}>
                                    <form onSubmit={(e) => handleSubmit(e)}>
                                        <button type="submit" className="btn-sizes">{processing ? "Processing.." : "Submit"}</button>
                                    </form>
                                </div>)
                            }

                            <div className='timer-code' >

                                {renderTimer()}
                                {/*<Timer duration={showFinalPage ? 0 : selectedTestCandidate.duration} setTimeLeftCallback={setTimeLeft} />        */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {showQuestionPage ? renderQuestionList() : renderQuestionDetail()}

        </>

    );


    const renderQuestionList = () => {
        // console.log('Completed questions: ', completedQuestions);

        // Example data
        const allQuestionIds1 = questions.map(question => question.id);

        // Function to check if all questions are answered
        const allQuestionsCompleted = allQuestionIds1.every(id => completedQuestions.includes(id));


        // Render the list of questions
        return (
            <div>
                <div className="questions-container-code">
                    {questions.map(question => {
                        // Check if the question is completed
                        const isCompleted = completedQuestions.includes(question.id) ||
                            testAnswers.some(answer =>
                                answer.student_id__id === studentId_ans &&
                                answer.test_name === testId_ans &&
                                answer.question_id__id === question.id &&
                                answer.answer?.length > 0
                            )|| 
                            submittedResults.some(result =>
                                result.ques_id === question.id
                            );

                            // Find the submitted result for the question
                            const submittedResult = submittedResults.find(result => result.ques_id === question.id);
                            // Find the test answer for the question (if needed)
                            const testAnswer = testAnswers.find(answer => answer.question_id__id === question.id);
            
                        return (
                            <div key={question.id} className={`question-item-code ${isCompleted ? 'question-item-code-disabled' : ''}`}>
                                <button
                                    onClick={() => handleAttentQues(question.id, question)}
                                    className="question-button-code"
                                    disabled={isCompleted} // Disable the button if the question is completed
                                >
                                    {question.question_text}
                                    <span style={{ float: 'right' }}>
                                        {isCompleted ? 'Completed' : 'Solve Challenge'}
                                    </span>
                                </button>
                                {submittedResult && (
                                    <div className="question-answer">
                                        Mark: {submittedResult.result}
                                    </div>
                                )}
                                {testAnswer && (
                                    <div className="question-answer">
                                        Mark: {testAnswer.result}
                                    </div>
                                )}
                            </div>
                        );
                    })}


                    <div className="button-container-lms" style={{ width: '100%', marginLeft: '-50px' }}>
                        <button className="button-ques-save  save-button-lms"
                            style={{
                                width: "100px",
                            }}
                            disabled={!allQuestionsCompleted}
                            onClick={handleSave}>Review</button>
                        <button className="button-ques-save  save-button-lms"
                            disabled={!isReviewComplete}
                            style={{
                                width: "100px",
                            }} onClick={handlefinish}>Finish</button>

                    </div>
                </div>
                {/*}    <button className="button-ques-save" style={{ float: "left", width: "100px", marginTop: "20px", marginLeft: "100px" }} onClick={handleSave}>Review</button>     */}
                {/*}    <button className="button-ques-save" disabled={!isReviewComplete} style={{ float: "right", width: "100px", marginTop: "20px", marginRight: "180px" }} onClick={handlefinish}>Finish</button>    */}

            </div>
        );
    };






    const handleAttentQues = async (questionId, question) => {
        disableSidebar();
        setShowFinalPage(false);
        setTestId_f(selectedTestCandidate.test_name);
        console.log('Final selected Test ID: ', selectedTestCandidate.testname);

        setStudentId_f(selectedTestCandidate.student_id__id);
        setStudentIdCon(selectedTestCandidate.student_id__id);
        console.log('Final selected Student ID: ', selectedTestCandidate.student_id__id);


        // try {
        //     await InsertFirstOutput_API(selectedTestCandidate.student_id__id);
        //     console.log('Inserted empty output for student_id:', selectedTestCandidate.student_id__id);
        // } catch (error) {
        //     console.error('Error inserting empty output:', error);
        //     // Handle the error appropriately, e.g., show a message to the user
        // }


        setQuestionId_f(questionId);
        setSelectedQuestionID(questionId);
        setQuestionIdCon(questionId);
        console.log('Final selected Question ID: ', questionId);

        setSelectedQuestion(question);
        setSelectedQuestionsCon(question);
        console.log('Final selected Questions: ', question);
        setExplainAnswer(question.explain_answer);
        setQuestionMark(question.mark);
        setQuestionAnswer(question.answer);
        setShowQuestionPage(false);
    };

    const renderQuestionDetail = () => {
        // console.log('Rendering question detail...');
        return (
            <div>

                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                />

                {/*}   {renderCommonElements()}  */}
                <br />

                <div className='test-container'>
                    <div className="question-container1">
                        <h4 style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1rem', fontWeight: '600', color: '#b7c3dd' }}>{selectedQuestion.question_text}</h4>

                        <h5>Input Instruction: </h5>
                        <p style={{ marginLeft: '80px' }}>{selectedQuestion.input_format}</p>
                    </div>
                    <div className="question-buttons-container">
                        <div>
                            <OnlineCoding />
                        </div>
                    </div>
                </div>
                {/*}  <button
                    onClick={handleBackToQuestions}
                    style={{
                        marginTop: '20px'
                    }}
                    className="button-ques-back-next back-button"
                >
                    <FaArrowLeft />
                    <span className="button-text">Back to Questions</span></button>*/}
            </div>
        );
    };

    const showErrorToast = (msg, timer) => {
        toast.error(msg || `Something went wrong! Please try again.`, {
            position: "top-right",
            autoClose: timer ? timer : 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    };

    const handleSubmit = (e) => {
        console.log('Handle Submit..');

        setProcessing(true);

        e.preventDefault();

        // Check if codeWindow is null or empty
        if (!codeWindow || !codeWindow.trim()) {
            console.log('Code Window is Empty');
            setErrorMessage('Code Window is Empty');
            setShowError(true);
            setProcessing(false);
            // showErrorToast('Code Window is Empty');
            return;
        }

        // Capture the current time when the user submits the test
        const endTime = new Date();
        // Construct answer objects
        const dataToSubmit = {
            test_name: testId_f,
            question_id: questionId_f,
            student_id: studentId_f,
            dtm_start: testStartTime,
            dtm_end: endTime,
            code: codeWindow,
            p_type: languageSelected,
            inputs: customInputCom,
            explain_answer: explainAnswer,
            mark: questionMark,
            answer: questionAnswer
        };

        console.log("Data to submit: ", dataToSubmit);

        addTestAnswerMapApi_Code_Submit_Com(dataToSubmit)
            .then((response) => {
                setProcessing(false);
                setErrorMessage('Submitted Successfully');
                setShowError(true);
                console.log('response: ', response);

                const newResult = { ques_id: response.question_id, result: response.result };
                const updatedResults = [...submittedResults, newResult];

                setSubmittedResults(updatedResults);

                // Update totalResults by adding the new result to the current totalResults
                const newTotal = totalResults + response.result;

                //const newTotal = updatedResults.reduce((acc, curr) => acc + curr.result, 0);
                setTotalResults(newTotal);

                setShowQuestionPage(true);
                setCompletedQuestions(prevCompletedQuestions => [...prevCompletedQuestions, selectedQuestionID]);
                setCodeWindow('');
            })
            .catch(error => {
                console.error("Failed to submit", error);
                setProcessing(false);
                setErrorMessage('Not Submitted');
                setShowError(true);
            });
    };




    const handleTestCompletionTimer = (e) => {
        if (e) e.preventDefault();
        setTestCompleted(true);
        setShowQuestionPage(true);
        //setShowFinalPage(true);
        //handleSave()
        const allQuestionIds = questions.map(question => question.id);
        setCompletedQuestions(allQuestionIds);
        // handleSubmitTimer(e); // Assume handleSubmit is defined elsewhere
        if (document.fullscreenElement) {
            document.exitFullscreen().catch((err) => console.error(err));
        }
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

            //  console.log('Remaining time from End Time:', remainingTimeFromEndTime);
            //  console.log('SelectedTestCandidate.dtm_end:', selectedTestCandidate.dtm_end);

            return (
                <CodingTimer
                    duration={remainingTime <= 0 ? 0 : remainingTime}
                    setTimeLeftCallback={setTimeLeft}
                    handleTestCompletionTimer={handleTestCompletionTimer}
                    showFinalPage={showFinalPage}
                    dtmEnd={selectedTestCandidate.dtm_end}
                />
            );
        } else if (selectedTestCandidate.duration_type === 'QuestionTime') {
            const remainingTime = selectedTestCandidate.duration * 60; // Assuming duration is in minutes
            return (
                <CodingTimer
                    duration={remainingTime <= 0 ? 0 : remainingTime} // Pass duration in seconds
                    setTimeLeftCallback={setTimeLeft}
                    handleTestCompletionTimer={handleTestCompletionTimer}
                    showFinalPage={showFinalPage}
                />
            );
        }
        return null; // Return null if none of the conditions match
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
    //console.log('currentUTC: ', currentDateUTC);

    const extractDateComponents = (date) => ({
        day: date.getUTCDate(),
        month: date.getUTCMonth() + 1,
        year: date.getUTCFullYear(),
        hours: date.getUTCHours(),
        minutes: date.getUTCMinutes()
    });

    const currentDateComponents = extractDateComponents(currentDateUTC);
    //console.log('currentDateComponents: ', currentDateComponents);




    return (
        <div className='no-select'>
            <div className="no-screenshot-overlay"></div>
            <div className='product-table-container' style={{ marginLeft: sbar ? '-10px' : '0px' }} >
                <div>
                    {selectedCandidateId === null ? (
                        <div>
                            <div className='hai2'>
                                <h6 style={{ textAlign: "center" }}>
                                    Hii  {salutation}, You have only three chances for the test,<br></br>
                                    If you skip all three test, you will be marked 0 and your eligibilty will go down
                                </h6>
                            </div>
                            <br />
                            <div className="hai">

                                <div className='dash-border' >
                                    <h3>Upcoming Tests</h3>
                                    <div className="dash-test-container" >
                                        {/* Display test IDs and start dates */}
                                        <header>
                                            <p style={{ width: "500px" }}><strong>Test Name</strong></p>
                                            {/*}    <p style={{ width: "500px" }}><strong>Duration Type</strong></p>    */}
                                            <p style={{ width: "250px" }}><strong>Start Date</strong></p>
                                            <p style={{ width: "250px" }}><strong>End Date</strong></p>
                                            <p><strong>Start</strong></p>
                                        </header>
                                        {upcommingTests.map(candidate => {
                                            const dtmStart = new Date(candidate.dtm_start.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));
                                            const dtmEnd = new Date(candidate.dtm_end.replace(/-/g, '/').replace(/T/g, ' ').replace(/Z/g, ''));

                                            {/*}  console.log('format1 dtm_start: ', formatDate1(candidate.dtm_start));
                                        console.log('format1 dtm_end: ', formatDate1(candidate.dtm_end));

                                        console.log('Test:', candidate.test_name);
                                        console.log('dtmStart:', dtmStart);
                                        console.log('dtmEnd:', dtmEnd);
                                        console.log('currentDate:', currentDateOLD);        */}

                                            const isButtonAccessible = candidate.duration_type === 'QuestionTime' ||
                                                (candidate.duration_type === 'Start&EndTime' &&
                                                    currentDateUTC >= dtmStart && currentDateUTC <= dtmEnd);

                                            return (
                                                <div key={candidate.id} className="dash-test-item">
                                                    <p style={{ width: "500px" }}>{candidate.test_name}</p>
                                                    {/*}    <p style={{ width: "500px" }}>{candidate.duration_type}</p>     */}
                                                    <p style={{ width: "250px" }}>{formatDate1(candidate.dtm_start)}</p>
                                                    <p style={{ width: "250px" }}>{formatDate1(candidate.dtm_end)}</p>
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
                    ) : null}
                </div>
                <div >
                    {selectedTestCandidate && renderCommonElements()}</div>
                {/*}    {showQuestionPage && renderQuestionDetail()}    */}
                {selectedCandidateId !== null && !selectedTestCandidate && (
                    <div className='hai' >
                        <div className='hai2'><h6 style={{ textAlign: "center" }}>YOU MUST BEFORE YOU GO...</h6></div><br />
                        <div className="hai2">
                            {/* Display instructions with numbers */}
                            <div className="instructions">
                                {testCandidates
                                    .find(candidate => candidate.id === selectedCandidateId)
                                    .rules_id__instruction.split(/(?<=\.)\s/) // Split by periods followed by a space
                                    .map((rules_id__instruction, index) => (
                                        <p key={index} className="instruction-item">
                                            {index + 1}. {rules_id__instruction.trim()}
                                        </p>
                                    ))}
                            </div>
                            <br />
                            <div style={{ display: 'grid', placeItems: 'center' }}>
                                <button style={{ border: 'none' }} className='btn-sizes' onClick={() => handleGoForTest(selectedCandidateId)}>
                                    Start
                                </button>
                            </div>
                        </div>

                    </div>
                )}
                {testCompleted}
                {showFinalPage && (
                    <div>

                        <br></br>
                        <div className='scores'>
                            <h4 style={{ textAlign: 'center' }}>Scores</h4><br></br>
                            <p style={{ color: '#DDFB35' }}>Your Total Marks: {totalResults}/{countMarks}</p>
                            {/*}    <p>{questionsWrong} Questions are wrong</p>     */}

                            <p>You have Completed Test in {minsTaken} minutes and {secTaken} seconds </p>
                            <br>
                            </br>


                            <br></br><br></br>

                        </div><br></br>


                    </div>
                )}
                <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />

            </div></div>
    );
};

export default AttendCodeTest;