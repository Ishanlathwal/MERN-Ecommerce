import { Button } from "@mui/material";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contactContainer">
      <div className="mailBtn">
        <h1 className="heading">Mobile :- 9630000025</h1>

        <a className="mailBtn2" href="mailto:ishanlathwal23@gmail.com">
          <Button className="btnn">Contact: ishanlathwal23@gmail.com</Button>
        </a>
      </div>
    </div>
  );
};

export default Contact;
