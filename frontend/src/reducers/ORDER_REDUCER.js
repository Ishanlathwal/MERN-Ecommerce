import axios from "axios";

export const orderReducer = (state = {}, action) => {
  switch (action.type) {
    case "create/orderRequest":
      return { ...state, loading: true };

    case "create/orderSuccess":
      return {
        loading: false,
        order: action.payload,
        successtoast: true,
      };
    case "create/orderFail":
      return { loading: false, error: action.payload };

    case "clear/error":
      return {
        ...state,
        error: null,
      };
  }
};

export const createOrder = (order) => async (dispatch) => {
  try {
    dispatch({ type: "create/orderRequest" });
    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `https://mern-ecommerce-uku0.onrender.com/api/v1/order/new`,
      order,
      config,
    );
    dispatch({ type: "create/orderSuccess", payload: data });
  } catch (err) {
    dispatch({ type: "create/orderFail" });
  }
};

export const clearError = () => async (dispatch) => {
  dispatch({ type: "clear/error" });
};
