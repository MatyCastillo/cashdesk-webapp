import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useSnackbar } from "notistack";
import moment from "moment-timezone";

import NumericKeyboard from "./NumericKeyboard";
import PaymentButtons from "./PaymentButtons";
import PaymentTable from "./PaymentTable";
import SmallInfoBox from "./SmallInfoBox";
import Header from "./Header";
import ConfirmDialog from "./ConfirmDialog";
import {
  fetchPricesByDate,
  sendPaymentInfo,
  deletePaymentById,
} from "../../services/payments";

const METHOD_COLORS = {
  Efectivo: "#2196f3",
  QR: "#4caf50",
  "Transf.": "#ff9800",
  Tarjeta: "#e91e63",
  Diferencia: "#9c27b0",
};

const MainPage = () => {
  const [amount, setAmount] = useState("");
  const [payments, setPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [paymentToDelete, setPaymentToDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const date = useMemo(
    () =>
      moment(new Date())
        .tz("America/Argentina/Buenos_Aires")
        .format("YYYY-MM-DD"),
    []
  );

  const branch = sessionStorage.getItem("branch");
  const user = sessionStorage.getItem("user");

  const totals = useMemo(() => {
    const totalsByMethod = {
      Efectivo: 0,
      QR: 0,
      "Transf.": 0,
      Tarjeta: 0,
      Diferencia: 0,
    };

    payments.forEach((payment) => {
      const amountNumber = Number.parseFloat(payment.amount) || 0;
      switch ((payment.method || "").toLowerCase()) {
        case "efectivo":
          totalsByMethod.Efectivo += amountNumber;
          break;
        case "qr":
          totalsByMethod.QR += amountNumber;
          break;
        case "transferencia":
          totalsByMethod["Transf."] += amountNumber;
          break;
        case "tarjeta":
          totalsByMethod.Tarjeta += amountNumber;
          break;
        case "diferencia":
          totalsByMethod.Diferencia += amountNumber;
          break;
        default:
          break;
      }
    });

    return Object.entries(totalsByMethod).map(([title, total]) => ({
      title,
      total: total.toFixed(2),
      color: METHOD_COLORS[title],
    }));
  }, [payments]);

  const updatePaymentsByDate = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetchPricesByDate(date, branch);
      const paymentData = Array.isArray(response?.data) ? response.data : [];
      setPayments(paymentData);
      setLastUpdated(new Date());
    } catch (error) {
      enqueueSnackbar("No se pudieron actualizar los pagos", {
        autoHideDuration: 900,
        variant: "error",
      });
      console.error("Error fetching payments:", error);
    } finally {
      setIsLoading(false);
    }
  }, [branch, date, enqueueSnackbar]);

  useEffect(() => {
    updatePaymentsByDate();
  }, [updatePaymentsByDate]);

  const handleValueChange = useCallback((value) => {
    setAmount(value);
  }, []);

  const handlePayment = useCallback(
    async (method) => {
      setIsSubmittingPayment(true);
      try {
        const response = await sendPaymentInfo(method, amount, branch, user);
        await updatePaymentsByDate();

        if (response?.status === 201) {
          enqueueSnackbar("Pago registrado", {
            autoHideDuration: 600,
            variant: "success",
          });
          setAmount("");
          return;
        }

        enqueueSnackbar("Error al registrar el pago", {
          autoHideDuration: 900,
          variant: "error",
        });
      } catch (error) {
        enqueueSnackbar("Ocurrió un error, intente nuevamente", {
          variant: "error",
        });
        console.error("Error:", error);
      } finally {
        setIsSubmittingPayment(false);
      }
    },
    [amount, branch, enqueueSnackbar, updatePaymentsByDate, user]
  );

  const handleDeletePayment = useCallback(
    async (paymentId) => {
      try {
        await deletePaymentById(paymentId);
        await updatePaymentsByDate();
        enqueueSnackbar("Pago eliminado", {
          autoHideDuration: 900,
          variant: "success",
        });
      } catch (error) {
        enqueueSnackbar("Error al eliminar el pago", { variant: "error" });
        console.error("Error deleting payment:", error);
      }
    },
    [enqueueSnackbar, updatePaymentsByDate]
  );

  const openDeleteDialog = useCallback((payment) => {
    setPaymentToDelete(payment);
    setOpenConfirmDialog(true);
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setOpenConfirmDialog(false);
    setPaymentToDelete(null);
  }, []);

  return (
    <Box
      sx={{
        minHeight: "100%",
        p: { xs: 1.25, sm: 1.75, md: 2.25 },
        pb: { xs: 2, sm: 2.5, md: 3 },
        background:
          "radial-gradient(circle at 20% 0%, #f7efe8 0%, #eceff7 45%, #e6eef7 100%)",
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 1600,
          mx: "auto",
          p: { xs: 1.25, sm: 1.75, md: 2.25 },
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
          backgroundColor: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(5px)",
        }}
      >
        <Stack spacing={{ xs: 1.5, sm: 2 }}>
          <Grid container spacing={{ xs: 1.25, sm: 1.5, md: 2 }} alignItems="stretch">
            <Grid item xs={12} md={5} lg={4}>
              <Header />
            </Grid>
            <Grid item xs={12} md={7} lg={8}>
              <Paper
                variant="outlined"
                sx={{ p: 1.5, height: "100%", borderRadius: 2, bgcolor: "#fafafa" }}
              >
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  spacing={1}
                  justifyContent="space-between"
                  alignItems={{ xs: "flex-start", md: "center" }}
                >
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Caja del dia {moment(date).format("DD/MM/YYYY")}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mt: 0.8, flexWrap: "wrap", rowGap: 0.6 }}
                    >
                      <Chip size="small" label={`Sucursal: ${branch || "-"}`} />
                      <Chip size="small" label={`Usuario: ${user || "-"}`} />
                    </Stack>
                  </Box>

                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<RefreshIcon />}
                      onClick={updatePaymentsByDate}
                      disabled={isLoading}
                    >
                      Actualizar
                    </Button>

                    {isLoading ? (
                      <CircularProgress size={20} />
                    ) : (
                      <Chip
                        size="small"
                        icon={<AccessTimeIcon />}
                        label={
                          lastUpdated
                            ? `Actualizado ${moment(lastUpdated).format("HH:mm:ss")}`
                            : "Sin actualizar"
                        }
                        variant="outlined"
                      />
                    )}
                  </Stack>
                </Stack>
              </Paper>
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
              gap: { xs: 0.45, sm: 0.65 },
            }}
          >
            {totals.map((item) => (
              <SmallInfoBox
                key={item.title}
                title={item.title}
                total={item.total}
                color={item.color}
              />
            ))}
          </Box>

          <Divider />

          <Grid container spacing={2} alignItems="stretch">
            <Grid item xs={12} sm={7} lg={4}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: 330, sm: 430, md: 460, lg: 520 },
                }}
              >
                <NumericKeyboard
                  onValueChange={handleValueChange}
                  currentValue={amount}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} sm={5} lg={3}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: 280, sm: 430, md: 460, lg: 520 },
                  opacity: isSubmittingPayment ? 0.75 : 1,
                }}
              >
                <PaymentButtons onPayment={handlePayment} amount={amount} />
              </Paper>
            </Grid>

            <Grid item xs={12} lg={5}>
              <Paper
                variant="outlined"
                sx={{
                  p: 1,
                  borderRadius: 2,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  minHeight: { xs: 320, sm: 400, md: 460, lg: 520 },
                  overflowX: "auto",
                }}
              >
                <PaymentTable payments={payments} onDelete={openDeleteDialog} />
              </Paper>
            </Grid>
          </Grid>
        </Stack>
      </Paper>

      <ConfirmDialog
        open={openConfirmDialog}
        close={closeDeleteDialog}
        title="Confirmar eliminación"
        description={`¿Estás seguro de que deseas eliminar el pago de $${Number(
          paymentToDelete?.amount || 0
        ).toLocaleString("es-AR", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })} con método ${(paymentToDelete?.method || "").toUpperCase()}?`}
        actionButton="Eliminar"
        actionButtonColor="error"
        func={() => {
          if (paymentToDelete) {
            handleDeletePayment(paymentToDelete.id);
            closeDeleteDialog();
          }
        }}
      />
    </Box>
  );
};

export default MainPage;
