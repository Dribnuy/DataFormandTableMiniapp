import { createAsyncThunk } from "@reduxjs/toolkit";
import type { FormData } from "./types";

export type PaginationResponse = {
  total: number;
  data: FormData[];
};

export type FetchEntriesParams = {
  page: number;
  limit: number;
  useMockData?: boolean;
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchEntries = createAsyncThunk<PaginationResponse, FetchEntriesParams>(
  "form/fetchEntries",
  async ({ page, limit, useMockData = false }, { rejectWithValue }) => {
    try {
      await delay(500); 

     
      if (!useMockData) {
        return {
          total: 0,
          data: [],
        };
      }

    
      return rejectWithValue("Mock data disabled");
    } catch (error) {
      return rejectWithValue("Failed to fetch entries");
    }
  }
);