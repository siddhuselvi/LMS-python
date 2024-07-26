import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  useMediaQuery,
} from "@mui/material";
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
import App from "../App";
// import Sidebar from "../students/Sidebar";

const Header = ({ collegeName, username }) => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    window.location.href = "https://cc.kwantumg.com/index.html";
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
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          <img
            style={{ borderRadius: "8px", width: "140px", height: "auto" }}
            src={Logo}
            className="Campus-logo"
            alt="Campus Connection Logo"
          />
        </Typography>
        <div
          style={{ display: "flex", alignItems: "center", marginLeft: "auto" }}
        >
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
            <NotificationsIcon />
          </IconButton>
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
