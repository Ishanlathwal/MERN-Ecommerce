import axios from "axios";

export const profileReducer = (state = {}, action) => {
  switch (action.type) {
    case "profile/request":
    case "password/request":
      return {
        ...state,
        loading: true,
      };
    case "profile/success":
    case "password/success":
      return {
        ...state,
        loading: false,
        isUpdated: action.payload,
        toastVariable: true,
      };

    case "profile/fail":
    case "password/fail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "profile/reset":
    case "password/reset":
      return {
        ...state,
        isUpdated: false,
      };

    case "clear/error":
      return {
        ...state,
        error: null,
        toastVariable: false,
      };
    default:
      return state;
  }
};

// update user email/name

export const updateUserProfile = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "profile/request" });

    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.patch(
      `http://localhost:4000/api/v1/me/update`,
      userData,
      config,
    );

    dispatch({ type: "profile/success", payload: data.success });
  } catch (error) {
    dispatch({ type: "profile/fail", payload: error.response.data.message });
  }
};

// update user password

export const updateUserPassword = (password) => async (dispatch) => {
  try {
    dispatch({ type: "password/request" });

    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.patch(
      `http://localhost:4000/api/v1/user/update`,
      password,
      config,
    );

    dispatch({ type: "password/success", payload: data.success });
  } catch (error) {
    dispatch({ type: "password/fail", payload: error.response.data.message });
  }
};
