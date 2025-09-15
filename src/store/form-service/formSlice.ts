import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FormData, FormState } from "./types";
import { initialState } from "./initialState";
import { fetchEntries, type PaginationResponse } from "./asyncActions";

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addFormData: (state: FormState, action: PayloadAction<FormData>) => {
      console.log("Adding data to Redux:", action.payload);
      state.userData.push(action.payload);
    },
    editFormData: (
      state: FormState,
      action: PayloadAction<{ index: number; updatedData: FormData }>
    ) => {
      const { index, updatedData } = action.payload;
      console.log("Editing data at index:", index, "with:", updatedData);
      if (index >= 0 && index < state.userData.length) {
        state.userData[index] = updatedData;
      }
    },
    deleteFormData: (state: FormState, action: PayloadAction<number>) => {
      const index = action.payload;
      console.log("Deleting data at index:", index);
      if (index >= 0 && index < state.userData.length) {
        state.userData.splice(index, 1);
      }
    },
    clearFormData: (state: FormState) => {
      console.log("Clearing all data");
      state.userData = [];
    },
    setSortConfig: (
      state: FormState,
      action: PayloadAction<{ key: keyof FormData; direction: "asc" | "desc" }>
    ) => {
      state.sortConfig = action.payload;
    },
    setFilters: (
      state: FormState,
      action: PayloadAction<{
        ageMin?: number;
        ageMax?: number;
        substring?: string;
      }>
    ) => {
      if (Object.keys(action.payload).length === 0) {
        state.filters = undefined;
      } else {
        state.filters = { ...state.filters, ...action.payload };
      }
    },
    setPagination: (
      state: FormState,
      action: PayloadAction<{ page: number; limit: number }>
    ) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEntries.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEntries.fulfilled, (state, action: PayloadAction<PaginationResponse>) => {
        state.loading = false;
        state.data = action.payload.data; // Порожній масив, якщо useMockData = false
        state.total = action.payload.total; // 0, якщо useMockData = false
        state.error = null;
      })
      .addCase(fetchEntries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || "Failed to fetch entries";
      });
  },
});

export const {
  addFormData,
  editFormData,
  deleteFormData,
  clearFormData,
  setSortConfig,
  setFilters,
  setPagination,
} = formSlice.actions;

export default formSlice.reducer;
export { fetchEntries };