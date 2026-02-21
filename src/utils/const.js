var API = {
  // URI: "https://padron.tesetgps.com.ar", //production
  // imgURI: "https://padron.tesetgps.com.ar/api/images",

  // URI: "https://inscripciones.tesetgps.com.ar", //production test
  // imgURI: "https://test.tesetgps.com.ar/backend/images",

  URI: process.env.REACT_APP_API_URL || "http://127.0.0.1:8080",
  // imgURI: "C://Users/PC-01/Documents/Workspace/sistema-uteam-back/images",
};
export default API;
