import type { RootState } from "../index";

export const selectFormData = (state: RootState) => {
  const { userData, sortConfig, filters } = state.form;
  let filteredData = [...(userData || [])];

  if (filters) {
    if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
      filteredData = filteredData.filter(
        (item) =>
          (filters.ageMin === undefined || item.age >= filters.ageMin) &&
          (filters.ageMax === undefined || item.age <= filters.ageMax)
      );
    }
    if (filters.substring && filters.substring.trim() !== "") {
      const substring = filters.substring.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.firstName.toLowerCase().includes(substring) ||
          item.lastName.toLowerCase().includes(substring) ||
          item.description.toLowerCase().includes(substring)
      );
    }
  }

  if (sortConfig) {
    filteredData.sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  // Пагінація
  const { page, limit } = state.form.pagination;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return filteredData.slice(startIndex, endIndex);
};

export const selectSortConfig = (state: RootState) => state.form.sortConfig;
export const selectFilters = (state: RootState) => state.form.filters;
export const selectPagination = (state: RootState) => state.form.pagination || { page: 1, limit: 10 };
export const selectLoading = (state: RootState) => state.form.loading || false;
export const selectError = (state: RootState) => state.form.error || null;
export const selectTotal = (state: RootState) => state.form.userData.length || 0; // Оновлено total на основі userData