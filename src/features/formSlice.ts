import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export type FormData = {
  id: string; 
  firstName: string;
  lastName: string;
  age: number;
  description: string;
};

const initialState: { data: FormData[] } = {
  data: [], 
};

const formSlice = createSlice({
  name: 'form',
  initialState,
  reducers: {
    addFormData: (state, action: PayloadAction<FormData>) => {
      console.log("Adding data to Redux:", action.payload);
      state.data.push(action.payload);
    },
    editFormData: (state, action: PayloadAction<{ index: number; updatedData: FormData }>) => {
      const { index, updatedData } = action.payload;
      console.log("Editing data at index:", index, "with:", updatedData);
      if (index >= 0 && index < state.data.length) {
        state.data[index] = updatedData;
      }
    },
    deleteFormData: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      console.log("Deleting data at index:", index);
      if (index >= 0 && index < state.data.length) {
        state.data.splice(index, 1);
      }
    },
    clearFormData: (state) => {
      console.log("Clearing all data");
      state.data = [];
    },
  },
});

export const { addFormData, editFormData, deleteFormData, clearFormData } = formSlice.actions;
export default formSlice.reducer;