import axios from "axios";

export const newReviewReducer = (state = {}, action) => {
  switch (action.type) {
    case "review/request":
      return { ...state, loading: true };

    case "review/success":
      return {
        loading: false,
        success: action.payload,
      };
    case "review/reset":
      return {
        ...state,
        success: false,
      };
    case "review/fail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "clear/error":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const clearErrorReview = () => async (dispatch) => {
  dispatch({ type: "clear/error" });
};

export const newReview = (reviewData) => async (dispatch) => {
  try {
    dispatch({ type: "review/request" });

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.patch(
      `http://localhost:4000/api/v1/review`,
      reviewData,
      config,
    );
    dispatch({ type: "review/success", payload: data.success });
  } catch (err) {
    dispatch({ type: "review/fail" });
  }
};
