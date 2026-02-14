import axios from "axios";
import API from "../utils/const";

const loginService = async ({ nombre, password }) => {
  const data = {
    username: nombre,
    password: password,
  };

  try {
    const response = await axios.post(`${API.URI}/api/v1/auth/login`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { loginService };
