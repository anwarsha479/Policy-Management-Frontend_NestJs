import { useEffect, useMemo, useState, useRef } from "react";
import {getEmployeeApi, createEmployeeApi, updateEmployeeApi, deleteEmployeeApi,} from "../services/api";
import { GridColDef } from "@mui/x-data-grid";
import { Box, Typography, TextField, Button } from "@mui/material";
import Layout from "../components/Layout";
import EmployeeForm from "../components/EmployeeForm";
import EmployeeTable from "../components/EmployeeTable";

interface Policy {
  id: number;
  name: string;
}

interface Employee {
  id: number;
  name: string;
  department: string;
  email: string;
  policies: Policy[];
}

function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [totalRows, setTotalRows] = useState(0);

  const CHUNK_SIZE = 10;
  const [uiPage, setUiPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [chunkPage, setChunkPage] = useState(1);

  // Form States
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const abortControllerRef = useRef<AbortController | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const loggedInEmail = localStorage.getItem("email");

  const clearForm = () => {
    setName("");
    setDepartment("");
    setEmail("");
    setPassword("");
    setEditingId(null);
  };

  const refreshData = () => {
    setEmployees([]);
    if (chunkPage === 1) {
      fetchEmployees(1, true);
    } else {
      setChunkPage(1);
    }
    setUiPage(1);
  };

  const handleAdd = async () => {
    if (!name || !email || !password) return alert("Required fields missing");
    try {
      setLoading(true);
      await createEmployeeApi(
        { name, department, email, password },
        token || "",
      );
      clearForm();
      refreshData();
    } catch (error) {
      console.error("Create error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingId) return;
    try {
      setLoading(true);
      await updateEmployeeApi(
        editingId,
        { name, department, email },
        token || "",
      );
      clearForm();
      refreshData();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this employee?"))
      return;
    try {
      setLoading(true);
      await deleteEmployeeApi(id, token || "");
      refreshData();
    } catch (error) {
      console.error("Delete error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setUiPage(1);
      setChunkPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchEmployees = async (
    targetChunk: number,
    shouldReplace: boolean,
  ) => {
    if (abortControllerRef.current) abortControllerRef.current.abort();
    abortControllerRef.current = new AbortController();
    try {
      if (shouldReplace) setLoading(true);
      setIsFetchingMore(true);

      const apiPromise = getEmployeeApi(
        targetChunk,
        CHUNK_SIZE,
        debouncedSearch,
        token || "",
      );
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 800));
      const [data] = await Promise.all([apiPromise, delayPromise]);
      const newEmployees = data.data || [];

      setEmployees((prev) => {
        if (shouldReplace) return newEmployees;
        const existingIds = new Set(prev.map((emp) => emp.id));
        const unique = newEmployees.filter(
          (emp: Employee) => !existingIds.has(emp.id),
        );
        return [...prev, ...unique];
      });
      setTotalRows(data.meta?.total || 0);
    } catch (error: any) {
      if (error.name !== "CanceledError") console.error("Fetch error:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    const expectedFirstChunk =
      Math.floor(((uiPage - 1) * rowsPerPage) / CHUNK_SIZE) + 1;
    const shouldReplace =
      chunkPage === expectedFirstChunk || employees.length === 0;
    fetchEmployees(chunkPage, shouldReplace);
  }, [chunkPage, debouncedSearch]);

  useEffect(() => {
    const handleWindowScroll = () => {
      const scrollTop = window.scrollY;

      const windowHeight = window.innerHeight;

      const fullHeight = document.documentElement.scrollHeight;

      const reachedBottom = scrollTop + windowHeight >= fullHeight - 100;

      if (
        reachedBottom &&
        !loading &&
        !isFetchingMore &&
        employees.length < rowsPerPage &&
        employees.length < totalRows
      ) {
        setChunkPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleWindowScroll);

    return () => {
      window.removeEventListener("scroll", handleWindowScroll);
    };
  }, [loading, isFetchingMore, employees.length, rowsPerPage, totalRows]);

  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 70 },
      { field: "name", headerName: "Name", flex: 1, minWidth: 150 },
      { field: "department", headerName: "Department", flex: 1, minWidth: 150 },
      { field: "email", headerName: "Email", flex: 1.5, minWidth: 200 },
      {
        field: "policies",
        headerName: "Policies",
        flex: 2,
        minWidth: 300,
        renderCell: (params) => (
          <Box
            sx={{
              whiteSpace: "normal",
              py: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            {params.row.policies?.map((p: Policy) => p.name).join(", ")}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 180,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              display: "flex",
              gap: 1,
              height: "100%",
              alignItems: "center",
            }}
          >
            {(role === "admin" || loggedInEmail === params.row.email) && (
              <Button
                size="small"
                variant="contained"
                color="warning"
                onClick={() => {
                  setEditingId(params.row.id);
                  setName(params.row.name);
                  setDepartment(params.row.department);
                  setEmail(params.row.email);
                }}
              >
                Edit
              </Button>
            )}
            {role === "admin" && (
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </Button>
            )}
          </Box>
        ),
      },
    ],
    [role, loggedInEmail],
  );

  return (
    <Layout>
      <Box
        sx={{
          width: "100%",
          pt: 2,
          pl: 0,
          pr: 1,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, ml: 2 }}>
          Employee List
        </Typography>
        <EmployeeForm
          name={name}
          setName={setName}
          department={department}
          setDepartment={setDepartment}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          editingId={editingId}
          handleAdd={handleAdd}
          handleUpdate={handleUpdate}
          clearForm={clearForm}
          role={role}
        />
        <Box sx={{ ml: 2, mr: 1 }}>
          <TextField
            fullWidth
            label="Search Employees Name, Dept, Policies, E-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Box>
        <EmployeeTable
          employees={employees}
          columns={columns}
          loading={loading}
          totalRows={totalRows}
          uiPage={uiPage}
          rowsPerPage={rowsPerPage}
          setUiPage={setUiPage}
          setRowsPerPage={setRowsPerPage}
          setChunkPage={setChunkPage}
          CHUNK_SIZE={CHUNK_SIZE}
          gridRef={gridRef}
          isFetchingMore={isFetchingMore}
        />
      </Box>
    </Layout>
  );
}

export default EmployeeList;
