import React, { useState } from "react";
import {
  Box,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  Divider,
  Collapse,
} from "@mui/material";
import { renderIcon } from "../../utils/dynamicIconLoader";
import { capitalizeFirstLetter } from "../../utils/helper";
import { Link } from "react-router-dom";

export default function Sidebar({
  openSideBar,
  isMobile,
  userType,
  location,
  handleClickOpenModal,
  handleClickOpenModalProv,
  handleClick,
  sidebarItems,
}) {
  const [open, setOpen] = useState({});

  const handleDropdownClick = (index, event) => {
    // Evitar que el clic en el dropdown propague el evento
    event.stopPropagation();
    setOpen((prevOpen) => ({
      ...prevOpen,
      [index]: !prevOpen[index],
    }));
  };

  return (
    <Box sx={{ width: 250 }} role="presentation">
      <Toolbar />
      <List>
        {sidebarItems.header.map((item, index) => (
          <Tooltip title={item.title} key={index}>
            <ListItem
              onClick={handleClickOpenModal}
              // disabled={userType !== "administrador"}
              disablePadding
              sx={{ display: "block", mt: 5 }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: openSideBar ? "initial" : "center",
                  px: 2.5,
                }}
                component={item.route ? Link : "div"}
                to={item.route || ""}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: openSideBar ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {renderIcon(item.icon)}
                </ListItemIcon>
                <ListItemText
                  primary={capitalizeFirstLetter(item.title)}
                  sx={{ opacity: openSideBar ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          </Tooltip>
        ))}
        <Divider />
        {sidebarItems.body.map((item, index) => (
          <div key={index}>
            <ListItemButton
              component={item.route ? Link : "div"}
              to={item.route || ""}
              onClick={
                item.route ? null : (event) => handleDropdownClick(index, event)
              }
              sx={{
                minHeight: 48,
                justifyContent: openSideBar ? "initial" : "center",
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: openSideBar ? 3 : "auto",
                  justifyContent: "center",
                }}
              >
                {renderIcon(item.icon)}
              </ListItemIcon>
              <ListItemText
                primary={capitalizeFirstLetter(item.title)}
                sx={{ opacity: openSideBar ? 1 : 0 }}
              />
              {item.dropdown
                ? open[index]
                  ? renderIcon("ExpandLess")
                  : renderIcon("ExpandMore")
                : null}
            </ListItemButton>
            {item.dropdown && (
              <Collapse in={open[index]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.dropdown.map((dropdownItem, dropdownIndex) => (
                    <Tooltip title={dropdownItem.title} key={dropdownIndex}>
                      <ListItemButton
                        component={dropdownItem.route ? Link : "div"}
                        selected={location.pathname === `${dropdownItem.route}`}
                        to={dropdownItem.route || ""}
                        sx={{ pl: 4 }}
                        onClick={(event) => {
                          event.stopPropagation();
                          if (dropdownItem.route) {
                            handleClickOpenModalProv();
                          }
                        }}
                      >
                        <ListItemIcon>
                          {renderIcon(dropdownItem.icon)}
                        </ListItemIcon>
                        <ListItemText
                          primary={capitalizeFirstLetter(dropdownItem.title)}
                        />
                      </ListItemButton>
                    </Tooltip>
                  ))}
                </List>
              </Collapse>
            )}
          </div>
        ))}
      </List>
    </Box>
  );
}
