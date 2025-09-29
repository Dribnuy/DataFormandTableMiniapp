import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Sidebar from "../components/Sidebar";
import {
  selectFormData,
  selectSortConfig,
  selectFilters,
  selectPagination,
  selectLoading,
  selectError,
  selectTotal,
} from "../store/form-service/selectors";
import type { FormData } from "../store/form-service/types";
import {
  addFormData,
  editFormData,
  deleteFormData,
  setSortConfig,
  setFilters,
  setPagination,
  fetchEntries,
} from "../store/form-service/formSlice";
import { useState, useEffect } from "react";
import { ROUTES } from "../core/constants";
import type { AppDispatch } from "../store";
import { ButtonPagination } from "../components/PaginationComponents";

import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Input,
  Paper,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";

type PaginationType = "button" | "scroll";

const GradientBox = styled(Box)(({ theme }) => ({
  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  minHeight: "100vh",
  display: "flex",
}));

const ContentBox = styled(Box)(({ theme }) => ({
  flex: 1,
  padding: theme.spacing(2),
  display: "flex",
  flexDirection: "column",
}));

const FilterCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: 12,
  background: "linear-gradient(to left, #a3bffa, #d4a4eb)", // Змінено на градієнт для узгодженості
  marginBottom: theme.spacing(3), // Збільшено відступ
}));

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  backgroundColor: "#ffffff",
  borderRadius: 12,
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  marginBottom: theme.spacing(2),
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 600,
  backgroundColor: "#4a90e2",
  color: "#ffffff",
  cursor: "pointer",
  transition: "all 0.2s ease",
  "&:hover": {
    backgroundColor: "#357abd",
  },
}));

