import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { styled } from "@mui/system";
import logo from "../../assets/logo.png";

const LinkStyled = styled(Link)({
  color: "#FFFFFF",
  textDecoration: "none",
  marginRight: "16px",
  "&:hover": {
    color: "#FFFF00",
  },
});

const ToolbarStyled = styled(Toolbar)({
  display: "flex",
  justifyContent: "space-between",
});

const Logo = styled("img")({
  height: "60px",
  marginRight: "16px",
});

//navbar gradient
// const AppBarStyled = styled(AppBar)({
//   background: "linear-gradient(to right, #FFFF00, #000000)",
// });

const TopNav = () => {
  return (
    <AppBar position="static" style={{ background: "#000000" }}>
      <ToolbarStyled>
        <LinkStyled to="/">
          <Logo src={logo} alt="Logo" />
        </LinkStyled>
        <Typography variant="h6">
          <LinkStyled to="/">Home</LinkStyled>
          <LinkStyled to="/employees">Employees</LinkStyled>
          <LinkStyled to="/map">Map</LinkStyled>
        </Typography>
      </ToolbarStyled>
    </AppBar>
  );
};

export default TopNav;
