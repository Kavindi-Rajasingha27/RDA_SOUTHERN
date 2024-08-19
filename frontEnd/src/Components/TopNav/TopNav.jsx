import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/system";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";
import { useAuth } from "../../AuthContext/AuthContext";

const LinkStyled = styled(Link)(({ theme }) => ({
  color: "white",
  textDecoration: "none",
  marginRight: theme.spacing(2),
  "&:hover": {
    color: "#FFFF00",
  },
}));

const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  [theme.breakpoints.down("sm")]: {
    flexDirection: "column",
    alignItems: "flex-start",
  },
}));

const Logo = styled("img")({
  height: "60px",
  marginRight: "16px",
});

const TopNav = () => {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <AppBar position="static" style={{ background: "#000000" }}>
      <ToolbarStyled>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: "none" } }}
          style={{
            position: "absolute",
            right: "5px",
            top: "8px",
          }}
        >
          <MenuIcon />
        </IconButton>
        <LinkStyled to="/">
          <Logo src={logo} alt="Logo" />
        </LinkStyled>
        <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" } }}>
          <LinkStyled to="/">Home</LinkStyled>
          {isLoggedIn && (
            <>
              <LinkStyled to="/employees">Employees</LinkStyled>
              <LinkStyled to="/map">Map</LinkStyled>
              <LinkStyled to="/estimate">Estimate</LinkStyled>
            </>
          )}
          {isLoggedIn ? (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <LinkStyled to="/login">Login</LinkStyled>
          )}
        </Typography>
        <Drawer anchor="left" open={drawerOpen} onClose={handleDrawerToggle}>
          <List style={{ background: "#000000", height: "inherit" }}>
            <ListItem>
              <LinkStyled to="/" onClick={handleDrawerToggle}>
                Home
              </LinkStyled>
            </ListItem>
            {isLoggedIn && (
              <>
                <ListItem>
                  <LinkStyled to="/employees" onClick={handleDrawerToggle}>
                    Employees
                  </LinkStyled>
                </ListItem>
                <ListItem>
                  <LinkStyled to="/map" onClick={handleDrawerToggle}>
                    Map
                  </LinkStyled>
                </ListItem>
                <ListItem>
                  <LinkStyled to="/estimate" onClick={handleDrawerToggle}>
                    Estimate
                  </LinkStyled>
                </ListItem>
              </>
            )}
            {isLoggedIn ? (
              <ListItem>
                <Button style={{ color: "white" }} onClick={handleLogout}>
                  Logout
                </Button>
              </ListItem>
            ) : (
              <ListItem>
                <LinkStyled to="/login" onClick={handleDrawerToggle}>
                  Login
                </LinkStyled>
              </ListItem>
            )}
          </List>
        </Drawer>
      </ToolbarStyled>
    </AppBar>
  );
};

export default TopNav;
