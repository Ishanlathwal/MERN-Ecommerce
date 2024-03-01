import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./reducers/productSlice";
import { productApi } from "./reducers/productRTKquery";
import { userReducer } from "./reducers/USER_REDUCER";
import { profileReducer } from "./reducers/PROFILE_REDUCER";
import { forgotPasswordReducer } from "./reducers/FORGOT_PASS_REDUCER";
import { cartReducer } from "./reducers/CART_REDUCER";
import {
  myOrderReducer,
  orderDetailReducer,
} from "./reducers/MY_ORDER_REDUCER";
import { newReviewReducer } from "./reducers/NEW_REVIEW_REDUCER";

const store = configureStore({
  reducer: {
    product: productReducer,

    user: userReducer,
    profile: profileReducer,
    forgotPassword: forgotPasswordReducer,
    cart: cartReducer,
    newOrder: cartReducer,
    myOrder: myOrderReducer,
    orderDetails: orderDetailReducer,
    newReview: newReviewReducer,
    // products rtk m reducer path h ye dena h
    products: productApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(productApi.middleware),
});
export default store;
