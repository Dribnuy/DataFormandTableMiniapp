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
      await delay(500); // Simulate API delay

      // Якщо useMockData = false, повертаємо пустий масив
      if (!useMockData) {
        return {
          total: 0,
          data: [],
        };
      }

      // Якщо в майбутньому захочете повернутися до мокових даних, логіка тут
      return rejectWithValue("Mock data disabled");
    } catch (error) {
      return rejectWithValue("Failed to fetch entries");
    }
  }
);