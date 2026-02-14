import axios from "axios";
import API from "../utils/const";
import moment from "moment-timezone";

const sendPaymentInfo = async (method, amount, branchId, user) => {
  const now = new Date();
  const formattedDate = moment(now)
    .tz("America/Argentina/Buenos_Aires")
    .format("YYYY-MM-DDTHH:mm:ss.SSS[Z]");

  const data = {
    method,
    amount,
    date: formattedDate,
    branchId,
    user,
  };

  try {
    const response = await axios.post(`${API.URI}/api/v1/pagos`, data);
    return response;
  } catch (err) {
    console.error("Error:", err);
    return err;
  }
};

const fetchPricesByDate = async (date, branch) => {
  try {
    const response = await fetch(`${API.URI}/api/v1/pagos?date=${date}&branch=${branch}`);
    if (!response.ok) {
      throw new Error("Error fetching prices");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching prices:", error);
    throw error;
  }
};

const deletePaymentById = async (id) => {
  try {
    const response = await axios.delete(`${API.URI}/api/v1/pagos/${id}`);
    return response;
  } catch (error) {
    console.error("Error al eliminar el pago:", error);
    throw error;
  }
};

const fetchPaymentDates = async () => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/pagos/dates`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener fechas de pagos:", error);
    throw error;
  }
};

const downloadPaymentsByDate = async (date) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/pagos/download/${date}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `pagosFecha:${new Date(date).toLocaleDateString()}.xlsx`);
    document.body.appendChild(link);
    link.click();
  } catch (error) {
    console.error("Error al descargar pagos:", error);
    throw error;
  }
};

export {
  sendPaymentInfo,
  fetchPricesByDate,
  deletePaymentById,
  fetchPaymentDates,
  downloadPaymentsByDate,
};
