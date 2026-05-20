import { Box, CircularProgress } from "@mui/material";

import { DataGrid, GridColDef } from "@mui/x-data-grid";

interface Props {
  employees: any[];
  columns: GridColDef[];
  loading: boolean;
  totalRows: number;
  uiPage: number;
  rowsPerPage: number;
  setUiPage: React.Dispatch<React.SetStateAction<number>>;
  setRowsPerPage: React.Dispatch<React.SetStateAction<number>>;
  setChunkPage: React.Dispatch<React.SetStateAction<number>>;
  CHUNK_SIZE: number;
  gridRef: React.RefObject<HTMLDivElement | null>;
  isFetchingMore: boolean;
}

function EmployeeTable({
  employees,
  columns,
  loading,
  totalRows,
  uiPage,
  rowsPerPage,
  setUiPage,
  setRowsPerPage,
  setChunkPage,
  CHUNK_SIZE,
  gridRef,
  isFetchingMore,
}: Props) {
  return (
    <Box
      ref={gridRef}
      sx={{
        width: "100%",
        position: "relative",
      }}
    >
      <DataGrid
      autoHeight
        rows={employees}
        columns={columns}
        loading={loading}
        rowCount={totalRows}
        paginationMode="server"
        paginationModel={{
          page: uiPage - 1,
          pageSize: rowsPerPage,
        }}
        onPaginationModelChange={(model) => {
          setUiPage(model.page + 1);
          setRowsPerPage(model.pageSize);
          setChunkPage(
            Math.floor((model.page * model.pageSize) / CHUNK_SIZE) + 1,
          );
        }}
        getRowHeight={() => "auto"}
        disableRowSelectionOnClick
        sx={{
          border: "none",
          overflowX:"hidden",
          "& .MuiDataGrid-cell": {
            padding: "12px 10px",
            borderBottom: "1px solid #f0f0f0",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f8f9fa",
          },
        }}
      />

      {isFetchingMore && !loading && (
        <Box
          sx={{
            position: "absolute",
            bottom: 70,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <CircularProgress size={28} />
        </Box>
      )}
    </Box>
  );
}

export default EmployeeTable;
