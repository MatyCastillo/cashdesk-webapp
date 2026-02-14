import React, { useEffect } from "react";
import Nav2 from "../components/layout/nav2";
import useUser from "../hooks/useUser";
import { useNavigate } from "react-router-dom";
import Inicio from "../components/payments/MainPage";
import DateTable from "../components/payments/DateTable";
import AddEmployee from "../components/payments/AddEmployee";
import { SnackbarProvider } from "notistack";

export default function Home(prop) {
  const navigate = useNavigate();
  const { isLogged } = useUser();

  useEffect(() => {
    if (!isLogged) {
      navigate("/login", {
        state: { message: "Inicie sesión para continuar" },
      });
    }
  }, [isLogged, navigate]);

  const renderComponent = (route) => {
    switch (route) {
      case "":
        return <Inicio />;
      case "by-date":
        return <DateTable />;
      case "add-employee":
        return <AddEmployee />;
      default:
        return <Inicio />;
    }
  };

  if (!isLogged) {
    return null; // Evita mostrar el contenido hasta que se verifique el estado de login
  }

  return (
    <SnackbarProvider maxSnack={3}>
      <Nav2 form={prop.form}>{renderComponent(prop.route)}</Nav2>
    </SnackbarProvider>
  );
}
