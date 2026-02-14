import axios from "axios";
import API from "../utils/const";

const checkUsernameUnique = async (username) => {
  try {
    const response = await axios.get(`${API.URI}/api/v1/users/check-username?username=${username}`);
    return response.data.isUnique;
  } catch (error) {
    throw new Error("Error al verificar el nombre de usuario");
  }
};

const addEmployee = async (empleado) => {
  const employeeData = {
    username: empleado.username,
    name: empleado.nombre,
    surname: empleado.apellido,
    branch: empleado.sucursal,
    role: empleado.rol,
    password: empleado.contraseña,
  };

  try {
    const response = await axios.post(`${API.URI}/api/v1/users`, employeeData);
    return response.data;
  } catch (error) {
    throw new Error("Error al añadir empleado");
  }
};

export { addEmployee, checkUsernameUnique };
