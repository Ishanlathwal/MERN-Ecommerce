import { useEffect } from "react";
import Header from "./component/layout/Header/Header";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import Footer from "./component/layout/Footer/Footer";
import Home from "./component/Home/Home";
import "./App.css";
import SingleProductComponent from "./component/Products/SingleProductComponent";
import Products from "./component/Product/Products";
import Search from "./component/Product/Search";
import LoginSignup from "./component/User/LoginSignup";
import store from "./reduxStore";
import { loadUser } from "./reducers/USER_REDUCER";
import { useSelector } from "react-redux";
import UserOptions from "./component/layout/Header/UserOptions";
import UserProfile from "./component/User/UserProfile";
import UpdateUser from "./component/User/UpdateUser";
import PasswordUpdate from "./component/User/PasswordUpdate";
import ForgotPassword from "./component/User/ForgotPassword";
import ResetPassword from "./component/User/ResetPassword";
import Cart from "./component/Cart/Cart";
import Shipping from "./component/Cart/Shipping";
import ConfirmOrder from "./component/Cart/ConfirmOrder";
import Payment from "./component/Cart/Payment";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./component/Cart/OrderSuccess";
import MyOrders from "./component/Orders/MyOrders";
import OrderDetails from "./component/Orders/OrderDetails";
import Dashboard from "./component/Admin/Dashboard";
import Loader from "./component/Loader/Loader";
import {
  RequireAuth,
  RequireAuthAdmin,
} from "./component/Utils/ProtectedRoutes";
import ProductList from "./component/Admin/ProductList";
import NewProduct from "./component/Admin/NewProduct";
import UpdateProduct from "./component/Admin/UpdateProduct";
import OrderList from "./component/Admin/OrderList";
import ProcessOrder from "./component/Admin/ProcessOrder";
import UsersList from "./component/Admin/UsersList";
import UpdateUserAdmin from "./component/Admin/UpdateUserAdmin";
import ProductReviews from "./component/Admin/ProductReviews";
import Contact from "./component/layout/Contact/Contact";
import About from "./component/layout/About/About";
import NotFound from "./component/layout/NotFound/NotFound";

const App = () => {
  // const [stripeApiKey, setStripeApiKey] = useState("");

  // async function getStripeApiKet() {
  //   const config = {
  //     withCredentials: true,
  //   };

  //   const { data } = await axios.get(
  //     `http://localhost:4000/api/v1/stripeapikey`,
  //     config,
  //   );

  //   setStripeApiKey(data.stripeApiKey);
  // }
  // window.addEventListener("contextmenu", (e) => e.preventDefault());

  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans", "Chilanka"],
      },
    });
    store.dispatch(loadUser());
  }, []);

  const { loading, isAuthenticated, user } = useSelector((state) => state.user);

  if (loading) return <Loader />;
  return (
    <>
      <Elements
        stripe={loadStripe(
          "pk_test_51On4VASA8lGw6n9w7UPWJhoN5UZTTdnyM0RGpturE86qBmur5JLa662ukZIoED5oNqXOvdfzoW4lhgsMH6s1v6Hb00hVl4Gm9X",
        )}>
        <Router>
          <Header />
          {isAuthenticated && <UserOptions user={user} />}
          <Routes>
            <Route extact path="/" element={<Home />} />
            <Route path="/product/:id" element={<SingleProductComponent />} />
            <Route extact path="/products" element={<Products />} />
            <Route path="/products/:keyword" element={<Products />} />
            <Route path="/login" element={<LoginSignup />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
            <Route
              extact
              path="/account"
              element={
                <RequireAuth>
                  <UserProfile />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/me/update"
              element={
                <RequireAuth>
                  <UpdateUser />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/password/update"
              element={
                <RequireAuth>
                  <PasswordUpdate />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/password/forgot"
              element={<ForgotPassword />}
            />

            <Route
              extact
              path="/api/v1/users/resetpassword/:token"
              element={<ResetPassword />}
            />

            <Route exact path="/cart" element={<Cart />} />

            <Route
              extact
              path="/shipping"
              element={
                <RequireAuth>
                  <Shipping />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/order/confirm"
              element={
                <RequireAuth>
                  <ConfirmOrder />
                </RequireAuth>
              }
            />

            <Route
              path="/order/:id"
              element={
                <RequireAuth>
                  <OrderDetails />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/process/payment"
              element={
                <RequireAuth>
                  <Payment />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/success"
              element={
                <RequireAuth>
                  <OrderSuccess />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/orders"
              element={
                <RequireAuth>
                  <MyOrders />
                </RequireAuth>
              }
            />

            <Route
              extact
              path="/admin/dashboard"
              element={
                <RequireAuthAdmin>
                  <Dashboard />
                </RequireAuthAdmin>
              }
            />

            <Route
              extact
              path="/admin/products"
              element={
                <RequireAuthAdmin>
                  <ProductList />
                </RequireAuthAdmin>
              }
            />
            <Route
              extact
              path="/admin/product"
              element={
                <RequireAuthAdmin>
                  <NewProduct />
                </RequireAuthAdmin>
              }
            />
            <Route
              extact
              path="/admin/product/:id"
              element={
                <RequireAuthAdmin>
                  <UpdateProduct />
                </RequireAuthAdmin>
              }
            />
            <Route
              extact
              path="/admin/orders"
              element={
                <RequireAuthAdmin>
                  <OrderList />
                </RequireAuthAdmin>
              }
            />
            <Route
              extact
              path="/admin/order/:id"
              element={
                <RequireAuthAdmin>
                  <ProcessOrder />
                </RequireAuthAdmin>
              }
            />
            <Route
              extact
              path="/admin/users"
              element={
                <RequireAuthAdmin>
                  <UsersList />
                </RequireAuthAdmin>
              }
            />
            <Route
              extact
              path="/admin/user/:id"
              element={
                <RequireAuthAdmin>
                  <UpdateUserAdmin />
                </RequireAuthAdmin>
              }
            />

            <Route
              extact
              path="/admin/reviews"
              element={
                <RequireAuthAdmin>
                  <ProductReviews />
                </RequireAuthAdmin>
              }
            />

            <Route path="/search" element={<Search />} />
          </Routes>
          <Footer />
        </Router>
      </Elements>
    </>
  );
};

export default App;
// this one for create product and login rtk query

// const [data2] = useLoginMutation(); //Rtk Query

// const [data3] = useCreateProductsMutation(); //Rtk Query
// const [status, setStatus] = useState();
// const click = () => {
//   const data = {
//     email: "test@test.com",
//     password: "password",
//   };
//   data2(data)
//     .unwrap()
//     .then((res) => {
//       setStatus((prev) => (prev = res.success));
//     })
//     .catch((err) => {
//       setStatus((prev) => (prev = err.data.status));
//     });
// };
// console.log(status);

// const click2 = () => {
//   const data = {
//     name: "sample produt 3",
//     price: 1100,
//     description: "this is sample product 2",
//     category: "machine",
//     images: {
//       public_id: "sample image",
//       url: "sample url",
//     },
//   };
//   data3(data);

//   console.log("create product success");
// };

/* <button onClick={click}>login</button>
      <button onClick={click2}>create product</button> */
