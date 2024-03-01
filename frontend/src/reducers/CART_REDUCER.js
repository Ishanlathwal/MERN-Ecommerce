import axios from "axios";

const initialState = {
  cartItems: localStorage.getItem("cartItems")
    ? JSON.parse(localStorage.getItem("cartItems"))
    : [],
  shippingInfo: localStorage.getItem("shippingInfo")
    ? JSON.parse(localStorage.getItem("shippingInfo"))
    : {},
};

export const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "add/cart": {
      const item = action.payload;

      const isItemExist = state.cartItems.find(
        (i) => i.productId === item.productId,
      );

      if (isItemExist) {
        return {
          ...state,
          cartItems: state.cartItems.map((i) =>
            i.productId === item.productId ? item : i,
          ),
        };
      } else {
        return { ...state, cartItems: [...state.cartItems, item] };
      }
    }
    case "remove/cart":
      return {
        ...state,
        cartItems: state.cartItems.filter(
          (i) => i.productId !== action.payload,
        ),
      };
    case "shipping/info":
      return { ...state, shippingInfo: action.payload };
    case "empty/cart":
      return {
        ...state,
        cartItems: [],
      };
    default:
      return state;
  }
};

// Add to cart

export const addToCart = (id, quantity) => async (dispatch, getState) => {
  const { data } = await axios.get(
    `http://localhost:4000/api/v1/products/${id}`,
  );
  dispatch({
    type: "add/cart",
    payload: {
      productId: data.product._id,
      name: data.product.name,
      price: data.product.price,
      image: data.product.images[0].url,
      quantity,
      stock: data.product.stock,
    },
  });

  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Remove items from cart
export const removeItemsFromCart = (id) => async (dispatch, getState) => {
  dispatch({ type: "remove/cart", payload: id });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};

// Shipping info

export const saveShippingInfo = (data) => async (dispatch) => {
  dispatch({ type: "shipping/info", payload: data });

  localStorage.setItem("shippingInfo", JSON.stringify(data));
};

// Empty cart after order done
export const emptyCart = () => async (dispatch, getState) => {
  dispatch({ type: "empty/cart" });
  localStorage.setItem("cartItems", JSON.stringify(getState().cart.cartItems));
};
