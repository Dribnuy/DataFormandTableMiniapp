import type { RootState } from "../index";

export const selectFormData = (state: RootState) => {
  const { data, sortConfig, filters } = state.form;
  let filteredData = [...data];

  if (filters) {
    if (filters.ageMin !== undefined || filters.ageMax !== undefined) {
      filteredData = filteredData.filter(
        (item) =>
          (filters.ageMin === undefined || item.age >= filters.ageMin) &&
          (filters.ageMax === undefined || item.age <= filters.ageMax),
      );
    }
    if (filters.substring && filters.substring.trim() !== "") {
      const substring = filters.substring.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.firstName.toLowerCase().includes(substring) ||
          item.lastName.toLowerCase().includes(substring) ||
          item.description.toLowerCase().includes(substring),
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

  return filteredData;
};

export const selectSortConfig = (state: RootState) => state.form.sortConfig;
