import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  useMediaQuery,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Button,
  Tooltip,

} from "@mui/material";
import './header.css'
import SearchIcon from "@mui/icons-material/Search";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useContext } from "react";
import { ThemeContext } from "../ThemeContext";
import Logo from "../assets/Images/Logo.jpg";
import { SearchContext } from "../AllSearch/SearchContext";
import { Link } from "react-router-dom";
import { useTheme } from "@mui/material";
import { getCollege_logo_API, log_out_API, updateStudentRequestStatusApi, getStudentRequests, getStudentRequestCount } from '../../src/api/endpoints';
import App from "../App";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = ({ collegeName, username, userRole }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [collegeLogo, setCollegeLogo] = useState(null);
  const [requestCount, setRequestCount] = useState(0);
  const [studentRequests, setStudentRequests] = useState([]);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  // State to track which item is being hovered
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    // Fetch request count and student requests on component mount
    refreshStudentRequests();

    getCollege_logo_API()
      .then((data) => {
        const college = data.find(college => college.college === collegeName);
        if (college && college.college_logo) {
          setCollegeLogo(college.college_logo);
        }
      })
      .catch((error) => {
        console.error("Error fetching college data:", error);
      });
  }, [collegeName]);

  const refreshStudentRequests = () => {
    if (userRole === 'Training admin') {
      getStudentRequestCount()
        .then((count) => setRequestCount(count))
        .catch((error) => console.error("Error fetching request count:", error));

      getStudentRequests()
        .then((requests) => {
          // Filter requests to only show those with status 'Pending' or similar
          const pendingRequests = requests.filter(request => request.status === "Pending");
          setStudentRequests(pendingRequests);
          setRequestCount(pendingRequests.length); // Update the notification count based on pending requests
        })
        .catch((error) => console.error("Error fetching student requests:", error));
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    log_out_API()
      .then((response) => {
        console.log('Logout successful:', response);
        window.location.href = 'https://ccportal.co.in';
      })
      .catch((error) => {
        console.error('Error during logout:', error);
      });
  };

  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (option) => {
    if (option === "logout") {
      handleLogout();
    } else if (option === "settings") {
      console.log("Settings selected");
    }
    handleMenuClose();
  };

  const handleIconClick = () => {
    setIsPopoverOpen(true);
    refreshStudentRequests(); // Refresh the list and count when the icon is clicked
  };

  const handleDecline = async (studentId) => {
    try {
      await updateStudentRequestStatusApi(studentId, "Declined");
      setStudentRequests(prevRequests =>
        prevRequests.filter(request => request.student_id !== studentId)
      );
      setRequestCount(prevCount => prevCount - 1, 0); // Decrease the count immediately
      refreshStudentRequests();

    } catch (error) {
      console.error(`Failed to decline request with Student ID: ${studentId}`, error);
    }
  };

  const handleAccept = async (studentId) => {
    try {
      await updateStudentRequestStatusApi(studentId, "Accepted");
      setStudentRequests(prevRequests =>
        prevRequests.filter(request => request.student_id !== studentId)
      );
      setRequestCount(prevCount => prevCount - 1, 0); // Decrease the count immediately
      refreshStudentRequests();

    } catch (error) {
      console.error(`Failed to accept request with Student ID: ${studentId}`, error);
    }
  };

  const handleClose = () => {
    setIsPopoverOpen(false);
  };

  return (
    <AppBar
      style={{
        top: 0,
        zIndex: 1000,
        backgroundColor: "#39444e",
        position: "sticky",
        position: "-webkit-sticky",
      }}
    >
      <Toolbar>
        <img
          style={{ borderRadius: "8px", width: "140px", height: "auto" }}
          src={Logo}
          className="Campus-logo"
          alt="Campus Connection Logo"
        />
        <div variant="h6" className="headerss-container">
          {collegeLogo && (
            <img
              src={`data:image/png;base64,${collegeLogo}`}
              alt={`${collegeName} Logo`}
              className="headerss-logo"
            />
          )}
          <span className="headerss-text">{collegeName}</span>
        </div>

        <div style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}>
          {!isMobile && (
            <IconButton edge="start" color="inherit">
              <SearchIcon />
            </IconButton>
          )}
          <div
            style={{
              border: "1.5px solid #ccc",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              marginLeft: isMobile ? "auto" : "10px",
            }}
          >
            <InputBase
              placeholder="Search…"
              style={{
                color: "inherit",
                paddingLeft: "10px",
                paddingRight: "10px",
                width: isMobile ? "120px" : "200px",
              }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <IconButton color="inherit">
            <Badge
              badgeContent={requestCount}
              color="secondary"
              onClick={handleIconClick}
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <Popover
            style={{ marginTop: "30px" }}
            open={isPopoverOpen}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            PaperProps={{
              style: {
                height: '300px', // Set a fixed height for the Popover
                overflowY: 'auto', // Allow scrolling if content exceeds the height
                backgroundColor: '#2d353c'
              },
            }}
          >
            <List style={{ backgroundColor: '#2d353c' }}>
              {userRole === "Training admin" ? (
                studentRequests.length > 0 ? (
                  studentRequests.map((request) => (
                    <ListItem
                      key={request.student_id}
                      onMouseEnter={() => setHoveredId(request.student_id)}
                      onMouseLeave={() => setHoveredId(null)}
                      style={{ color: 'white' }}
                    >
                      {/* Display profile icon and tooltip */}
                      <div style={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                        <Tooltip title={`User Name: ${request.user_name}`}>
                          <AccountCircleIcon
                            style={{
                              color: hoveredId === request.user_name ? 'white' : '#ccc', // Change color on hover
                              transition: 'color 0.3s' // Smooth color transition
                            }}
                          />
                        </Tooltip>
                      </div>
                      {/* Display primary text */}
                      <ListItemText
                        primary={request.student_query}
                        
                        style={{ color: 'white' }}
                      />
                      <IconButton
                        color="success"
                        size="small"
                        onClick={() => handleAccept(request.student_id)}
                      >
                        <CheckCircleIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        size="small"
                        style={{ marginLeft: "10px" }}
                        onClick={() => handleDecline(request.student_id)}
                      >
                        <CancelIcon />
                      </IconButton>
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No requests available" />
                  </ListItem>
                )
              ) : (
                <ListItem>
                  <ListItemText primary="You do not have permission to view this." />
                </ListItem>
              )}
            </List>
          </Popover>

          <IconButton edge="end" color="inherit">
            <AccountCircle />
          </IconButton>
          {isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              style={{ marginLeft: "auto" }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          {!isMobile && (
            <IconButton
              color="inherit"
              onClick={handleMenuOpen}
              style={{ marginLeft: "20px" }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem disabled>{username}</MenuItem>
            <MenuItem>
              <Link to="/Database/settings">Settings</Link>
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("logout")}>
              Logout
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
