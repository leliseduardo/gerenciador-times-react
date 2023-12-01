import React, { useState } from "react";
import Box from "@mui/material/Box";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function Navbar(props) {
  let navigate = useNavigate();

  const theme = createTheme({
    status: {
      danger: "#e53e3e",
    },
    palette: {
      primary: {
        main: "#0971f1",
        darker: "#053e85",
      },
      neutral: {
        main: "#64748B",
        contrastText: "#fff",
      },
      white: {
        main: "#fafafa",
        contrastText: "#fff",
      },
    },
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorE2, setAnchorE2] = useState(null);
  const open = Boolean(anchorEl);
  const open2 = Boolean(anchorE2);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClick2 = (event) => {
    setAnchorE2(event.currentTarget);
  };
  const handleClose = (e) => {
    const name = e.target.getAttribute("name");
    if (name === "administrador") navigate("/visao-adm");
    if (name === "medico") navigate("/visao-medico");
    if (name === "tecnico") navigate("/visao-tecnico");
    if (name === "logout") navigate("/");
    setAnchorEl(null);
  };
  const handleClose2 = (e) => {
    const name = e.target.getAttribute("name");
    if (name === "logout") navigate("/");
    setAnchorE2(null);
  };

  return (
    <div className="flex w-full justify-begin">
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              className="flex justify-begin"
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <ThemeProvider theme={theme}>
                <Button
                  sx={{ ml: 5 }}
                  id="demo-positioned-button"
                  color="white"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  Menu
                </Button>
              </ThemeProvider>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleClose} name="administrador">
                  Administrador
                </MenuItem>
                <MenuItem onClick={handleClose} name="medico">
                  Médico
                </MenuItem>
                <MenuItem onClick={handleClose} name="tecnico">
                  Técnico
                </MenuItem>
              </Menu>
            </Typography>

            <Typography
              className="flex justify-center"
              id="nav-title"
              component="div"
              textAlign="center"
              sx={{
                flexGrow: 1,
                fontSize: 14,
                fontWeight: 600,
                ml: 2,
              }}
            >
              {props.title}
            </Typography>
            <Typography
              className="flex justify-end"
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            >
              <ThemeProvider theme={theme}>
                <IconButton
                  id="demo-positioned-button"
                  color="white"
                  aria-controls={open ? "demo-positioned-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick2}
                  size="large"
                  edge="start"
                  color="inherit"
                  aria-label="menu"
                  sx={{ ml: 2, mr: 2 }}
                >
                  <Stack direction="row" spacing={2}>
                    <Avatar />
                  </Stack>
                </IconButton>
              </ThemeProvider>
              <Menu
                id="demo-positioned-menu"
                aria-labelledby="demo-positioned-button"
                anchorEl={anchorE2}
                open={open2}
                onClose={handleClose2}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
              >
                <MenuItem onClick={handleClose2} name="logout">
                  Logout
                </MenuItem>
              </Menu>
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
    </div>
  );
}
