import axios from "axios";

export const forgotPasswordReducer = (state = {}, action) => {
  switch (action.type) {
    case "forgot/request":
    case "resetPassword/request":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "forgot/success":
      return {
        ...state,
        loading: false,
        message: action.payload,
        toastVariable: true,
      };
    case "resetPassword/success":
      return {
        ...state,
        loading: false,
        success: action.payload,
      };
    case "forgot/fail":
    case "resetPassword/fail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case "clear/error":
      return {
        ...state,
        error: null,
        toastVariable: false,
        success: false,
      };
    case "message/reset":
      return {
        ...state,
        message: null,
      };
    default:
      return state;
  }
};

// forgot password send email
export const forgotPassword = (email) => async (dispatch) => {
  try {
    dispatch({ type: "forgot/request" });

    const config = {
      headers: { "Content-Type": "application.json" },
    };

    const { data } = await axios.post(
      `http://localhost:4000/api/v1/forgotpassword`,
      email,
      config,
    );
    await dispatch({ type: "forgot/success", payload: data.message });
  } catch (error) {
    dispatch({ type: "forgot/fail", payload: error.response.data.message });
  }
};

////
export const clearErrorResetPassword = () => async (dispatch) => {
  dispatch({ type: "clear/error" });
};

export const messageReset = () => async (dispatch) => {
  dispatch({ type: "message/reset" });
};

// forgot password reset password

export const resetPassword = (token, passwords) => async (dispatch) => {
  try {
    dispatch({ type: "resetPassword/request" });

    const config = {
      headers: { "Content-Type": "application.json" },
    };

    const { data } = await axios.patch(
      `http://localhost:4000/api/v1/users/resetpassword/${token}`,
      passwords,
      config,
    );
    await dispatch({ type: "resetPassword/success", payload: data.success });
  } catch (error) {
    dispatch({
      type: "resetPassword/fail",
      payload: error.response.data.message,
    });
  }
};
