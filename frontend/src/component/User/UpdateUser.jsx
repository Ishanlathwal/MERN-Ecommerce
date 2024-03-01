import { useDispatch, useSelector } from "react-redux";
import "./UpdateUser.css";
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import MetaData from "../layout/MetaData";
import { Face, MailOutline } from "@mui/icons-material";
import { updateUserProfile } from "../../reducers/PROFILE_REDUCER";
import { clearError, loadUser } from "../../reducers/USER_REDUCER";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.user);
  const { error, isUpdated, loading } = useSelector((state) => state.profile);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState();
  const [avatarPreview, setAvatarPreview] = useState("/Profile.png");

  const updateProfileSubmit = (e) => {
    e.preventDefault();

    // const myForm = new FormData();
    // myForm.set("name", name);
    // myForm.set("email", email);
    // myForm.set("avatar", avatar);

    // form data se cloudinary p file upload nhi ho rhi thi 500 kb se jyda islia json bana k dia data

    const data = {
      name,
      email,
      avatar,
    };
    dispatch(updateUserProfile(data));
  };

  const updateProfileDataChange = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(reader.result);
      }
    };

    reader.readAsDataURL(e.target.files[0]);
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setAvatarPreview(user.avatar.url);
      setAvatar(user.avatar.url);
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }

    if (isUpdated) {
      toast.success("Profile Updated Successfully");
      dispatch(loadUser());

      navigate("/account");

      dispatch({
        type: "profile/reset",
      });
    }
  }, [dispatch, error, user, isUpdated, navigate]);

  if (loading) return <Loader />;
  return (
    <>
      <MetaData title="Update Profile" />
      <div className="updateProfileContainer">
        <div className="updateProfileBox">
          <h2 className="updateProfileHeading">Update Profile</h2>

          <form
            className="updateProfileForm"
            encType="multipart/form-data"
            onSubmit={updateProfileSubmit}>
            <div className="updateProfileName">
              <Face />
              <input
                type="text"
                placeholder="Name"
                required
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="updateProfileEmail">
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

            <div id="updateProfileImage">
              <img src={avatarPreview} alt="Avatar Preview" />
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateProfileDataChange}
              />
            </div>
            <input type="submit" value="Update" className="updateProfileBtn" />
          </form>
        </div>
      </div>
      ;
    </>
  );
};

export default UpdateUser;
