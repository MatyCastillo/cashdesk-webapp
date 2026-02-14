import React, { useState } from "react";
import {
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { addEmployee, checkUsernameUnique } from "../../services/users";

const AddEmployee = () => {
  const [username, setUsername] = useState("");
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [contraseña, setContraseña] = useState("");
  const [rol, setRol] = useState("");
  const [usernameError, setUsernameError] = useState(""); // Nuevo estado para errores de username
  const { enqueueSnackbar } = useSnackbar();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Verificar que el username sea único antes de enviar el formulario
    try {
      const isUnique = await checkUsernameUnique(username);
      if (!isUnique) {
        setUsernameError("El nombre de usuario ya está en uso.");
        return;
      }
    } catch (error) {
      enqueueSnackbar("Error al verificar el nombre de usuario", {
        autoHideDuration: 800,
        variant: "error",
      });
      return;
    }

    const empleado = {
      username,
      nombre,
      apellido,
      sucursal,
      contraseña,
      rol,
    };

    try {
      await addEmployee(empleado);
      enqueueSnackbar("Empleado añadido correctamente", {
        autoHideDuration: 800,
        variant: "success",
      });
      // Opcional: Limpiar el formulario después de añadir el empleado
      setUsername("");
      setNombre("");
      setApellido("");
      setSucursal("");
      setContraseña("");
      setRol("");
      setUsernameError(""); // Limpiar el error del username
    } catch (error) {
      enqueueSnackbar("Error al añadir empleado", {
        autoHideDuration: 800,
        variant: "error",
      });
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 2 }}>
      <Typography variant="h5">Añadir Personal</Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre de Usuario"
          value={username}
          onChange={(e) => {
            setUsername(e.target.value);
            setUsernameError(""); // Limpiar el error cuando se cambia el username
          }}
          required
          fullWidth
          margin="normal"
          error={!!usernameError}
          helperText={usernameError}
        />
        <TextField
          label="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <TextField
          label="Apellido"
          value={apellido}
          onChange={(e) => setApellido(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Sucursal</InputLabel>
          <Select
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
            required
          >
            <MenuItem value="01">Sucursal 01</MenuItem>
            <MenuItem value="02">Sucursal 02</MenuItem>
            {/* Agregar más sucursales según sea necesario */}
          </Select>
        </FormControl>
        <TextField
          label="Contraseña"
          type="password"
          value={contraseña}
          onChange={(e) => setContraseña(e.target.value)}
          required
          fullWidth
          margin="normal"
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Rol</InputLabel>
          <Select value={rol} onChange={(e) => setRol(e.target.value)} required>
            <MenuItem value="admin">Administrador</MenuItem>
            <MenuItem value="seller">Vendedor</MenuItem>
          </Select>
        </FormControl>
        <Button type="submit" variant="contained" color="primary">
          Añadir Empleado
        </Button>
      </form>
    </Box>
  );
};

export default AddEmployee;
