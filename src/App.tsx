import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login
from "./components/Login";

import EmployeeList
from "./components/EmployeeList";

function App() {

  const token =
    localStorage.getItem("token");

  return (

    <Routes>

      <Route
        path="/"
        element={
          token ? (
            <Navigate
              to="/employees"
            />
          ) : (
            <Login />
          )
        }
      />

      <Route
        path="/employees"
        element={
          token ? (
            <EmployeeList />
          ) : (
            <Navigate to="/" />
          )
        }
      />

    </Routes>

  );

}

export default App;