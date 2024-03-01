/* eslint-disable react/prop-types */
import { Link } from "react-router-dom";
import "./CartItemCard..css";

const CartItemCard = ({ item }) => {
  return (
    <>
      <div className="main">
        <Link className="link" to={`/product/${item.productId}`}>
          <div className="CartItemCard">
            <img src={item.image} alt="ssa" className="img" />
            <div className="div">
              <span className="span"> {item.name}</span>

              <span className="span">{`Price: ₹${item.price}`}</span>
            </div>
          </div>
        </Link>
        <span className="span2">Available Stock : {item.stock}</span>
      </div>
    </>
  );
};

export default CartItemCard;
