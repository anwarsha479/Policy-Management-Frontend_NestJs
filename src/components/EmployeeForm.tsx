import { Box, TextField, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

function EmployeeForm(props: any) {
  const {
    name,
    setName,
    department,
    setDepartment,
    email,
    setEmail,
    password,
    setPassword,
    editingId,
    handleAdd,
    handleUpdate,
    clearForm,
    role,
  } = props;

  return (
    <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", ml: 2 }}>
      <TextField
        label="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        size="small"
      />

      <TextField
        label="Dept"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
        size="small"
      />

      <TextField
        label="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        size="small"
      />

      {!editingId && (
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          size="small"
        />
      )}

      {editingId ? (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="contained" color="warning" onClick={handleUpdate}>
            Update
          </Button>

          <Button variant="outlined" onClick={clearForm}>
            Cancel
          </Button>
        </Box>
      ) : (
        role === "admin" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            Add
          </Button>
        )
      )}
    </Box>
  );
}

export default EmployeeForm;
