import { Avatar, Button, Typography } from "@mui/material";
import "./About.css";
import { Instagram, LinkedIn } from "@mui/icons-material";
import { Link } from "react-router-dom";

const About = () => {
  const visitInstagram = () => {
    window.location = "https://instagram.com/ishanlathwal";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/dgrokfyqp/image/upload/v1709227207/MicrosoftTeams-image_1_dyhvr1.png"
              alt="Founder"
            />
            <Typography>Ishan Lathwal</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit Instagram
            </Button>
            <span>
              This is a sample wesbite made by @ishanLathwal using MERN Stack.
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Our Brands</Typography>
            <a
              href="https://www.linkedin.com/in/ishan-lathwal-4115b574/"
              target="blank">
              <LinkedIn color="primary" />
            </a>

            <a href="https://instagram.com/ishanlathwal" target="blank">
              <Instagram className="youtubeSvgIcon" />
            </a>
            <Link to="/contact" className="contact">
              Contact{" "}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
