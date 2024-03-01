import { useDispatch, useSelector } from "react-redux";
import "./ResetPassword.css";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { clearError } from "../../reducers/USER_REDUCER";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import { Lock, LockOpen } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import {
  clearErrorResetPassword,
  resetPassword,
} from "../../reducers/FORGOT_PASS_REDUCER";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { token } = useParams();

  const { error, success, loading } = useSelector(
    (state) => state.forgotPassword,
  );

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const resetPasswordSubmit = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("password", password);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(resetPassword(token, myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (success) {
      navigate("/login");
      toast.success("Password Updated Successfully");
      dispatch(clearErrorResetPassword());
    }
  }, [dispatch, error, navigate, success]);
  if (loading) return <Loader />;
  return (
    <>
      <MetaData title="Change Password" />
      <div className="resetPasswordContainer">
        <div className="resetPasswordBox">
          <h2 className="resetPasswordHeading">Update Profile</h2>

          <form className="resetPasswordForm" onSubmit={resetPasswordSubmit}>
            <div>
              <LockOpen />
              <input
                type="password"
                placeholder="New Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="loginPassword">
              <Lock />
              <input
                type="password"
                placeholder="Confirm Password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <input type="submit" value="Update" className="resetPasswordBtn" />
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
