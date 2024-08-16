import React, { useState, useEffect } from 'react';
import { MDBBtn, MDBContainer, MDBCard, MDBCardBody, MDBCardImage, MDBRow, MDBCol, MDBIcon, MDBInput } from 'mdb-react-ui-kit';
import './Login.css';
import LoginImage from "../../assets/Images/login-image1.jpeg";
import Logo from "../../assets/Images/Logo.jpg";

import { getLoginApi, getcollegeApi } from '../../api/endpoints';
import Students from '../../Students';
import App from '../../App';
import ErrorModal from './ErrorModal';
//import Placementadmin from '../../Placementadmin';
//import Superadmin from '../../Superadmin';

import Trainer from '../../Trainers'
//import Corporate from '../../Corporate';
import PlacementAdmin from '../../Placement';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [institute, setInstitute] = useState('');

    const [error, setError] = useState(null);
    const [userRole, setUserRole] = useState('');
    const [selectedRole, setSelectedRole] = useState('Placement admin');
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize isLoggedIn state
    const [rememberMe, setRememberMe] = useState(false);
    const [showError, setShowError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isRegisterMode, setIsRegisterMode] = useState(false);
    const [role, setRole] = useState('');
    const [collegeName, setCollegeName] = useState('');
    const [loggedInInstitute, setLoggedInInstitute] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        // Check if rememberMe is set to true
        if (rememberMe) {
            const storedusername = localStorage.getItem('rememberedusername');
            const storedPassword = localStorage.getItem('rememberedPassword');

            if (storedusername && storedPassword) {
                setUsername(storedusername);
                setPassword(storedPassword);
            }
        }
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await getLoginApi(); // Assuming getLoginApi returns a promise
            console.log('API Response:', response);

            // Check if there is at least one user in the response
            if (response.length > 0) {
                let found = false;

                for (let i = 0; i < response.length; i++) {
                    const user = response[i];

                    // Check if the current user meets all conditions
                    if (user.user_name === username && user.password === password) {
                        found = true;
                        setIsLoggedIn(true);
                        // setLoggedInUser(user.user_name);
                        setUserRole(user.role);
                        console.log('test1', user.user_name)
                        setInstitute(user.college_id)
                        console.log('CollegeID: ', user.college_id);
                        setLoggedInInstitute(user.college_id);

                        setErrorMessage('Login Successfully');
                        setShowError(true);

                        getcollegeApi(user.college_id)
                            .then(colleges => {
                                // Find the college object with the matching college_id
                                const matchedCollege = colleges.find(college => college.id === user.college_id);

                                if (matchedCollege) {
                                    console.log('College Name:', matchedCollege.college);
                                    setCollegeName(matchedCollege.college);
                                } else {
                                    console.error('College not found for college_id:', user.college_id);
                                    setCollegeName(''); // Set college name to empty string if college is not found
                                }
                            })
                            .catch(error => {
                                console.error('Error fetching College:', error);
                                setCollegeName(''); // Set college name to empty string in case of error
                            });

                        // If rememberMe is checked, store email and password in local storage
                        if (rememberMe) {
                            localStorage.setItem('rememberedEmail', email);
                            localStorage.setItem('rememberedPassword', password);
                        }

                        break; // Exit the loop once a matching user is found
                    } else {
                        setErrorMessage('Invalid email, password');
                        setShowError(true);
                    }
                    if (isLoggedIn) {
                        onLogin(username);
                    }
                }
            } else {
                setErrorMessage('No users found');
                setShowError(true); // Handle case where no users are returned
            }
        } catch (error) {
            console.error('Error:', error);
            setError('An error occurred while logging in');
            setErrorMessage('An error occurred while logging in');
            setShowError(true);
        }
    };

    const handleCloseError = () => {
        setShowError(false);
    };

    return (
        <div>
            {isLoggedIn ? (
                (() => {
                    switch (userRole) {
                        case 'Placement admin':
                            return <PlacementAdmin username={username} collegeName={collegeName} institute={institute} />;
                        case 'Training admin':
                            return <App username={username} collegeName={collegeName} institute={institute}  />;
                        // case 'Super admin':
                        // return <App username={username} collegeName={collegeName} />;
                        case 'Student':
                            return <Students username={username} collegeName={collegeName} institute={institute}  />;
                       
                        case 'Trainer':
                            return <Trainer username={username} collegeName={collegeName} institute={institute}  />;
                        // case 'Corporate':
                        //  return <Corporate />;
                        // case 'Profile':
                        // return <App />;
                        default:
                            alert('Something went wrong. Please contact support.');
                            setIsLoggedIn(false);
                            return <Login />; // or any other appropriate fallback
                    }
                })()
            ) : (
                <>
                    <div className="App-login">
                        <div
                            className="signin-container-login"
                            style={{ marginBottom: "40px", marginTop: "-45px" }}
                        >
                            <div className="signin-box-login" style={{width:"450px"}}>
                                <img
                                    src={Logo}
                                    alt="Campus Connection Logo"
                                    className="logo-login"
                                    style={{ marginBottom: "30px", marginTop: '10px' }}
                                />
                                <p style={{
                                    fontSize: "55px",
                                    marginTop: "-10px"
                                }}>Welcome</p>

                                <p
                                    style={{
                                        fontSize: "20px",
                                        fontWeight: "bold",
                                        marginTop: '-30px'
                                    }}
                                >
                                    Please sign in before continuing.
                                </p>
                                <form onSubmit={handleLogin}>
                                    <div className="form-group-login">
                                        <label htmlFor="username"
                                            style={{ fontWeight: "bold" }}>
                                            Username
                                        </label>

                                        <input
                                            type="text"
                                            id="username"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                            placeholder="Username"
                                            className="form-input-login"
                                            style={{ width: "100%" }}
                                        />
                                    </div>
                                    <div className="form-group-login">
                                        <label htmlFor="password"
                                            style={{ fontWeight: "bold" }}>
                                            Password
                                        </label>
                                        <div className="password-container-login">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                id="password"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                                placeholder="Password"
                                                className="form-input-login"
                                            />
                                            <span
                                                className="toggle-password-login"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </span>
                                        </div>
                                    </div>
                                    <div className="form-footer-login">
                                        <div className="remember-me-login">
                                            <input type="checkbox" id="rememberMe" />
                                            <label
                                                htmlFor="rememberMe"
                                                style={{
                                                    fontSize: "15px",
                                                    fontWeight: "bold"
                                                }}
                                            >
                                                Remember me
                                            </label>
                                        </div>
                                        <a
                                            href="#"
                                            className="forgot-password-login"
                                            style={{
                                                fontSize: "15px",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            Forgot Password?
                                        </a>
                                    </div>
                                    <button
                                        type="submit"
                                        className="signin-button-login"
                                        style={{ fontWeight: "bold" }}
                                    >
                                        Sign In
                                    </button>
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                </form>
                                <ErrorModal show={showError} handleClose={handleCloseError} errorMessage={errorMessage} />
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Login;
