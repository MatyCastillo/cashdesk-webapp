import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import logo from "../../assets/img/logo.png";

const Header = () => {
  const [dateTime, setDateTime] = useState({
    date: new Date().toLocaleDateString(),
    time: new Date().toLocaleTimeString(),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setDateTime({
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        width: "100%",
        minWidth: 0,
        minHeight: { xs: 38, sm: 42, lg: 46 },
        pl: { xs: 1.25, sm: 1.5 },
        pr: { xs: 1.25, sm: 1.5 },
        boxSizing: "border-box",
        backgroundColor: "white",
        border: "1px solid #ccc",
        borderRadius: "8px",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: { xs: -24, sm: -28, lg: -32 },
          right: { xs: -30, sm: -36, lg: -40 },
          width: { xs: 120, sm: 140, lg: 160 },
          height: { xs: 120, sm: 140, lg: 160 },
          opacity: 0.22,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        <img
          src={logo}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </Box>

      <Box sx={{ zIndex: 1 }}>
        <Typography variant="caption" sx={{ textAlign: "left", display: "block" }}>
          Fecha: <b>{dateTime.date}</b>
        </Typography>
        <Typography variant="caption" sx={{ textAlign: "left", display: "block" }}>
          Hora: <b>{dateTime.time}</b>
        </Typography>
      </Box>
    </Box>
  );
};

export default Header;
