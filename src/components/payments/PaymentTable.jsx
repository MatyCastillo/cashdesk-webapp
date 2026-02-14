import React, { useEffect, useRef } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import DeleteIcon from "@mui/icons-material/Delete";
import { formatCurrency } from "../../utils/numberFormat";

const METHOD_COLORS = {
  efectivo: "#2196f3",
  qr: "#4caf50",
  transferencia: "#ff9800",
  tarjeta: "#e91e63",
  diferencia: "#9c27b0",
};

const getMethodRowStyles = (method) => {
  const color = METHOD_COLORS[(method || "").toLowerCase()];
  if (!color) {
    return {};
  }

  return {
    backgroundColor: `${color}14`,
    "& td": {
      borderBottomColor: `${color}66`,
    },
    "& td:first-of-type": {
      borderLeft: `4px solid ${color}`,
      fontWeight: 600,
    },
  };
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&.sticky": {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function PaymentTable({ payments, onDelete }) {
  const tableContainerRef = useRef(null);
  const paymentList = Array.isArray(payments) ? payments : [];

  const generalTotal = paymentList
    .reduce((total, payment) => {
      const amount = Number.parseFloat(payment.amount) || 0;
      return payment.method !== "diferencia" ? total + amount : total;
    }, 0)
    .toFixed(2);

  const scrollToBottom = () => {
    if (tableContainerRef.current) {
      tableContainerRef.current.scrollTop =
        tableContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [paymentList.length]);

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        width: "100%",
        minWidth: { xs: 280, sm: 380 },
        maxHeight: { xs: 360, sm: 460, lg: 540 },
        borderRadius: 2,
      }}
    >
      <Typography
        variant="body1"
        gutterBottom
        sx={{ marginBottom: 0, px: 1.5, pt: 1, fontWeight: 700 }}
      >
        Historial de Pagos
      </Typography>
      <TableContainer
        sx={{ flex: 1, maxHeight: "100%", overflowY: "auto" }}
        ref={tableContainerRef}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                Tipo de Pago
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "40%" }}>
                Monto
              </TableCell>
              <TableCell sx={{ fontWeight: "bold", width: "20%" }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentList.length > 0 ? (
              paymentList.map((payment, index) => (
                <TableRow key={index} sx={getMethodRowStyles(payment.method)}>
                  <TableCell>{payment.method.toUpperCase()}</TableCell>
                  <TableCell align="right">
                    {formatCurrency(payment.amount)}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="delete"
                      onClick={() => onDelete(payment)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No hay pagos disponibles
                </TableCell>
              </TableRow>
            )}
            <StyledTableRow className="sticky">
              <TableCell sx={{ fontWeight: "bold" }}>
                Total General
              </TableCell>
              <TableCell align="right" sx={{ fontWeight: "bold" }}>
                {formatCurrency(generalTotal)}
              </TableCell>
              <TableCell></TableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
