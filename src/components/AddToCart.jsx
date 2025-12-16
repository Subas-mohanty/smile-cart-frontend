import { Button } from "neetoui";

const AddToCart = ({ isInCart, toggleIsInCart }) => {
  const handleClick = e => {
    e.preventDefault();
    e.stopPropagation();
    toggleIsInCart();
  };

  return (
    <Button
      label={isInCart ? "Remove from cart" : "Add to cart"}
      size="large"
      onClick={e => handleClick(e)}
    />
  );
};

export default AddToCart;
