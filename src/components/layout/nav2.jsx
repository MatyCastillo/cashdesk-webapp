import * as React from "react";
import {
  Box,
  CssBaseline,
  Typography,
  IconButton,
  Badge,
  Dialog,
  DialogContent,
  DialogTitle,
  ThemeProvider,
  Tooltip,
  Drawer,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import CloseIcon from "@mui/icons-material/Close";
import NotificationsIcon from "@mui/icons-material/Notifications";
import useUser from "../../hooks/useUser";
import AvatarNab from "./avatarNab";
import noAvatar from "../../img/no-avatar.png";
import NotificationsMenu from "./notifications";
import { useLocation } from "react-router-dom";
import Sidebar from "./sideBar";
import sidebarConfig from "../../config/sidebarConfig.json";
import themeCustom from "../../theme/theme";

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
}));

const isMobile = window.innerWidth <= 500;

export default function NavBar(props) {
  const { logout } = useUser();
  const [openSideBar, setOpenSideBar] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(props.form ? true : false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notifData, setNotifData] = React.useState([]);
  const location = useLocation();
  const userType = sessionStorage.getItem("userType");
  const userName = sessionStorage.getItem("userName");
  const [adminMod, setAdminMod] = React.useState(
    userType === "admin" ? true : false
  );

  const toggleDrawer = () => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    openSideBar === false ? setOpenSideBar(true) : setOpenSideBar(false);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleClickOpenModal = () => {
    if (userType === "administrador") {
      setOpenModal(true);
    }
  };

  const handleClickOpenModalProv = () => {
    if (userType === "administrador") {
      setOpenModal(true);
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  return (
    <ThemeProvider theme={themeCustom}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="fixed">
          <Toolbar>
            {adminMod ? (
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="open drawer"
                onClick={toggleDrawer()}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            ) : (
              ""
            )}
            <Typography
              variant={isMobile ? "body1" : "h6"}
              component="div"
              sx={{ flexGrow: 1 }}
            >
              {isMobile ? <br /> : ""} Don Toribio
            </Typography>
            <IconButton size="large" color="inherit" onClick={handleMenu}>
              <Badge badgeContent={notifData.length} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <NotificationsMenu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              handleClose={handleClose}
              data={notifData}
              primaryText="No hay notificaciones disponibles."
              secondaryText=""
            />
            <AvatarNab img={noAvatar} user={userName} />
            <Tooltip
              title={
                userType && userType === "administrador"
                  ? "Los administradores pueden crear y editar datos"
                  : "Los operadores solo pueden visualizar los datos"
              }
            >
              <Typography>
                {userName && userType
                  ? `Bienvenido/a, ${
                      userName.charAt(0).toUpperCase() + userName.slice(1)
                    } (${userType === "seller" ? "Vendedor" : "Administrador"})`
                  : `Bienvenido/a, Nombre (tipo de usuario)`}
              </Typography>
            </Tooltip>
            <Tooltip title="Salir">
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                color="inherit"
                onClick={logout}
              >
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Toolbar>
        </AppBar>
        {adminMod ? (
          <Drawer
            anchor="left"
            open={openSideBar}
            onClose={toggleDrawer(false)}
            ModalProps={{
              keepMounted: true,
            }}
          >
            <Sidebar
              openSideBar={openSideBar}
              isMobile={isMobile}
              userType={userType}
              location={location}
              handleClickOpenModal={handleClickOpenModal}
              handleClickOpenModalProv={handleClickOpenModalProv}
              handleClick={toggleDrawer(false)}
              sidebarItems={sidebarConfig}
            />
          </Drawer>
        ) : (
          ""
        )}
        <Box component="main" sx={{ flexGrow: 1, pt: 8 }}>
          {props.children}
        </Box>
      </Box>
    </ThemeProvider>
  );
}
