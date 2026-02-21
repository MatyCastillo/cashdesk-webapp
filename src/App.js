import Home from "./pages/Home";
import SignIn from "./components/auth/SignIn";
import { UserContextProvider } from "./context/UserContext";
import { SnackbarProvider } from 'notistack';

import { BrowserRouter, HashRouter, Routes, Route } from "react-router-dom";

function App() {
  const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

  return (
    <SnackbarProvider maxSnack={3}>
    <UserContextProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<SignIn />} />
          {/* <Route path="/inscripciones" element={<Home form="true" />} /> */}
          <Route path="/" element={<Home route=""/>} />
          <Route path="/by-date" element={<Home route="by-date"/>} />
          <Route path="/add-employee" element={<Home route="add-employee"/>} />
        </Routes>
      </Router>
    </UserContextProvider>
    </SnackbarProvider >
  );
}

export default App;
