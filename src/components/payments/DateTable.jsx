import React, { useState, useEffect } from "react";
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
  TextField,
  Box,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { es } from "date-fns/locale";
import DownloadIcon from "@mui/icons-material/Download";
import { fetchPaymentDates, downloadPaymentsByDate } from "../../services/payments";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&.sticky": {
    position: "sticky",
    bottom: 0,
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function DateTable() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    const getDates = async () => {
      try {
        const fetchedDates = await fetchPaymentDates();
        setDates(fetchedDates);
      } catch (error) {
        console.error("Error fetching dates:", error);
      }
    };

    getDates();
  }, []);

  const handleDownload = async (date) => {
    try {
      await downloadPaymentsByDate(date.date);
      console.log(
        `Descargando pagos para la fecha: ${new Date(
          date.date
        ).toLocaleDateString()}`
      );
    } catch (error) {
      console.error("Error downloading payments:", error);
    }
  };

  const filteredDates = selectedDate
    ? dates.filter(
        (date) =>
          new Date(date.date).toLocaleDateString() ===
          selectedDate.toLocaleDateString()
      )
    : dates;

  return (
    <Paper
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        margin: 0,
        padding: 30,
        width: "100vw",
      }}
    >
      <Typography
        variant="h5"
        gutterBottom
        style={{ marginBottom: 0, paddingBottom: 20 }}
      >
        Descargar Reportes
        <Divider></Divider>
      </Typography>
      <Box
        style={{
          display: "flex",
          justifyContent: "flex-start",
          marginBottom: 16,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDateFns} locale={es}>
          <DatePicker
            label="Selecciona una fecha"
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            renderInput={(params) => (
              <TextField {...params} style={{ alignSelf: "flex-start" }} />
            )}
            inputFormat="dd/MM/yyyy"
          />
        </LocalizationProvider>
      </Box>
      <TableContainer style={{ flex: 1, overflowY: "auto" }}>
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ fontWeight: "bold", width: "80%" }}>
                Fecha
              </TableCell>
              <TableCell
                style={{ fontWeight: "bold", width: "20%" }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDates.length > 0 ? (
              filteredDates.map((date, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {new Date(date.date).toLocaleDateString("es-AR")}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton
                      aria-label="download"
                      onClick={() => handleDownload(date)}
                    >
                      <DownloadIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={2} align="center">
                  No hay fechas disponibles
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
