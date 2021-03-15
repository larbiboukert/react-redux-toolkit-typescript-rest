import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
  SerializedError,
} from "@reduxjs/toolkit";
import axios from "axios";
import { RootState } from "../../app/store";

interface HttpResponse {
  code: number;
  meta: {
    pagination: { total: number; pages: number; page: number; limit: number };
  };
  data: Product[];
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  discount_amount: string;
  status: boolean;
  categories: { id: number; name: string }[];
}

export const getProducts = createAsyncThunk(
  "products/getProducts",
  async (page: number) => {
    const response = await axios.get(`/products?page=${page}`);
    return response.data as HttpResponse;
  }
);

const productsAdapter = createEntityAdapter<Product>();

const initialState = productsAdapter.getInitialState<{
  status: "idle" | "loading" | "succeeded" | "failed";
  error: SerializedError | null;
}>({
  status: "idle",
  error: null,
});

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProducts.pending, (state, action) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      productsAdapter.setAll(state, action.payload.data);
      state.status = "succeeded";
    });
    builder.addCase(getProducts.rejected, (state, action) => {
      if (state.status === "loading") {
        state.status = "failed";
        state.error = action.error;
      }
    });
  },
});

export const { selectAll: selectAllProducts } = productsAdapter.getSelectors(
  (state: RootState) => state.products
);

export default productsSlice.reducer;
