import { ReactNavbar } from "overlay-navbar";
import logo from "/logo.png";
import { MdAccountCircle } from "react-icons/md";
import { MdSearch } from "react-icons/md";
import { MdAddShoppingCart } from "react-icons/md";

const headerOptions = {
  burgerColor: "#fca96d",
  burgerColorHover: "#0040ff",
  logo,
  logoWidth: "20vmax",
  logoAnimationTime: 2,
  navColor1: "white",
  logoHoverSize: "10px",
  logoHoverColor: "#0040ff",
  link1Text: "Home",
  link2Text: "Product",
  link3Text: "Contact",
  link4Text: "About",
  link1Url: "/",
  link2Url: "/products",
  link3Url: "/contact",
  link4Url: "/about",
  link1Size: "1.3vmax",
  link1Color: "rgba(35,35,35,0.9)",
  nav1justifyContent: "flex-end",
  nav2justifyContent: "flex-end",
  nav3justifyContent: "flex-start",
  nav4justifyContent: "flex-start",
  link1ColorHover: "#0040ff",
  link1Margin: "2vmax",
  profileIconUrl: "/login",
  profileIconColor: "rgba(35,35,35,0.9)",
  searchIconColor: "rgba(35,35,35,0.9)",
  cartIconColor: "rgba(35,35,35,0.9)",
  profileIconColorHover: "#0040ff",
  searchIconColorHover: "#0040ff",
  cartIconColorHover: "#0040ff",
  cartIconMargin: "1vmax",
  profileIcon: true,
  ProfileIconElement: MdAccountCircle,
  searchIcon: true,
  SearchIconElement: MdSearch,
  cartIcon: true,
  CartIconElement: MdAddShoppingCart,
  cartIconUrl: "/cart",
};

////////////////////////////////////////

const Header = () => {
  return <ReactNavbar {...headerOptions} />;
};

export default Header;
