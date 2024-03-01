import axios from "axios";

export const myOrderReducer = (state = { orders: [] }, action) => {
  switch (action.type) {
    case "create/myOrderRequest":
      return { loading: true };

    case "create/myOrderSuccess":
      return {
        loading: false,
        orders: action.payload,
        successtoast: true,
      };
    case "create/myOrderFail":
      return { loading: true, error: action.payload };

    case "clear/error":
      return {
        ...state,
        error: null,
        successtoast: false,
      };
    default:
      return state;
  }
};

export const myOrder = () => async (dispatch) => {
  try {
    dispatch({ type: "create/myOrderRequest" });

    const config = {
      withCredentials: true,
    };

    const { data } = await axios.get(
      `http://localhost:4000/api/v1/orders/me`,
      config,
    );

    dispatch({ type: "create/myOrderSuccess", payload: data.orders });
  } catch (err) {
    dispatch({ type: "create/myOrderFail" });
  }
};

export const clearError = () => async (dispatch) => {
  dispatch({ type: "clear/error" });
};

/////////////////////////////////////////////////////////////////////////////////////

export const orderDetailReducer = (state = { order: {} }, action) => {
  switch (action.type) {
    case "order/detailRequest":
      return { loading: true };

    case "order/detailSuccess":
      return {
        loading: false,
        order: action.payload,
        successtoast: true,
      };
    case "order/detailFail":
      return { loading: false, error: action.payload };

    case "clear/error":
      return {
        ...state,
        error: null,
        successtoast: false,
      };
    default:
      return state;
  }
};

export const getOrderDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: "order/detailRequest" });

    const config = {
      withCredentials: true,
    };

    const { data } = await axios.get(
      `http://localhost:4000/api/v1/order/${id}`,
      config,
    );
    dispatch({ type: "order/detailSuccess", payload: data.order });
  } catch (err) {
    dispatch({ type: "order/detailFail" });
  }
};
