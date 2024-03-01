import appStore from "/app-store.png";
import playStore from "/play-store.png";

import "./Footer.css";
import { FaLinkedin } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <img src={playStore} alt="Play Store" />

        <img src={appStore} alt="App Store" />
      </div>
      <div className="midFooter">
        <h1>ECOMMERCE.</h1>
        <p>High Quality and on time Delivery</p>
        <p>Copyright 2023 &copy; Ishan</p>
      </div>
      <div className="rightFooter">
        <h4>Follow Us</h4>
        <a href="https://www.linkedin.com/in/ishan-lathwal-4115b574/">
          Linkedin <FaLinkedin />
        </a>
        <a href="https://www.instagram.com/ishanlathwal/">
          Instagram <FaInstagram />{" "}
        </a>
      </div>
    </footer>
  );
};

export default Footer;
