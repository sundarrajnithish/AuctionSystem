import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Authenticator } from "@aws-amplify/ui-react";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import PriceChangeTwoToneIcon from "@mui/icons-material/PriceChangeTwoTone";
import "./NavBar.css";

const pages = [
  { id: 1, Menuname: "Auction Home", route: "/home" },
  { id: 2, Menuname: "Books", route: "/books" },
  { id: 3, Menuname: "Cars", route: "/cars" },
  { id: 4, Menuname: "Luxuries", route: "/luxuries" },
  { id: 5, Menuname: "Historical", route: "/historical" },
  { id: 5, Menuname: "Register Auction", route: "/RegisterAuction" },
];
const settings = [
  { id: 1, Menuname: "Profile" },
  { id: 2, Menuname: "Account" },
  { id: 3, Menuname: "Dashboard" },
  { id: 4, Menuname: "Logout" },
];

const NavBar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (e) => {
    setAnchorElNav(e.currentTarget);
  };
  const handleOpenUserMenu = (e) => {
    setAnchorElUser(e.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <Authenticator>
      {({ signOut }) => (
        <AppBar position="static">
          <Container maxWidth="xl">
            <Toolbar disableGutters>
              <PriceChangeTwoToneIcon
                sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                component="a"
                onClick={(e) => console.log("hello")}
                sx={{
                  mr: 2,
                  display: { xs: "none", md: "flex" },
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Auction
              </Typography>

              <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
                <IconButton
                  size="large"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{ display: { xs: "block", md: "none" } }}
                >
                  {pages.map((page) => (
                    <MenuItem
                      key={page.Menuname}
                      onClick={(e) => {
                        e.preventDefault();
                        navigate(`${page.route}`);
                        handleCloseNavMenu();
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {page.Menuname}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
              <PriceChangeTwoToneIcon
                sx={{ display: { xs: "flex", md: "none" }, mr: 1 }}
              />
              <Typography
                variant="h5"
                noWrap
                component="a"
                sx={{
                  mr: 2,
                  display: { xs: "flex", md: "none" },
                  flexGrow: 1,
                  fontFamily: "monospace",
                  fontWeight: 700,
                  letterSpacing: ".3rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Auction
              </Typography>
              <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
                {pages.map((page) => (
                  <Button
                    key={page}
                    onClick={(e) => {
                      navigate(`${page.route}`);
                      e.preventDefault();
                      handleCloseNavMenu();
                    }}
                    sx={{ my: 2, color: "white", display: "block" }}
                  >
                    {page.Menuname}
                  </Button>
                ))}
              </Box>
              <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      alt="Remy Sharp"
                      src="/static/images/avatar/2.jpg"
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "45px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  {settings.map((setting) => (
                    <MenuItem
                      key={setting.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleCloseUserMenu();
                        if (setting.id === 4) {
                          // signOut();
                          console.log("logging out");
                        }
                      }}
                    >
                      <Typography sx={{ textAlign: "center" }}>
                        {setting.Menuname}
                      </Typography>
                    </MenuItem>
                  ))}
                </Menu>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      )}
    </Authenticator>
  );
};

export default NavBar;
