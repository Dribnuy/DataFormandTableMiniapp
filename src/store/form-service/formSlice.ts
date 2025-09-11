import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { FormData, FormState } from "./types";
import { initialState } from "./initialState";

const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    addFormData: (state: FormState, action: PayloadAction<FormData>) => {
      console.log("Adding data to Redux:", action.payload);
      state.data.push(action.payload);
    },
    editFormData: (
      state: FormState,
      action: PayloadAction<{ index: number; updatedData: FormData }>,
    ) => {
      const { index, updatedData } = action.payload;
      console.log("Editing data at index:", index, "with:", updatedData);
      if (index >= 0 && index < state.data.length) {
        state.data[index] = updatedData;
      }
    },
    deleteFormData: (state: FormState, action: PayloadAction<number>) => {
      const index = action.payload;
      console.log("Deleting data at index:", index);
      if (index >= 0 && index < state.data.length) {
        state.data.splice(index, 1);
      }
    },
    clearFormData: (state: FormState) => {
      console.log("Clearing all data");
      state.data = [];
    },
    setSortConfig: (
      state: FormState,
      action: PayloadAction<{ key: keyof FormData; direction: "asc" | "desc" }>,
    ) => {
      state.sortConfig = action.payload;
    },
    setFilters: (
      state: FormState,
      action: PayloadAction<{
        ageMin?: number;
        ageMax?: number;
        substring?: string;
      }>,
    ) => {
      if (Object.keys(action.payload).length === 0) {
        state.filters = undefined;
      } else {
        state.filters = { ...state.filters, ...action.payload };
      }
    },
  },
});

export const {
  addFormData,
  editFormData,
  deleteFormData,
  clearFormData,
  setSortConfig,
  setFilters,
} = formSlice.actions;
export default formSlice.reducer;
