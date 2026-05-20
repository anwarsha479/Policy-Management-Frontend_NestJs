import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import EmployeeList from "./pages/EmployeeList";
import Dashboard from "./pages/Dashboard";
import Layout from "./components/Layout";
import Policies from "./pages/Policies";

function App() {
  const token = localStorage.getItem("token");
  return (
    <Routes>
      <Route
        path="/"
        element={token ? <Navigate to="/dashboard" /> : <Login />}
      />

      {/* DASHBOARD PAGE */}
      <Route
        path="/dashboard"
        element={
          token ? (
            <Layout>
              <Dashboard />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        }
      />

      {/* EMPLOYEE PAGE */}
      <Route
        path="/employees"
        element={
          token ? (
            <Layout>
              <EmployeeList />
            </Layout>
          ) : (
            <Navigate to="/" />
          )
        }
      />
      <Route path="/policies" element={<Policies />} />

      {/* INVALID ROUTE */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}

export default App;
