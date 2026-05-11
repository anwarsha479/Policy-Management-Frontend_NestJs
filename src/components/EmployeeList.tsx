import { useEffect, useMemo, useState } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import {Container,Paper,Typography,TextField,Button,} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AddIcon from "@mui/icons-material/Add";

const API_URL = process.env.REACT_APP_API_URL;

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
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [name, setName] = useState<string>("");
  const [department, setDepartment] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const loggedInEmail = localStorage.getItem("email");

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${API_URL}/employee?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();
      setEmployees(data.data || []);
      setTotalPages(data.meta?.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setEditingId(null);
    setName("");
    setDepartment("");
    setEmail("");
    setPassword("");
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) {
      return;
    }
    try {
      await fetch(`${API_URL}/employee/delete/${id}`, {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchEmployees();
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdate = async () => {
    try {
      await fetch(`${API_URL}/employee/update/${editingId}`, {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          department,
          email,
        }),
      });
      fetchEmployees();
      clearForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    try {
      await fetch(`${API_URL}/employee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          department,
          email,
          password,
        }),
      });
      fetchEmployees();
      clearForm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };
  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "id",
        headerName: "ID",
        width: 80,
      },
      {
        field: "name",
        headerName: "Name",
        width: 150,
      },
      {
        field: "department",
        headerName: "Department",
        width: 150,
      },
      {
        field: "email",
        headerName: "Email",
        width: 220,
      },
      {
        field: "policies",
        headerName: "Policies",
        width: 500,
        sortable: false,
        renderCell: (params) => {
          return (
            <div
              style={{
                whiteSpace: "normal",
                wordBreak: "break-word",
                lineHeight: "20px",
                padding: "10px 0",
              }}
            >
              {params.row.policies
                ?.map((policy: Policy) => policy.name)
                .join(", ")}
            </div>
          );
        },
      },
      {
        field: "actions",
        headerName: "Actions",
        width: 220,
        sortable: false,
        renderCell: (params) => (
          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "8px",
            }}
          >
            {role === "admin" && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDelete(params.row.id)}
              >
                Delete
              </Button>
            )}

            {(role === "admin" || loggedInEmail === params.row.email) && (
              <Button
                variant="contained"
                color="warning"
                size="small"
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
          </div>
        ),
      },
    ],
    [role, loggedInEmail],
  );
  useEffect(() => {
    fetchEmployees();
  }, [page]);
  return (
    <Container maxWidth="xl">
      <Paper
        elevation={4}
        sx={{
          padding: 4,
          marginTop: 4,
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontWeight: "bold",
          }}
        >
          Employee List
        </Typography>

        <Button
          variant="contained"
          color="error"
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            mb: 3,
          }}
        >
          Logout
        </Button>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <TextField
            label="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />
          <TextField
            label="Department"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            fullWidth
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
          {!editingId && (
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
            />
          )}
        </div>
        {editingId ? (
          <Button
            variant="contained"
            color="warning"
            onClick={handleUpdate}
            sx={{
              mb: 3,
            }}
          >
            Update Employee
          </Button>
        ) : (
          role === "admin" && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAdd}
              sx={{
                mb: 3,
              }}
            >
              Add Employee
            </Button>
          )
        )}

        {loading && <Typography>Loading...</Typography>}
        <div
          style={{
            height: 600,
            width: "100%",
            marginTop: "20px",
          }}
        >
          <DataGrid
            autoHeight
            rows={employees}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            hideFooterPagination
            pageSizeOptions={[10]}
            getRowHeight={() => "auto"}
            sx={{
              borderRadius: 3,

              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f5f5",
                fontSize: "16px",
                fontWeight: "bold",
              },
              "& .MuiDataGrid-cell": {
                alignItems: "center",
                display: "flex",
              },
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
            marginTop: "24px",
          }}
        >
          <Button
            variant="outlined"
            disabled={page === 1}
            onClick={() => {
              if (page > 1) {
                setPage(page - 1);
              }
            }}
          >
            Previous
          </Button>

          <Typography>
            Page {page} of {totalPages}
          </Typography>

          <Button
            variant="outlined"
            disabled={page === totalPages}
            onClick={() => {
              if (page < totalPages) {
                setPage(page + 1);
              }
            }}
          >
            Next
          </Button>
        </div>
      </Paper>
    </Container>
  );
}
export default EmployeeList;