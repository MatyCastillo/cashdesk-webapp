import React from "react";
import { Box, Typography } from "@mui/material";
import { formatCurrency } from "../../utils/numberFormat";


export default function SmallInfoBox({ title, total, color }) {
  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 0,
        minHeight: { xs: 32, sm: 38 },
        padding: { xs: 0.35, sm: 0.5 },
        backgroundColor: "white",
        border: `0.5px solid #ccc`,
        borderRadius: "6px",
        boxSizing: "border-box",
        overflow: "hidden",
        "&:after": {
          content: '""',
          position: "absolute",
          width: 72,
          height: 72,
          background: color,
          borderRadius: "50%",
          top: { xs: -42, sm: -38 },
          right: { xs: -40, sm: -34 },
          opacity: 0.42,
          zIndex: 0,
        },
        "&:before": {
          content: '""',
          position: "absolute",
          width: 72,
          height: 72,
          background: color,
          borderRadius: "50%",
          top: { xs: -56, sm: -50 },
          right: { xs: -14, sm: 2 },
          opacity: 0.16,
          zIndex: 0,
        },
      }}
    >
      <Typography
        variant="button"
        sx={{ zIndex: 1, fontSize: { xs: "0.56rem", sm: "0.62rem" }, lineHeight: 1 }}
      >
        {title}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          zIndex: 1,
          fontSize: { xs: "0.62rem", sm: "0.72rem" },
          lineHeight: 1.05,
          fontWeight: 700,
        }}
      >
        {formatCurrency(total)}
      </Typography>
    </Box>
  );
}
