import { useEffect, useMemo, useState } from "react";
import { Box, Typography, TextField, MenuItem, Paper, Button,} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Layout from "../components/Layout";
import { getPoliciesApi, createPolicyApi, updatePolicyApi, deletePolicyApi,} from "../services/api";

interface Employee {
  id: number;
  name: string;
}

interface Policy {
  id: number;
  name: string;
  benefits: string;
  amount: string;
  startDate: string;
  endDate: string;
  employees: Employee[];
}

function Policies() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // ✅ FORM STATES
  const [name, setName] = useState("");
  const [benefits, setBenefits] = useState("");
  const [amount, setAmount] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ✅ DEBOUNCE SEARCH
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  // ✅ FETCH POLICIES
  const fetchPolicies = async () => {
    try {
      setLoading(true);
      const response = await getPoliciesApi(
        page,
        limit,
        debouncedSearch,
        token || "",
      );
      setPolicies(response.data || []);
      setTotalPages(response.meta?.totalPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies();
  }, [page, limit, debouncedSearch]);

  // ✅ CLEAR FORM
  const clearForm = () => {
    setEditingId(null);
    setName("");
    setBenefits("");
    setAmount("");
    setStartDate("");
    setEndDate("");
  };

  // ✅ CREATE POLICY
  const handleAddPolicy = async () => {
    try {
      const payload = {
        name,
        benefits,
        amount: Number(amount),
        startDate,
        endDate,
      };
      console.log(payload);
      const response = await createPolicyApi(payload, token || "");
      console.log(response);
      alert("Policy Added");
      fetchPolicies();
      clearForm();
    } catch (error: any) {
      console.log(error);
      alert(JSON.stringify(error));
    }
  };

  // ✅ UPDATE POLICY
  const handleUpdatePolicy = async () => {
  try {
    await updatePolicyApi(
      editingId!,
      {
        name,
        benefits,
        amount: Number(amount),
        startDate,
        endDate,
      },
      token || "",
    );
    fetchPolicies();
    clearForm();
  } catch (error) {
    console.log(error);
  }
};

  // ✅ DELETE POLICY
  const handleDeletePolicy = async (id: number) => {
    const confirmDelete = window.confirm("Delete this policy?");
    if (!confirmDelete) return;
    try {
      await deletePolicyApi(id, token || "");
      fetchPolicies();
    } catch (error) {
      console.log(error);
    }
  };

  // ✅ DATAGRID COLUMNS
  const columns: GridColDef[] = useMemo(
    () => [
      { field: "id", headerName: "ID", width: 80 },
      {
        field: "name",
        headerName: "Policy Name",
        flex: 1,
        minWidth: 200,
      },
      {
        field: "benefits",
        headerName: "Benefits",
        flex: 1,
        minWidth: 220,
      },
      {
        field: "amount",
        headerName: "Amount",
        flex: 1,
        minWidth: 120,
      },
      {
        field: "startDate",
        headerName: "Start Date",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "endDate",
        headerName: "End Date",
        flex: 1,
        minWidth: 140,
      },
      {
        field: "employees",
        headerName: "Employees",
        flex: 2,
        minWidth: 300,
        sortable: false,
        renderCell: (params) => (
          <Box
            sx={{
              whiteSpace: "normal",
              wordBreak: "break-word",
              py: 1,
            }}
          >
            {params.row.employees
              ?.map((employee: Employee) => employee.name)
              .join(", ")}
          </Box>
        ),
      },
      {
        field: "actions",
        headerName: "Actions",
        minWidth: 200,
        sortable: false,
        renderCell: (params) => (
          <Box sx={{ display: "flex", gap: "10px" }}>
            <Button
              variant="contained"
              color="warning"
              size="small"
              onClick={() => {
                setEditingId(params.row.id);
                setName(params.row.name);
                setBenefits(params.row.benefits);
                setAmount(params.row.amount);
                setStartDate(params.row.startDate);
                setEndDate(params.row.endDate);
              }}
            >
              Edit
            </Button>
            {role === "admin" && (
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={() => handleDeletePolicy(params.row.id)}
              >
                Delete
              </Button>
            )}
          </Box>
        ),
      },
    ],
    [role],
  );

  return (
    <Layout>
      <Box sx={{ width: "100%", overflowX: "hidden" }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", mb: 4 }}>
          Policies
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
            mb: 3,
          }}
        >
          <TextField
            label="Policy Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Benefits"
            value={benefits}
            onChange={(e) => setBenefits(e.target.value)}
          />
          <TextField
            label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <TextField
            type="date"
            label="Start Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
          <TextField
            type="date"
            label="End Date"
            slotProps={{ inputLabel: { shrink: true } }}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </Box>

        {editingId ? (
          <Button
            variant="contained"
            color="warning"
            onClick={handleUpdatePolicy}
            sx={{ mb: 3 }}
          >
            Update Policy
          </Button>
        ) : (
          role === "admin" && (
            <Button
              variant="contained"
              onClick={handleAddPolicy}
              sx={{ mb: 3 }}
            >
              Add Policy
            </Button>
          )
        )}

        <Box sx={{ display: "flex", gap: "16px", flexWrap: "wrap", mb: 3 }}>
          <TextField
            label="Search Policies"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: "350px" }}
          />
          <TextField
            select
            label="Rows Per Page"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            sx={{ width: "180px" }}
          >
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </TextField>
        </Box>

        <Paper elevation={3} sx={{ borderRadius: "18px", overflow: "hidden" }}>
          <DataGrid
            rows={policies}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            getRowHeight={() => "auto"}
            pagination
            paginationMode="server"
            rowCount={totalPages * limit}
            pageSizeOptions={[10, 25, 50]}
            paginationModel={{ page: page - 1, pageSize: limit }}
            onPaginationModelChange={(model) => {
              setPage(model.page + 1);
              setLimit(model.pageSize);
            }}
            sx={{
              border: "none",
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f8fafc",
                fontWeight: "bold",
              },
              // FIX FOR TOUCHING THE LINE:
              "& .MuiDataGrid-cell": {
                display: "flex",
                alignItems: "center", // Vertically centers text
                padding: "12px 10px", // Adds padding to top/bottom/left/right
              },
            }}
          />
        </Paper>
      </Box>
    </Layout>
  );
}

export default Policies;
