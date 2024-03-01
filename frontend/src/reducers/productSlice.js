import { createSlice } from "@reduxjs/toolkit";
// import axios from "axios";
// import { useDispatch } from "react-redux";

const initialState = {
  product: [],
  loading: false,
};

const productReducer = createSlice({
  name: "product",
  initialState,
  reducers: {
    request: (state) => {
      state.loading = true;
      state.product = [];
    },
    success: (state, action) => {
      state.loading = false;
      state.product = action.payload.products;
      state.productsCount = action.products.productsCount;
    },
    fail: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    noErrors: (state) => {
      state.error = null;
    },
  },
});

export const { request, success, fail, noErrors } = productReducer.actions;
export default productReducer.reducer;

// const getProduct = (payload) => async (dispatch, getState) => {

//   try {
//     dispatch({ type: "product/request" });

//     const { data } = await axios.get("/api/v1/products");

//     dispatch({ type: "product/success", payload: data });

//   } catch (err) {

//     dispatch({ type: "product/fail", payload: err.response.data.message });

//   }
// };