export default function TablePage() {
  const { t } = useTranslation();
  const data = useSelector(selectFormData);
  const sortConfig = useSelector(selectSortConfig);
  const filters = useSelector(selectFilters);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const total = useSelector(selectTotal);
  const dispatch = useDispatch<AppDispatch>();

  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editData, setEditData] = useState<FormData>({
    id: "",
    firstName: "",
    lastName: "",
    age: 0,
    description: "",
  });
  const [ageMin, setAgeMin] = useState<number | undefined>(filters?.ageMin);
  const [ageMax, setAgeMax] = useState<number | undefined>(filters?.ageMax);
  const [substring, setSubstring] = useState<string>(filters?.substring || "");
  const [paginationType, setPaginationType] = useState<PaginationType>("button");
  const [infiniteData, setInfiniteData] = useState<FormData[]>([]);

  useEffect(() => {
    if (paginationType === "button" && total === 0) {
      dispatch(fetchEntries({ page: pagination.page, limit: pagination.limit, useMockData: false }));
    } else if (paginationType === "scroll" && total === 0) {
      setInfiniteData([]);
      dispatch(fetchEntries({ page: 1, limit: pagination.limit, useMockData: false }));
    }
  }, [dispatch, paginationType, pagination.limit, total]);

  useEffect(() => {
    if (paginationType === "scroll" && data.length > 0) {
      if (pagination.page === 1) {
        setInfiniteData(data);
      } else {
        setInfiniteData((prev) => [...prev, ...data]);
      }
    }
  }, [data, pagination.page, paginationType]);

  useEffect(() => {
    if (paginationType === "scroll") {
      const handleScroll = () => {
        if (
          window.innerHeight + document.documentElement.scrollTop >=
            document.documentElement.offsetHeight - 1000 &&
          !loading &&
          pagination.page * pagination.limit < total
        ) {
          const nextPage = pagination.page + 1;
          dispatch(setPagination({ ...pagination, page: nextPage }));
          dispatch(fetchEntries({ page: nextPage, limit: pagination.limit, useMockData: false }));
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [loading, total, pagination, dispatch, paginationType]);

  const applyFilters = () => {
    dispatch(setFilters({ ageMin, ageMax, substring }));
    dispatch(setPagination({ page: 1, limit: pagination.limit }));
    setInfiniteData([]);
  };

  const clearFilters = () => {
    setAgeMin(undefined);
    setAgeMax(undefined);
    setSubstring("");
    dispatch(setFilters({}));
    dispatch(setPagination({ page: 1, limit: pagination.limit }));
    setInfiniteData([]);
  };

  const handleSort = (key: keyof FormData) => {
    dispatch(
      setSortConfig({
        key,
        direction:
          sortConfig?.key === key && sortConfig.direction === "asc" ? "desc" : "asc",
      })
    );
    dispatch(setPagination({ page: 1, limit: pagination.limit }));
    setInfiniteData([]);
  };

  const handleEdit = (index: number) => {
    const actualData = paginationType === "scroll" ? infiniteData : data;
    setEditIndex(index);
    setEditData(actualData[index]);
  };

  const handleSaveEdit = () => {
    if (editIndex !== null) {
      dispatch(editFormData({ index: editIndex, updatedData: editData }));
      setEditIndex(null);
    }
  };

  const handleDelete = (index: number) => {
    dispatch(deleteFormData(index));
  };

  const handlePageChange = (page: number) => {
    dispatch(setPagination({ ...pagination, page }));
    dispatch(fetchEntries({ page, limit: pagination.limit, useMockData: false }));
  };

  const handleLimitChange = (newLimit: number) => {
    dispatch(setPagination({ page: 1, limit: newLimit }));
    setInfiniteData([]);
  };

  const totalPages = Math.ceil(total / pagination.limit);
  const currentData = paginationType === "scroll" ? infiniteData : data;

  const getSortIcon = (column: keyof FormData) => {
    if (sortConfig?.key === column) {
      return sortConfig.direction === "asc" ? "↑" : "↓";
    }
    return "";
  };

  return (
    <GradientBox>
      <Sidebar />
      <ContentBox>
        <Container maxWidth="xl">
          <Typography
            variant="h4"
            component="h2"
            sx={{
              color: "#e0e7ff",
              fontWeight: "bold",
              marginBottom: 4,
              textAlign: "center",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            {t("table.title")}
          </Typography>

          <Box sx={{ display: "flex", justifyContent: "center", gap: 2, marginBottom: 4 }}>
            <Button
              variant={paginationType === "button" ? "contained" : "outlined"}
              onClick={() => setPaginationType("button")}
              sx={{
                backgroundColor: paginationType === "button" ? "#ffffff" : "transparent",
                color: paginationType === "button" ? "#4a90e2" : "#e0e7ff",
                borderColor: "#e0e7ff",
                "&:hover": {
                  backgroundColor: paginationType === "button" ? "#f0f4ff" : "rgba(224, 231, 255, 0.2)",
                },
              }}
            >
              {t("table.pagination.buttonPagination")}
            </Button>
            <Button
              variant={paginationType === "scroll" ? "contained" : "outlined"}
              onClick={() => setPaginationType("scroll")}
              sx={{
                backgroundColor: paginationType === "scroll" ? "#ffffff" : "transparent",
                color: paginationType === "scroll" ? "#4a90e2" : "#e0e7ff",
                borderColor: "#e0e7ff",
                "&:hover": {
                  backgroundColor: paginationType === "scroll" ? "#f0f4ff" : "rgba(224, 231, 255, 0.2)",
                },
              }}
            >
              {t("table.pagination.infiniteScroll")}
            </Button>
          </Box>

          <FilterCard>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, marginBottom: 3 }}>
                <Typography variant="h6" color="#a3bffa">
                  Filters
                </Typography>
              </Box>

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, marginBottom: 3 }}>
                <TextField
                  type="number"
                  value={ageMin ?? ""}
                  onChange={(e) =>
                    setAgeMin(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder={t("table.filters.ageMin")}
                  fullWidth
                  InputProps={{ sx: { backgroundColor: "#ffffff", borderRadius: 8 } }}
                  sx={{ maxWidth: { sm: "30%" } }}
                />
                <TextField
                  type="number"
                  value={ageMax ?? ""}
                  onChange={(e) =>
                    setAgeMax(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  placeholder={t("table.filters.ageMax")}
                  fullWidth
                  InputProps={{ sx: { backgroundColor: "#ffffff", borderRadius: 8 } }}
                  sx={{ maxWidth: { sm: "30%" } }}
                />
                <TextField
                  type="text"
                  value={substring}
                  onChange={(e) => setSubstring(e.target.value)}
                  placeholder={t("table.filters.searchSubstring")}
                  fullWidth
                  InputProps={{ sx: { backgroundColor: "#ffffff", borderRadius: 8 } }}
                  sx={{ maxWidth: { sm: "30%" } }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  justifyContent: "space-between",
                  flexDirection: { xs: "column", sm: "row" },
                  flexWrap: "wrap",
                }}
              >
                <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Button
                    variant="contained"
                    onClick={applyFilters}
                    disabled={loading}
                    sx={{
                      background: "linear-gradient(to right, #4a90e2, #7b61ff)",
                      color: "#ffffff",
                      "&:hover": {
                        background: "linear-gradient(to right, #357abd, #5f4bb6)",
                      },
                      "&:disabled": { opacity: 0.5 },
                    }}
                  >
                    {t("table.filters.apply")}
                  </Button>
                  <Button
                    variant="contained"
                    onClick={clearFilters}
                    disabled={loading}
                    sx={{
                      background: "linear-gradient(to right, #718096, #4a5568)",
                      color: "#ffffff",
                      "&:hover": {
                        background: "linear-gradient(to right, #4a5568, #2d3748)",
                      },
                      "&:disabled": { opacity: 0.5 },
                    }}
                  >
                    {t("table.filters.clear")}
                  </Button>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="body2" color="#a3bffa">
                    {t("table.filters.itemsPerPage")}
                  </Typography>
                  <Select
                    value={pagination.limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    disabled={loading}
                    sx={{
                      backgroundColor: "#ffffff",
                      borderRadius: 8,
                      minWidth: 80,
                      height: 36,
                      color: "#2d3748",
                    }}
                  >
                    <MenuItem value={5}>5</MenuItem>
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                  </Select>
                </Box>
              </Box>
            </CardContent>
          </FilterCard>

          {loading && currentData.length === 0 && (
            <Box sx={{ display: "flex", justifyContent: "center", paddingY: 4 }}>
              <Box
                sx={{
                  width: 48,
                  height: 48,
                  border: "4px solid #e0e7ff",
                  borderBottom: "4px solid transparent",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                }}
              />
            </Box>
          )}

          {!loading && currentData.length === 0 ? (
            <Paper sx={{ padding: 4, textAlign: "center", backgroundColor: "#f7fafc", borderRadius: 12 }}>
              <Typography variant="h6" color="#718096" gutterBottom>
                {t("table.pagination.noData")}
              </Typography>
              <Typography variant="body2" color="#a0aec0" sx={{ marginBottom: 2 }}>
                {t("table.pagination.noDataHint")}
              </Typography>
              <Button
                component={Link}
                to={ROUTES.FORM}
                variant="contained"
                sx={{
                  backgroundColor: "#4a90e2",
                  color: "#ffffff",
                  "&:hover": { backgroundColor: "#357abd" },
                }}
              >
                {t("navigation.form")}
              </Button>
            </Paper>
          ) : (
            <>
              <StyledTableContainer>
                <Table stickyHeader>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell onClick={() => handleSort("firstName")}>
                        {t("table.name")} {getSortIcon("firstName")}
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSort("lastName")}>
                        {t("table.surname")} {getSortIcon("lastName")}
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSort("age")}>
                        {t("table.age")} {getSortIcon("age")}
                      </StyledTableCell>
                      <StyledTableCell onClick={() => handleSort("description")}>
                        {t("table.description")} {getSortIcon("description")}
                      </StyledTableCell>
                      <StyledTableCell sx={{ minWidth: 150 }}>
                        {t("table.actions")}
                      </StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {currentData.map((row, i) => (
                      <TableRow
                        key={row.id}
                        sx={{
                          "&:nth-of-type(odd)": { backgroundColor: "#f7fafc" },
                          "&:hover": { backgroundColor: "#edf2f7" },
                        }}
                      >
                        <TableCell sx={{ color: "#2d3748" }}>{row.firstName}</TableCell>
                        <TableCell sx={{ color: "#2d3748" }}>{row.lastName}</TableCell>
                        <TableCell sx={{ color: "#2d3748" }}>{row.age}</TableCell>
                        <TableCell sx={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#2d3748" }}>
                          {row.description}
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
                            <Button
                              onClick={() => handleEdit(i)}
                              variant="contained"
                              color="warning"
                              sx={{ minWidth: 60, padding: "4px 8px", backgroundColor: "#f6ad55", "&:hover": { backgroundColor: "#ed8936" } }}
                            >
                              {t("table.edit")}
                            </Button>
                            <Button
                              onClick={() => handleDelete(i)}
                              variant="contained"
                              color="error"
                              sx={{ minWidth: 60, padding: "4px 8px", backgroundColor: "#e53e3e", "&:hover": { backgroundColor: "#c53030" } }}
                            >
                              {t("table.delete")}
                            </Button>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </StyledTableContainer>

              {paginationType === "button" && (
                <ButtonPagination
                  currentPage={pagination.page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  loading={loading}
                />
              )}

              {paginationType === "scroll" && loading && currentData.length > 0 && (
                <Box sx={{ display: "flex", justifyContent: "center", marginTop: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      border: "4px solid #e0e7ff",
                      borderBottom: "4px solid transparent",
                      borderRadius: "50%",
                      animation: "spin 1s linear infinite",
                    }}
                  />
                </Box>
              )}

              {paginationType === "scroll" &&
                !loading &&
                currentData.length > 0 &&
                pagination.page * pagination.limit >= total && (
                  <Paper sx={{ textAlign: "center", marginTop: 2, padding: 2, backgroundColor: "#f7fafc", borderRadius: 12 }}>
                    <Typography color="#a0aec0">
                      {t("table.pagination.noMoreData")}
                    </Typography>
                  </Paper>
                )}
            </>
          )}

          {currentData.length > 0 && (
            <Paper sx={{ marginTop: 2, padding: 2, backgroundColor: "#f7fafc", borderRadius: 12, textAlign: "center" }}>
              <Typography variant="body2" color="#718096">
                {t("table.pagination.showing", { count: currentData.length, total })}
              </Typography>
            </Paper>
          )}

          <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
            <Button
              component={Link}
              to={ROUTES.FORM}
              variant="contained"
              sx={{
                backgroundColor: "#4a90e2",
                color: "#ffffff",
                fontWeight: "bold",
                paddingX: 4,
                paddingY: 1.5,
                borderRadius: 8,
                boxShadow: "0 4px 12px rgba(74, 144, 226, 0.3)",
                "&:hover": {
                  backgroundColor: "#357abd",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 16px rgba(74, 144, 226, 0.4)",
                },
                transition: "all 0.3s ease",
              }}
            >
              {t("form.backToTable")}
            </Button>
          </Box>

          <Dialog open={editIndex !== null} onClose={() => setEditIndex(null)} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography variant="h6" color="#4a90e2">
                  {t("table.editEntry")}
                </Typography>
              </Box>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 1 }}>
                <Input
                  value={editData.firstName}
                  onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
                  placeholder={t("placeholders.firstName")}
                  fullWidth
                  sx={{ backgroundColor: "#ffffff", borderRadius: 8 }}
                />
                <Input
                  value={editData.lastName}
                  onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
                  placeholder={t("placeholders.lastName")}
                  fullWidth
                  sx={{ backgroundColor: "#ffffff", borderRadius: 8 }}
                />
                <Input
                  type="number"
                  value={editData.age}
                  onChange={(e) =>
                    setEditData({
                      ...editData,
                      age: parseInt(e.target.value) || 0,
                    })
                  }
                  placeholder={t("placeholders.age")}
                  fullWidth
                  sx={{ backgroundColor: "#ffffff", borderRadius: 8 }}
                />
                <Input
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  placeholder={t("placeholders.description")}
                  fullWidth
                  multiline
                  rows={3}
                  sx={{ backgroundColor: "#ffffff", borderRadius: 8 }}
                />
              </Box>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditIndex(null)} color="inherit" sx={{ color: "#718096" }}>
                {t("table.cancel")}
              </Button>
              <Button onClick={handleSaveEdit} variant="contained" sx={{ backgroundColor: "#4a90e2", "&:hover": { backgroundColor: "#357abd" } }}>
                {t("table.save")}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </ContentBox>
    </GradientBox>
  );
}