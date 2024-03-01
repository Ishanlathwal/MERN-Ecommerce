import { useDispatch, useSelector } from "react-redux";
import "./ForgotPassword.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clearError } from "../../reducers/USER_REDUCER";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import { MailOutline } from "@mui/icons-material";
import {
  clearErrorResetPassword,
  forgotPassword,
  messageReset,
} from "../../reducers/FORGOT_PASS_REDUCER";
import { useNavigate } from "react-router-dom";
const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, message, loading, toastVariable } = useSelector(
    (state) => state.forgotPassword,
  );
  const [email, setEmail] = useState("");

  const forgotPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("email", email);
    dispatch(forgotPassword(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (message) {
      navigate("/login");
      dispatch(messageReset());
    }
    if (toastVariable) {
      toast.success(message);
      dispatch(clearErrorResetPassword());
    }
  }, [dispatch, error, message, navigate, toastVariable]);

  if (loading) return <Loader />;
  return (
    <>
      <MetaData title="Forgot Password" />
      <div className="forgotPasswordContainer">
        <div className="forgotPasswordBox">
          <h2 className="forgotPasswordHeading">Forgot Password</h2>

          <form className="forgotPasswordForm" onSubmit={forgotPasswordSubmit}>
            <div className="forgotPasswordEmail">
              <MailOutline />
              <input
                type="email"
                placeholder="Email"
                required
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <input type="submit" value="Send" className="forgotPasswordBtn" />
          </form>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;
