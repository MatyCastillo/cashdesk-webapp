import React from "react";
import { Button, Grid } from "@mui/material";
import MoneyIcon from "@mui/icons-material/Money";
import QrCodeIcon from "@mui/icons-material/QrCode";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useSnackbar } from "notistack";

const PAYMENT_METHODS = [
  { key: "efectivo", label: "Efectivo", color: "#2196f3", icon: <MoneyIcon /> },
  { key: "qr", label: "QR", color: "#4caf50", icon: <QrCodeIcon /> },
  {
    key: "transferencia",
    label: "Transferencia",
    color: "#ff9800",
    icon: <AccountBalanceIcon />,
  },
  { key: "tarjeta", label: "Tarjeta", color: "#e91e63", icon: <CreditCardIcon /> },
  { key: "diferencia", label: "Diferencia", color: "#9c27b0", icon: <HelpOutlineIcon /> },
];

const PaymentButtons = ({ onPayment, amount }) => {
  const { enqueueSnackbar } = useSnackbar();

  const handlePayment = (method) => {
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      enqueueSnackbar("Introduzca el monto válido", { variant: "error" });
    } else {
      onPayment(method);
    }
  };
  const buttonStyle = {
    borderWidth: 2,
    borderRadius: 3,
    background: "transparent",
    minHeight: { xs: 56, sm: 66, lg: 72 },
    fontWeight: 700,
    justifyContent: "flex-start",
    px: { xs: 1.25, sm: 1.5 },
  };

  return (
    <Grid
      container
      spacing={{ xs: 1, sm: 1.25 }}
      sx={{ width: "100%", maxWidth: { xs: "100%", sm: 320, lg: 360 } }}
    >
      {PAYMENT_METHODS.map((method) => (
        <Grid item xs={6} sm={12} key={method.key}>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              ...buttonStyle,
              borderColor: method.color,
              color: method.color,
              fontSize: { xs: "0.95rem", sm: "1.05rem", lg: "1.1rem" },
              "&:hover": {
                borderColor: method.color,
                backgroundColor: `${method.color}12`,
              },
            }}
            onClick={() => handlePayment(method.key)}
            startIcon={method.icon}
          >
            {method.label}
          </Button>
        </Grid>
      ))}
    </Grid>
  );
};

export default PaymentButtons;
