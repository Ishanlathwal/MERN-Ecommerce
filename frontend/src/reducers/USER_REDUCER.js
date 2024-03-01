////////
import axios from "axios";

export const userReducer = (state = { user: {} }, action) => {
  switch (action.type) {
    case "login/request":
    case "signup/request":
    case "loadUser/request":
      return {
        loading: true,
        isAuthenticated: false,
      };
    case "login/success":
    case "signup/success":
    case "loadUser/success":
      return {
        ...state,
        loading: false,
        isAuthenticated: true,
        toastVariable: true,
        user: action.payload,
      };
    case "logout/success":
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
      };
    case "login/fail":
    case "signup/fail":
      return {
        ...state,
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case "logout/fail":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    case "loadUser/fail":
      return {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const login = (email, password) => async (dispatch) => {
  try {
    dispatch({ type: "login/request" });

    // withcredentials because of jwt cookie

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    const { data } = await axios.post(
      `http://localhost:4000/api/v1/login`,
      { email, password },
      config,
    );

    dispatch({ type: "login/success", payload: data.user });
  } catch (error) {
    console.log(error.response.data.message);
    dispatch({ type: "login/fail", payload: error.response.data.message });
  }
};

export const clearError = () => async (dispatch) => {
  dispatch({ type: "clear/error" });
};

/////////////////////////Sign up

export const signUp = (userData) => async (dispatch) => {
  try {
    dispatch({ type: "signup/request" });

    const config = {
      withCredentials: true,
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `http://localhost:4000/api/v1/register`,
      userData,
      config,
    );

    dispatch({ type: "signup/success", payload: data.user });
  } catch (error) {
    dispatch({ type: "signup/fail", payload: error.response.data.message });
  }
};

// Load User in begning

export const loadUser = () => async (dispatch) => {
  try {
    dispatch({ type: "loadUser/request" });
    const config = {
      withCredentials: true,
    };

    const { data } = await axios.get(`http://localhost:4000/api/v1/me`, config);

    dispatch({ type: "loadUser/success", payload: data.user });
  } catch (error) {
    dispatch({ type: "loadUser/fail", payload: error.response.data.message });
    dispatch({ type: "clear/error" });
  }
};

//// Log out user

export const logOut = () => async (dispatch) => {
  try {
    const config = {
      withCredentials: true,
    };

    await axios.post(`http://localhost:4000/api/v1/logout`, null, config);

    dispatch({ type: "logout/success" });
  } catch (error) {
    dispatch({ type: "logout/fail", payload: error.response.data.message });
  }
};
